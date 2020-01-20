import React, {Component} from 'react';
import { Button } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table} from 'react-bootstrap'

class MapView extends  Component{
    constructor(props){
        super(props);   
        this.state = {
            connected:false

        }
        this.submit = this.submit.bind(this);
    }

    handleSelected= (selectedTemp, selectedHumi, selectedPm10, selectedTime) =>{
        this.setState({
            selectedTemp,
            selectedHumi,
            selectedPm10,
            selectedTime,
        })
    }

    submit(){
        console.log("submit");
    }
    render() {

        var temp,humi, pm10, time;
        if(this.props.lastMeasurement){
            temp = this.props.lastMeasurement.properties.temp;
            humi = this.props.lastMeasurement.properties.humi;
            pm10 = this.props.lastMeasurement.properties.pm10;
            time = this.props.lastMeasurement.properties.time;

        }
        return (
            <Container fluid>
                <div>
                    <OwnMap/>
                </div>
                <Row style={{'marginTop':'5px'}}>
                    <Col md={8}>
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
                            <td>{this.state.selectedTemp ? this.state.selectedTemp + " °C" : temp +" °C"}</td>
                            <td>{this.state.selectedTime ? this.state.selectedTime + "": time +""}</td>
                            </tr>
                            <tr>
                            <td>2</td>
                            <td>PM10</td>
                            <td>{this.state.selectedPm10 ? this.state.selectedPm10 + " µg/m³": pm10 +" µg/m³"}</td>
                            <td>{this.state.selectedTime ? this.state.selectedTime + "": time +""}</td>
                            </tr>
                            <tr>
                            <td>3</td>
                            <td>rel. Luftfeuchtigkeit</td>
                            <td>{this.state.selectedHumi ? this.state.selectedHumi +" %" : humi +" %"}</td>
                            <td>{this.state.selectedTime ? this.state.selectedTime + "": time +""}</td>
                            </tr>
                        </tbody>
                        </Table>
                    </Col>
                    <Col md={4}>
                        <Card >
                            <Card.Body>
                                <Card.Title>Connection overview</Card.Title>
                                <Card.Text>
                                Click here to manage your connection to the eco bike
                                </Card.Text>
                                <Button style={{"margin": "15px"}} variant="contained" color="primary">
                                Check if Bike is on Track
                            </Button>
                            {/* If clause to decide which button to display */}
                            {this.state.connected 
                                ? <Button 
                                    style={{"margin": "15px"}} 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={this.disconnectMQTT}
                                    >Disconnect from MQTT
                                </Button>
                                : 
                                <Button 
                                    style={{"margin": "15px"}} 
                                    variant="contained"
                                    color="primary" 
                                    onClick={this.connectMQTT}
                                    >Connect to the Bike
                                </Button>
                            }                    </Card.Body>
                            </Card>
                        </Col>
                        
                    </Row>

                <Row>
                    <Col md={8}>
                        
                    </Col>
                    <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Add comments to the measured data</Card.Title>
                            <Card.Text>Crucial information about how to understand the dataset e.g. "High PM10 values because we were standing behind a bus can be added here.</Card.Text>
                            <form onSubmit={this.submit}>
                                <label>
                                    <textarea value={this.state.value} onChange={this.handleChange}></textarea>
                                </label>
                                <input style={{"margin": "15px"}} type="submit" value="Submit"/>
                            </form>

                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
        );
    }


}

export default MapView;
