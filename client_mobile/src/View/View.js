import React, { Component } from 'react';
import { Tabs, Tab, ButtonGroup, Button } from '@material-ui/core';
import MapView from "../MapView/MapView";
import TableView from "../TableView/TableView";
import StatusView from "../StatusView/StatusView";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import Footer from "./Footer"
import ReactLoading from 'react-loading'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import './../index.css'
import './View.css'

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
            recordingRoute: false,
            startStopVal: 'Route starten',
            connected: false,
            sensors: [
                "rmcspeed",
                "rmclatitude",
                "rmclongitude",
                "AirTC_Avg",
                "RH_Avg",
                "LiveBin_1dM"
                // "Gill_Diag",
                // "u",
                // "v",
                // "w",
                // "Ts",
                // "CPC_aux",
                // "CO2",
                // "H20",
                // "diag_LI75"
            ],
            sensor_data: [],
            server_ip: '10.6.4.7',
            server_port: 9001,
            featureGroup: {
                geoJson: {
                    "type": "FeatureCollection",
                    "features": []
                }
            },
            route_coordinates: [[51.9688129, 7.5922197], [51.9988129, 7.5222197]]
        }

    }

    componentDidMount = () => {
        this.connectMQTT();
        this._getSensors();
        this.timer = setInterval(() => {
            this._getSensors()
        }, 2000,
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleChange = (e, newValue) => {
        this.setState({ value: newValue })
    };

    /*
    getDataFromPi = () => {
        const self = this;
        Promise.all([self._getLat(), self._getLng(), self._getTmp(), self._getHumi(), self._getPM10()]).then(() => this.setState({ loading: false })).then(values => { self.addMarker(values) })
    }
    */

    _addMarker() {
        let date = new Date(this.state.sensor_data[0].data[0].time)
        let properties = { time: date.toLocaleTimeString() };
        let coordinates = {};
        this.state.sensor_data.map((sensor, i) => {
            let value = sensor.data[0].vals[0]
            let obj_name = sensor.head.fields[0].name
            if (obj_name === "rmclatitude") coordinates["latitude"] = value;
            if (obj_name === "rmclongitude") coordinates["longitude"] = value;
            else properties[obj_name] = value;
        })
        let marker = {
            "type": "Feature",
            properties,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    51.9688129, 7.5922197
                ]
            }
        }
        let newFeatureGroup = this.state.featureGroup;
        newFeatureGroup.geoJson.features.push(marker);
        this.setState({
            featureGroup: newFeatureGroup,
            lastMeasurement: marker
        })
    }

    _getSensors() {
        // Perform a request for each sensor in the state
        this.state.sensors.map((sensor, index) => {
            // Build URL according to sensor name
            let url = "http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable." + sensor + "&mode=most-recent&format=json";
            fetch(url)
                .then((response) => response.json())
                .then((json) => this.setState((prevState) => {
                    sensor_data: prevState.sensor_data.push(json)
                }
                ))
                .then(() => {
                    if (index === this.state.sensors.length - 1) {
                        this._addMarker()
                        this.setState({ loading: false })
                    }
                })
        })
    }

    _convertGPSData(lat1, lon) {
        // Leading zeros not allowed --> string
        const position = ['5157.88870', '00736.34599']; //demo; in Live [lat1, lon]

        let lat_temp_1 = parseFloat(position[0].split('.')[0].substring(0, 2));
        let lat_temp_2 = parseFloat(position[0].split(lat_temp_1)[1]) / 60;
        let lat = lat_temp_1 + lat_temp_2;

        let long_temp_1 = parseFloat(position[1].split('.')[0].substring(0, 3));
        let long_temp_2 = parseFloat(position[1].split(long_temp_1)[1]) / 60;
        let long = long_temp_1 + long_temp_2;

        const coordinates = {
            latitude: lat,
            longtitude: long
        }
        this.setState({ coordinates })
        return coordinates;
    }

    connectMQTT() {
        // generating random clientID
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        client = new Paho.Client(this.state.server_ip, this.state.server_port, uniqid);
        client.onConnectionLost = this.onConnectionLost;
        //client.onMessageArrived = this.onMessageArrived;

        // connect the client
        client.connect({ 
            onSuccess: this.onConnect.bind(this)
        });
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

    // Connected: Set Subscription
    onConnect() {
        console.log("MQTT Broker Connect: Success");
        client.subscribe("message");
        this.setState({
            connected: true,
        })
    };

    // Connection-Lost: Set 
    onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost: " + responseObject.errorMessage);
            this.setState({ 
                connected: false 
            });
            this.connectMQTT();
        }
    };

    handleSave = () => {

        this.setState.saving =({
            saving: true
        })
        
        let featureGroup= {
            geoJson: {
                "type": "FeatureCollection",
                "features": []
            }
        }

        var startTime = this.state.startpoint.properties.time.split(':');
        var endTime = this.state.endpoint.properties.time.split(':');

        this.state.featureGroup.geoJson.features.forEach(function(feature){
            let currFeatureTime = feature.properties.time.split(':');

            if (startTime[0] <= currFeatureTime[0]){
                if (startTime[1] <= currFeatureTime[1]){
                    if (startTime[2] <= currFeatureTime[2]){
                        if (endTime[0] >= currFeatureTime[0]){
                            if (endTime[1] >= currFeatureTime[1]){
                                if (endTime[2] >= currFeatureTime[2]){
                                    featureGroup.geoJson.features.push(feature)
                                }
                            }
                        }
                    }
                }
            }
        })
        this.publishMQTT(JSON.stringify(featureGroup)).then((res) =>{
            this.setState.saving =({
                saving: false
            })
        })
    }

    handleStartStop = () => {
        if (this.state.recordingRoute) {
            // If Route is already being recorded
            this.setState({
                recordingRoute: false,
                recordedRoute: true,
                endpoint: this.state.lastMeasurement,
                startStopVal: 'Route fortsetzen'
            })
        } else {
            // If Route is NOT being recorded 
            this.setState({
                recordingRoute: true,
                startpoint: this.state.lastMeasurement,
                startStopVal: 'Route stoppen'
            })
        }
    }

    confirmDelete = () => {
        confirmAlert({
            title: 'Achtung',
            message: 'Soll die aktuelle Route wirklich gelöscht werden?',
            buttons: [
                {
                    label: 'Ja',
                    onClick: () => this.handleClear()
                },
                {
                    label: 'Abbrechen',
                    onClick: () => null
                }
            ]
        })
    };

    handleClear = () => {
        this.setState({
            startpoint: null,
            endpoint: null,
            recordingRoute: false,
            recordedRoute: false,
            startStopVal: 'Route aufzeichnen'
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
                            <MapView
                                liveRoute={this.state.featureGroup}
                                route_coordinates={this.state.route_coordinates}
                                lastMeasurement={this.state.lastMeasurement}
                                startpoint={this.state.startpoint}
                                endpoint={this.state.endpoint}
                            />
                        }
                        {this.state.value === 2 &&
                            <StatusView />}
                        <Footer>
                            {this.state.saving ?

                                <ReactLoading type={"bubbles"} color="blue" style={{ position: "absolute", left: "40%", width: "50px", height: "40px", color: "blue" }} /> :
                                <ButtonGroup fullWidth color="primary" >
                                    <Button onClick={this.handleStartStop}>{this.state.startStopVal}</Button>
                                    <Button onClick={this.confirmDelete} disabled={!this.state.recordedRoute || this.state.recordingRoute}>Route löschen </Button>
                                    <Button onClick={this.handleSave} disabled={!this.state.recordedRoute || this.state.recordingRoute || !this.state.connected}>Route-an-Server-senden</Button>
                                    <Button onClick={this.download} disabled={!this.state.recordedRoute || this.state.recordingRoute}>Download</Button>
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