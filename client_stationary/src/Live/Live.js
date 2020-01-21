import React, {Component} from 'react';
import { Button } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table} from 'react-bootstrap'

import '../index.css'

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

    transfromDate = function(date) {

        if(!date){return ""}
        date = new Date(date)
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
      
        return  (dd>9 ? '' : '0') + dd +"-" +(mm>9 ? '' : '0') + mm + "-" + date.getFullYear() + " " + date.getHours() + ":" +date.getMinutes();
      };
    render() {
               return (
            <Container fluid>
                <div>
                    <OwnMap route={this.state.liveRoute} handleSelected={this.handleSelected}/>
                </div>
                <Row style={{'margin-top':'5px'}} fluid>
                    <Col md={8}>
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
                                {this.state.liveRoute.geoJson.features.map((item, i) => {
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