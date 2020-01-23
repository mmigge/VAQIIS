import React, { Component } from 'react';
import { Tabs, Tab, ButtonGroup, Button } from '@material-ui/core';
import MapView from "../MapView/MapView";
import TableView from "../TableView/TableView";
import StatusView from "../StatusView/StatusView";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import Footer from "./Footer"
import ReactLoading from 'react-loading'
import axios from 'axios';

import './../index.css'


var Paho = require('paho-mqtt');

var client;

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            startpoint: null,
            endpoint: null,
            loading: true,
            sensors: [  
                        "Public.rmcspeed",
                        "Public.rmclatitude",
                        "Public.rmclongitude",
                        "fasttable.AirTC_Avg",
                        "fasttable.RH_Avg",
                        "Public.LiveBin_1dM",
                        "fasttable.Gill_Diag",
                        // "u",
                        // "v",
                        // "w",
                        // "Ts",
                        "Public.CPC_aux",
                        "Public.CO2",
                        "fasttable.H2O",
                        "Public.diag_LI75"
            ],
            sensor_data: [],
            server_ip: '10.6.4.7',
            server_port: 9001,
            featureGroup: {
                geoJson: {
                    "type": "FeatureCollection",
                    "features": [
                    ]
                }
            },
            route_coordinates:[]
        }

    }

    componentDidMount = () => {
        this._getSensors();
        this.timer = setInterval(() => {
            this._getSensors()
        }, 10000,
        );
        // this.connectMQTT();
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleChange = (e, newValue) => {
        this.setState({ value: newValue })
    };


    _addMarker() {
        let properties = { time: this.state.time };
        let coordinates={latitude:'0',longitude:'0'}
        this.state.sensor_data.map((sensor, i) => {
            let value = sensor.data[0].vals[0]
            let obj_name = sensor.head.fields[0].name
            properties.time=this.state.time
            if (obj_name == "rmclatitude") coordinates.latitude = '5157.88870' // exchange with value
            if (obj_name == "rmclongitude") coordinates.longitude = '00736.34599' // exchange with value 
            else properties[obj_name] = value;
        })

        this._convertGPSData(coordinates.latitude,coordinates.longitude)
        let marker = {
            "type": "Feature",
            properties,
            "geometry": {
                "type": "Point",
                "coordinates": [this.state.route_coordinates[this.state.route_coordinates.length-1][0],this.state.route_coordinates[this.state.route_coordinates.length-1][1]]
            }
        }
        let newFeatureGroup = this.state.featureGroup;
        newFeatureGroup.geoJson.features.push(marker)
        this.setState({ featureGroup: newFeatureGroup })
    }

    _getSensors() {
        // Perform a request for each sensor in the state
        this.state.sensors.map((sensor, index) => {
            // Build URL according to sensor name
            let url = "http://128.176.146.233:3134/logger/command=dataquery&uri=dl:" + sensor + "&mode=most-recent&format=json";
            fetch(url)
                .then((response) => response.json())
                .then((json) => this.setState((prevState) => {
                    { sensor_data: prevState.sensor_data.push(json) }
                }
                ))
                .then(() => {
                    if (index === this.state.sensors.length - 1) {
                        let date = new Date(this.state.sensor_data[this.state.sensor_data.length-3].data[0].time)
                        this.setState({ time: date.toLocaleTimeString() })
                        this._addMarker()
                        this.setState({ loading: false })
                    }
                })
        })
    }


    _convertGPSData(lat1, lon) {
        // Leading zeros not allowed --> string
        let lat_temp_1 = parseFloat(lat1.split('.')[0].substring(0, 2));
        let lat_temp_2 = parseFloat(lat1.split(lat_temp_1)[1]) / 60;
        let lat = lat_temp_1 + lat_temp_2;

        let long_temp_1 = parseFloat(lon.split('.')[0].substring(0, 3));
        let long_temp_2 = parseFloat(lon.split(long_temp_1)[1]) / 60;
        let long = long_temp_1 + long_temp_2;

        const coordinates = [lat,long];

        this.setState((prevState)=>{
            route_coordinates:prevState.route_coordinates.push(coordinates);
        })
    }

    connectMQTT() {
        // generating random clientID
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        client = new Paho.Client(this.state.server_ip, this.state.server_port, uniqid);
        client.onConnectionLost = this.onConnectionLost;
        //client.onMessageArrived = this.onMessageArrived;

        // connect the client
        client.connect({ onSuccess: this.onConnect.bind(this) });
    };

    publishMQTT(_message) {
        if (this.state.connected) {
            const message = new Paho.Message(_message);
            message.destinationName = "message";
            client.send(message);
        }
        else {
            console.log(_message)
        }
    }

    // called when the client loses its connection
    onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost: " + responseObject.errorMessage);
            this.setState({ connected: false })
            //TODO connectMQTT + delay
        }
    };

    // called when the client connects
    onConnect() {
        console.log("MQTT Broker Connect: Success");
        client.subscribe("message");
        this.setState({ connected: true })
    };

    handleStart = () => {
        console.log("hello from button");
        // 
        const startpoint = this.state.lastMeasurement;
        this.state.featureGroup.geoJson.features.push(this.state.lastMeasurement);
        this.setState({ riding: true, startpoint })
    }

    handleStop = () => {
        const endpoint = this.state.lastMeasurement;
        this.setState({ riding: false, endpoint, route: true })
    }

    handleClear = () => {
        this.state.featureGroup.geoJson.features = [];
        this.setState({ featureGroup: this.state.featureGroup, startpoint: null, endpoint: null, route: false })
    }

    handleSave = () => {
        const self = this;
        const object = { geoJson: this.state.featureGroup.geoJson, date: this.state.featureGroup.geoJson.features[0].properties.time }
        console.log(object)
        this.setState({ saving: true })
        axios.post('http://giv-project2:9000/api/course', { route: object })
            .then(res => {
                console.log(res);
                this.setState({ saving: false })
            })

    }


    render() {
        return (
            <ErrorBoundary>
                {this.state.loading ? <div className="ReactLoading">
                    <ReactLoading className="Spinner" type="spin" color="blue" />
                </div> :
                    <div>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange.bind(this)}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Table View" />
                            <Tab label="Map View" />
                            <Tab label="Status View" />
                        </Tabs>
                        {this.state.value === 0 &&
                            <TableView liveRoute={this.state.featureGroup} />
                        }
                        {this.state.value === 1 &&
                            <MapView liveRoute={this.state.featureGroup} route_coordinates={this.state.route_coordinates}lastMeasurement={this.state.lastMeasurement} startpoint={this.state.startpoint} endpoint={this.state.endpoint} />
                        }
                        {this.state.value === 2 &&
                            <StatusView />}
                        <Footer>
                            {this.state.saving ?
                                <ReactLoading type={"bubbles"} color="blue" style={{ position: "absolute", left: "40%", width: "50px", height: "40px", color: "blue" }} /> :
                                <ButtonGroup fullWidth color="primary" >
                                    <Button onClick={this.handleStart} disabled={this.state.riding || this.state.route}>Start</Button>
                                    <Button onClick={this.handleStop} disabled={!this.state.riding || this.state.route}>Stop</Button>
                                    <Button onClick={this.handleClear} disabled={this.state.riding}>Clear</Button>
                                    <Button onClick={this.handleSave} disabled={this.state.riding || !this.state.route || this.state.loading}>Send</Button>
                                </ButtonGroup>
                            }
                        </Footer>
                    </div>
                }

            </ErrorBoundary>
        );
    }


}

export default View;