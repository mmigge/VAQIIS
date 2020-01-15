
import React, { Component } from 'react';
import { Avatar, Button, Dialog, DialogContent, DialogTitle, DialogActions, CircularProgress, Chip, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import csv from 'csvtojson';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

//import './Dropzone.css';

const style = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};


class OwnDropzone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            steps:60
        };
    }

    handleChange(files) {
        this.setState({
            file: files[files.length - 1]
        });
    }

    uploadFolder() {
        const self = this;
        this.setState({ loading: true, errorMessage: null })
        var reader = new FileReader();
        reader.onload = async function () {
            const csvString = reader.result
            const jsonArray = await csv({ output: "json" }).fromString(csvString);
            console.log(jsonArray)
            self.transformJson(jsonArray)
        }
        reader.readAsText(this.state.file);
    }

    onChange(value){
        value= parseInt(value)
        let error = false;
        if(value< 0){
            error = true;
        }
        this.setState({steps: value, error})
    }

    transformJson = (json) => {
        const self = this;
        try {
            const data = this.props.data;
            const label = new Date(json[2].TIMESTAMP);
            const geoJson = {
                "type": "FeatureCollection",
                "features": []
            }
            for (var i = 2; i < json.length; i += this.state.steps) {
                console.log(i)
                const coordinates = [json[i].rmclatitude, json[i].rmclongitude]
                const transformedCoordinates = this.convertGPSData(coordinates)
                const feature = {
                    "type": "Feature",
                    "properties": { temp: json[i].AirTC_Avg, humi: json[i].RH_Avg, pm10: json[i].LiveBin_10dM, time: new Date(json[i].TIMESTAMP) },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            transformedCoordinates.longitude,
                            transformedCoordinates.latitude
                        ]
                    }
                }
                geoJson.features.push(feature);
            }
            data.push({ date: label, geoJson: geoJson })
            console.log(data)
            this.props.updateState("data", data);
            this.setState({ success: true, loading: false })
            setTimeout(function () { self.handleClose(); }, 3000);
        }
        catch (e) {
            this.setState({ failed: true, loading: false })
        }
        setTimeout(function () { self.handleClose(); }, 3000);

    }

    handleClose() {
        this.setState({ open: false, file: null, loading: false, success: false, failed: false })
    }

    handleDelete() {
        this.setState({ file: null })
    }

    openDialog() {
        this.setState({ open: true })
    }

    convertGPSData(coordinateObjectString) {
        // Leading zeros not allowed --> string
        const position = coordinateObjectString;

        let lat_temp_1 = parseFloat(position[0].split('.')[0].substring(0, 2));
        let lat_temp_2 = parseFloat(position[0].split(lat_temp_1)[1]) / 60;
        let lat = lat_temp_1 + lat_temp_2;

        let long_temp_1 = parseFloat(position[1].split('.')[0].substring(0, 3));
        let long_temp_2 = parseFloat(position[1].split(long_temp_1)[1]) / 60;
        let long = long_temp_1 + long_temp_2;

        const coordinates = {
            latitude: lat,
            longitude: long
        }
        return coordinates;
    }

    render() {
        return (
            <div>

                <Button
                    className="uploadButton" variant="contained" color="primary"
                    onClick={this.openDialog.bind(this)}>
                    Upload CSV
                </Button>
                <Dialog open={this.state.open} onClose={() => this.handleClose()} >
                    <DialogTitle> {this.state.title}</DialogTitle>
                    {this.state.errorMessage ?
                        <div>
                            <DialogContent>
                                {this.state.errorMessage}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose.bind(this)} color="primary">
                                    OK
                             </Button>

                            </DialogActions> </div> :
                        <DialogContent style={{ textAlign: "center", "overflow-y": "unset" }}>
                            <Dropzone onDrop={acceptedFiles => this.handleChange(acceptedFiles)}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps({ style })}>
                                            <input {...getInputProps()} />
                                            {!this.state.file ? <p>Drag 'n' drop some files here, or click to select files</p> :
                                                <Chip
                                                    label={this.state.file.name}
                                                    onDelete={() => this.handleDelete()}
                                                />
                                            }
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                            <br/>
                            <TextField
                                style={{width: "170px"}}
                                id="outlined-number"
                                label="Time Steps in Seconds"
                                type="number"
                                value={this.state.steps}
                                onChange={(e) => this.onChange(e.target.value)}
                                inputProps={{ min: "0", step: "10", style:{textAlign : "center"}}}
                                defaultValue={60}
                                error={this.state.error}
                                InputLabelProps={{
                                    style:{textAlign : "center"},
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                            <br />
                            <br/>
                            <Button
                                className="uploadButton" variant="contained" color="primary" 
                                onClick={this.uploadFolder.bind(this)} disabled={!this.state.file || this.state.success || this.state.loading || this.state.failed|| this.state.error}>
                                Load
                             </Button>
                            <br />
                            <br />
                            {this.state.loading ? <CircularProgress  /> : ""}
                            {this.state.success ?
                                <Avatar style={{ backgroundColor: "green", color: "white", left:"45%" }}>
                                    <CheckIcon />
                                </Avatar>
                                : ""}
                            {this.state.failed ?
                                <Avatar style={{ backgroundColor: "red", color: "white", left:"45%"}}>
                                    <ClearIcon />
                                </Avatar>
                                : ""}
                        </DialogContent>
                    }
                </Dialog>

            </div>
        )
    }
}

export default withRouter(OwnDropzone);