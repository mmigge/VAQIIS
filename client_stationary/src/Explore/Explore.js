import React, { Component } from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
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
        this.state = { date: "null", route: featureGroup, data:[], dates : [{ value: "null", label: "dd-mm-yyyy" }] }
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
            this.setState({dates : dates, date: value[value.length -1].date, route: value[value.length -1]})
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
                    <OwnMap route={this.state.route} handleSelected={this.handleSelected}/>
                </div>
                <Row>
                    <Col md={8}>
                        <Card style={{ 'marginTop': '5px' }}>
                            <Card.Body>
                                <Card.Title>Hier kannst du Details zu der ausgewählten Route betrachten.</Card.Title>
                                <div style={{maxHeight : "300px", overflow: "auto"}}>
                        <Table striped bordered hover style={{ width: "100%"}}>
                            <thead>
                                <tr >
                                    <th>#</th>
                                    <th>Temp °C</th>
                                    <th>PM10 µg/m³</th>
                                    <th>r.F. %</th>
                                    <th>Zeit</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr >
                                    <td>Selected</td>
                                    <td>{this.state.selectedTemp}</td>
                                    <td>{this.state.selectedPm10}</td>
                                    <td>{this.state.selectedHumi}</td>
                                    <td>{this.transfromDate(this.state.selectedTime)}</td>
                                </tr>
                                {this.state.route.geoJson.features.map((item, i) => {
                                    return (<tr>
                                        <td>{i}</td>
                                        <td>{item.properties.temp}</td>
                                        <td>{item.properties.pm10}</td>
                                        <td>{item.properties.humi}</td>
                                        <td>{this.transfromDate(item.properties.time)}</td>
                                    </tr>)
                                })}
                                
                               
                            </tbody>
                          
                        </Table>
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