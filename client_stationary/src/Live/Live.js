import React, {Component} from 'react';
import { Button } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table} from 'react-bootstrap'

var client;

var Paho = require('paho-mqtt');

const server_ip = '10.6.4.7';
const server_port = 9001;

var client = null;
var topic = '#';
var topic = 'TestNick';

const featureGroup = {geoJson: {
    "type": "FeatureCollection",
    "features": [
    ]
}
}


class Live extends  Component{
    constructor(props){
        super(props);
        this.state = {
            connected:false,
            liveRoute: featureGroup

        }
        this.connectMQTT = this.connectMQTT.bind(this);
        this.disconnectMQTT = this.disconnectMQTT.bind(this);
        this.submit = this.submit.bind(this);

    }

    componentDidMount= () => {
        this.connectMQTT();
    }


    handleSelected= (selectedTemp, selectedHumi, selectedPm10, selectedTime) =>{
        this.setState({
            selectedTemp,
            selectedHumi,
            selectedPm10,
            selectedTime,
        })
    }

    addMarker = (values) => {
        console.log(values)
        const geoJSON = JSON.parse(JSON.stringify(this.state.liveRoute));

        geoJSON.geoJson.features.push(values);
        this.setState({ liveRoute: geoJSON, lastMeasurement: values })
    }

    connectMQTT() {
        const self=this;
        // generating random clientID
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        client = new Paho.Client(server_ip, server_port, uniqid);
        client.onConnectionLost = this.onConnectionLost;
        client.onMessageArrived = this.onMessageArrived;

        // connect the client
        client.connect({ onSuccess: this.onConnect.bind(this) });
    };

 // called when a message arrives
       onMessageArrived= (message) => {

         //  if(message.destinationName === "TestNick"){
             this.addMarker(JSON.parse(message.payloadString))
         //  }
       }

    // called when the client loses its connection
    onConnectionLost(responseObject) {
        const self=this;
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost: " + responseObject.errorMessage);
            //self.setState({connected: false})
            //TODO connectMQTT + delay
        }
    };

    // called when the client connects
    onConnect() {
        console.log("MQTT Broker Connect: Success");
        client.subscribe(topic);
        this.setState({connected: true})
    };

    // simple disconnect handler, stes state of connected variable
    disconnectMQTT(){
        console.log("Disconnecting from MQTT now")
        this.setState({connected:false})
        client.end()
    }
    submit(){
        console.log("submit");
    }
    render() {
        var temp,humi, pm10, time;
        if(this.state.lastMeasurement){
            temp = this.state.lastMeasurement.properties.temp;
            humi = this.state.lastMeasurement.properties.humi;
            pm10 = this.state.lastMeasurement.properties.pm10;
            time = this.state.lastMeasurement.properties.time;

        }
        return (
            <Container fluid>
                <div>
                    <OwnMap route={this.state.liveRoute} handleSelected={this.handleSelected}/>
                </div>
                <Row style={{'margin-top':'5px'}} fluid>
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
                            }                    
                            </Card.Body>
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

export default Live;