import React, { Component } from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import ExploreMap from '../ExploreMap/ExploreMap'
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import OwnDropzone from './Dropzone';
import axios from 'axios';

import '../index.css'


const featureGroup = {geoJson: {
    "type": "FeatureCollection",
    "features": [
    ]
}
}

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = { date: "null", 
        route: featureGroup, 
        data:[], 
        dates : [{ value: "null", label: "dd-mm-yyyy" }],
        shortcuts: {
            AirTC_Avg: "°C",
            LiveBin_1dM: "P10",
            RH_Avg: "%",
            compass_heading: "S/N/W/E",
            CPC_aux: "CPC",
            CO2: "CO2",
            u: 'u',
            v: 'v',
            w: 'w',
            Ts: 'Ts',
            time:'Time'
        }, }
        this.downloadSelectedRoute = this.downloadSelectedRoute.bind(this)
    }




    componentWillMount() {
        const self=this;
        axios.get('http://giv-project2:9000/api/course')
                .then(res => {
                    const dates= self.state.dates
                    for (var date of res.data) {
                        dates.push({ value: date.date, label: self.transfromDate(date.date) })
                    }
                    self.setState({data: res.data, dates: dates})
                    console.log(this.dates)
                  })
        console.log(this.dates)
    }

    handleSelected= (selected) =>{
        this.setState({
selected
        })
    }

    downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }

    handlechange = (e) => {

        const value = e.target.value
        let route;
        if (value == "null") {
            this.handleSelected();
            route = featureGroup;
        }
        else {
        for (var data of this.state.data) {
              if (data.date === value) {
                 route = data
                }
      }
        }
        this.setState({ date: value, route: route })
    }

    uploadRoute = (route) =>{
                axios.post('http://giv-project2:9000/api/course', {route})
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                  })

        };

    updateState= (state, value) =>{
        const self=this;
        this.setState({[state]: value}, () => {
            if(state== "data"){
            self.uploadRoute(value[value.length -1])
            const dates= [{ value: "null", label: "dd-mm-yyyy" }]
            for (var date of self.state.data) {
                dates.push({ value: date.date, label: this.transfromDate(date.date) })
            }
            console.log(value[value.length -1])
            this.setState({dates : dates, date: value[value.length -1].date, route:{geoJson: value[value.length -1].geoJson}})
        }
        })
    }

    transfromDate = function (date) {

        if (!date) { return "" }
        date = new Date(date)
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
        var hours = date.getHours();
        var min = date.getMinutes();

        return (dd > 9 ? '' : '0') + dd + "-" + (mm > 9 ? '' : '0') + mm + "-" + date.getFullYear() + " " + (hours > 9 ? '' : '0') + hours + ":" + (min > 9 ? '' : '0') + min;
    };

    downloadSelectedRoute() {
        if(JSON.stringify(this.state.route) == JSON.stringify(featureGroup) || this.state.route == null){
            alert("Please select Route to download");
            return;
        }
        this.downloadObjectAsJson(this.state.route.geoJson, this.transfromDate(this.state.route.date))
    }

    render() {
        return (
            <Container fluid>
                <div>
                    <ExploreMap route={this.state.route} handleSelected={this.handleSelected}/>
                </div>
                <Row>
                    <Col md={8}>
                        <Card style={{ 'marginTop': '5px' }}>
                            <Card.Body>
                                <Card.Title>Hier kannst du Details zu der ausgewählten Route betrachten.</Card.Title>
                         <div style={{ maxHeight: "300px", overflow: "auto" }}>
                             {this.state.route.geoJson.features.length > 0? 
                            <Table striped bordered hover style={{ width: "100%", fontSize: "x-small" }}>
                                <thead>
                                    <tr>
                                        {Object.keys(this.state.route.geoJson.features[0].properties).map((key, index) => {
                                            if (this.state.shortcuts[key]) {
                                                return <th key={"id" + index}>{this.state.shortcuts[key]}</th>
                                            }
                                            else return
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.selected ?
                                        <tr>
                                            {Object.keys(this.state.selectedMeasurement.properties).map((key, i) => {
                                                if (this.state.shortcuts[key]) {
                                                    return <td className="customtd selected" key={"selected" + i}>{this.state.selectedMeasurement.properties[key]}</td>
                                                }
                                            })}
                                        </tr>
                                        : null}
                                    {this.state.route.geoJson.features.map((item, i) => {
                                            return (
                                                <tr key={"id2" + i}>
                                                    {Object.keys(item.properties).map((key, index) => {
                                                        if (this.state.shortcuts[key]) {
                                                            return <td className="customtd" key={"ad2" + index} >{item.properties[key]}</td>
                                                        }
                                                    })
                                                    }
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>: ""}
                        </div>
                        
                            </Card.Body>
                        </Card>
                        
                    </Col>
                    <Col md={4}>
                        <Card style={{ 'marginTop': '5px' }}>
                            <Card.Body>
                                <Card.Title>Wähle eine vorherige Route aus um sie auf der Karte anzuzeigen.</Card.Title>
                                <TextField
                                    id="standard-select-date"
                                    select
                                    label=""
                                    value={this.state.date}
                                    onChange={this.handlechange.bind(this)}
                                    margin="normal"
                                    variant="outlined"
                                    placholder="dd-mm-yyyy"
                                >
                                    {this.state.dates.map((option,i) => (
                                        <MenuItem key={"keyMenu"+i} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <br></br>
                                <Button onClick={this.downloadSelectedRoute} variant="primary">Diese Route herunterladen</Button>
                                <div>
                                    <h3>Upload csv Data of Route</h3>
                                    <OwnDropzone data={this.state.data}  updateState={this.updateState} sc={this.state.shortcuts}/>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        );
    }


}

export default Explore;