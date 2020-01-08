import React, {Component} from 'react';
import { Button } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table} from 'react-bootstrap'

var mqtt = require('mqtt')
var client

const exampleData= {geojson :{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {temp : 2, humi: 10, pm10: 2, time: new Date("2020-01-01")},
        "geometry": {
          "type": "Point",
          "coordinates": [
            7.6100921630859375,
            51.967115491837404
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {temp: 1, humi: 20, pm10: 4, time: new Date("2020-01-01")},
        "geometry": {
          "type": "Point",
          "coordinates": [
            7.6306915283203125,
            51.95230623740452
          ]
        }
      }
    ]
  }
}


class Live extends  Component{
    constructor(props){
        super(props);
        this.state = {
            username:'erictg96@googlemail.com',
            password:'9157fbb4',
            connected:false

        }
        this.connectMQTT = this.connectMQTT.bind(this);
        this.disconnectMQTT = this.disconnectMQTT.bind(this);
        this.submit = this.submit.bind(this);
    }

    connectMQTT(){
        console.log("connectMQTT");

        // Creation of client object with the username and password supplied by mqtt.dioty.co
        client = mqtt.connect("mqtt://mqtt.dioty.co:8080",{
            username:this.state.username,
            password:this.state.password
        })
        var that = this;
        // On connect handler for mqtt, sets state and gives some logs
        client.on('connect', function () {
            client.subscribe(["/"+that.state.username+"/time","/"+that.state.username+"/temperature","/"+that.state.username+"/pm10","/"+that.state.username+"/humi"], function (err,granted) {
             if (!err) {
                console.log("Client Subscribe:","Succesfully connected to the given topics!")
                that.setState({connected:true})
                console.log("Done!Showing values(if there are any)now!")
            }
            else{
                console.log("Error found when subscribing:",err.message)
            }
            })
        })
        
        // if a message of the subscribed topics come in do the following
        client.on('message',function(topic,message){
            console.log(message);
            let value = message.toString();
            console.log(topic);
            if(topic==='/erictg96@googlemail.com/temperature')that.setState({lastMessageTemp:value})
            if(topic==='/erictg96@googlemail.com/pm10')that.setState({lastMessagePm10:value})
            if(topic==='/erictg96@googlemail.com/humi')that.setState({lastMessageHumi:value})
            if(topic==='/erictg96@googlemail.com/time')that.setState({lastMessageTime:value})

            console.log(value);
        })
    }

    handleSelected= (selectedTemp, selectedHumi, selectedPm10, selectedTime) =>{
        this.setState({
            selectedTemp,
            selectedHumi,
            selectedPm10,
            selectedTime,
        })
    }


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
        return (
            <Container fluid>
                <div>
                    <OwnMap route={exampleData} handleSelected={this.handleSelected}/>
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
                            <td>{this.state.selectedTemp ? this.state.selectedTemp + " °C" : this.state.lastMessageTemp +" °C"}</td>
                            <td>{this.state.selectedTime ? this.state.selectedTime + "": this.state.lastMessageTime +""}</td>
                            </tr>
                            <tr>
                            <td>2</td>
                            <td>PM10</td>
                            <td>{this.state.selectedPm10 ? this.state.selectedPm10 + " µg/m³": this.state.lastMessagePm10 +" µg/m³"}</td>
                            <td>{this.state.selectedTime ? this.state.selectedTime + "": this.state.lastMessageTime +""}</td>
                            </tr>
                            <tr>
                            <td>3</td>
                            <td>rel. Luftfeuchtigkeit</td>
                            <td>{this.state.selectedHumi ? this.state.selectedHumi +" %" : this.state.lastMessageHumi +" %"}</td>
                            <td>{this.state.selectedTime ? this.state.selectedTime + "": this.state.lastMessageTime +""}</td>
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