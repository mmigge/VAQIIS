import React, { Component } from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import OwnDropzone from './Dropzone';

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = { date: "null", route: null, data:[], dates : [{ value: "null", label: "dd-mm-yyyy" }] }
        this.downloadSelectedRoute = this.downloadSelectedRoute.bind(this)
    }




    componentWillMount() {
        for (var date of this.state.data) {
            this.dates.push({ value: date.date, label: date.date })
        }
        console.log(this.dates)
    }

    handleSelected= (selectedTemp, selectedHumi, selectedPm10, selectedTime) =>{
        console.log(selectedHumi)
        this.setState({
            selectedTemp,
            selectedHumi,
            selectedPm10,
            selectedTime,
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
            route = null;
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

    updateState= (state, value) =>{
        const self=this;
        this.setState({[state]: value}, () => {
            const dates= [{ value: "null", label: "dd-mm-yyyy" }]
            for (var date of self.state.data) {
                dates.push({ value: date.date, label: this.transfromDate(date.date) })
            }
            this.setState({dates})
        })
    }

    transfromDate = function(date) {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
      
        return  (dd>9 ? '' : '0') + dd +"-" +(mm>9 ? '' : '0') + mm + "-" + date.getFullYear();
      };

    downloadSelectedRoute() {
        if(this.state.route == "null" || this.state.route == null){
            alert("Please select Route to download");
            return;
        }
        this.downloadObjectAsJson(this.state.route.geoJson, this.transfromDate(this.state.route.date))
    }

    render() {
        return (
            <Container fluid>
                <div>
                    <OwnMap route={this.state.route} handleSelected={this.handleSelected}/>
                </div>
                <Row>
                    <Col md={8}>
                        <Card style={{ 'margin-top': '5px' }}>
                            <Card.Body>
                                <Card.Title>Hier kannst du Details zu der ausgewählten Route betrachten.</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Sensor</th>
                                            <th>Messwert</th>
                                            <th>Zeit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Temperatur</td>
                                            <td>{this.state.selectedTemp + " °C"}</td>
                                            <td>{this.state.selectedTime + ""}</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>PM10</td>
                                            <td>{this.state.selectedPm10 + " µg/m³"}</td>
                                            <td>{this.state.selectedTime + ""}</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>rel. Luftfeuchtigkeit</td>
                                            <td>{this.state.selectedHumi +" %" }</td>
                                            <td>{this.state.selectedTime + ""}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card style={{ 'margin-top': '5px' }}>
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
                                    {this.state.dates.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <br></br>
                                <Button onClick={this.downloadSelectedRoute} variant="primary">Diese Route herunterladen</Button>
                                <div>
                                    <h3>Upload csv Data of Route</h3>
                                    <OwnDropzone data={this.state.data}  updateState={this.updateState}/>
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