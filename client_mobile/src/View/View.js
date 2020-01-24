import React, { Component } from 'react';
import { Tabs, Tab, ButtonGroup, Button } from '@material-ui/core';
import MapView from "../MapView/MapView";
import TableView from "../TableView/TableView";
import StatusView from "../StatusView/StatusView";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import Footer from "./Footer"
import ReactLoading from 'react-loading'
import { IoMdDownload, IoIosCloudUpload, IoIosTrash, IoIosPlay, IoIosPause } from 'react-icons/io'

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
            value: 1,
            startpoint: null,
            endpoint: null,
            loading: true,
            recordingRoute: false,
            startStopVal: <IoIosPlay className="svg_icons" />,
            connected: false,
            sensors: [
                // These are sensors that get queried every 5 seconds
                "Public.rmcspeed",
                "Public.rmclatitude",
                "Public.rmclongitude",
                "fasttable.AirTC_Avg",
                "fasttable.RH_Avg",
                "Public.LiveBin_1dM",
                "fasttable.u",
                "fasttable.v",
                "fasttable.w",
                "fasttabe.Ts",
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
                    "features": [],
                }
            },
            route_coordinates: [],
            counter:0
        }
        this._addCommentToGeoJson = this._addCommentToGeoJson.bind(this);
        this.download = this.download.bind(this)
    }

    componentDidMount = () => {
        this.connectMQTT();
        this._getSensors();
        this.timer = setInterval(() => {
            this._getSensors()
        }, 10000,
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleChange = (e, newValue) => {
        this.setState({ value: newValue })
    };

    _addMarker() {
        let properties = { time: this.state.time };
        let coordinates = { latitude: '0', longitude: '0' }
        this.state.sensor_data.map((sensor, i) => {
            let value = sensor.data[0].vals[0]
            let obj_name = sensor.head.fields[0].name
            properties.time = this.state.time
            if (obj_name === "rmclatitude") coordinates.latitude = value // exchange with value
            if (obj_name === "rmclongitude") coordinates.longitude = value // exchange with value 
            else properties[obj_name] = value;
        })

        this._convertGPSData(coordinates.latitude, coordinates.longitude)
        let marker = {
            "type": "Feature",
            properties,
            "geometry": {
                "type": "Point",
                "coordinates": [this.state.route_coordinates[this.state.route_coordinates.length - 1][0], this.state.route_coordinates[this.state.route_coordinates.length - 1][1]]
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
            let url = "http://128.176.146.233:3134/logger/command=dataquery&uri=dl:" + sensor + "&mode=most-recent&format=json";
            fetch(url)
                .then((response) => response.json())
                .then((json) => this.setState((prevState) => {
                    sensor_data: prevState.sensor_data.push(json)
                }
                ))
                .then(() => {
                    if (this.state.sensor_data.length === this.state.sensors.length) {
                        let date = new Date(this.state.sensor_data[this.state.sensor_data.length - 3].data[0].time)
                        this.setState({ time: date.toLocaleTimeString() })
                        this._addMarker()
                        this.setState({ loading: false,sensor_data:[] })
                    }
                })
        })
    }
    _addOne(number){
        let newNumber = number+1;
        return newNumber;
    }
    _convertGPSData(lat1, lon) {
        // Leading zeros not allowed --> string
        let lat_temp_1 = parseFloat(lat1.split('.')[0].substring(0, 2));
        let lat_temp_2 = parseFloat(lat1.split(lat_temp_1)[1]) / 60;
        let lat = lat_temp_1 + lat_temp_2;

        let long_temp_1 = parseFloat(lon.split('.')[0].substring(0, 3));
        let long_temp_2 = parseFloat(lon.split(long_temp_1)[1]) / 60;
        let long = long_temp_1 + long_temp_2;

        const coordinates = [lat, long];
        // Temporary variable for the bugfix below
        let position = [] //;
        // Bugfix for when no coordinates were sent(not ready)
        // Pushes last known coordinates 
        if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
            if (this.state.route_coordinates.length < 1) position = [51.9688129, 7.5922197];
            else position = this.state.route_coordinates[this.state.route_coordinates.length - 1];
            this.setState((prevState) => {
                route_coordinates: prevState.route_coordinates.push(position);
            })
        }
        else {
            this.setState((prevState) => {
                route_coordinates: prevState.route_coordinates.push(coordinates);
            })
        }
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

    // Send Route to Broker
    sendtoBroker = () => {
        let featureGroup = this.getFeatureGroup();
        this.publishMQTT(JSON.stringify(featureGroup))
    }

    _addCommentToGeoJson(e, comment) {
        let newFeatureGroup = this.state.featureGroup;

        newFeatureGroup.geoJson.features.forEach(function (feature) {
            let timeString = e;
            if (feature.properties.time === timeString) {
                feature.properties.comment = comment
            }
        })
        this.setState({ featureGroup: newFeatureGroup })
    }

    handleStartStop = () => {
        if (this.state.recordingRoute) {
            // If Route is already being recorded
            this.setState({
                recordingRoute: false,
                recordedRoute: true,
                endpoint: this.state.lastMeasurement,
                startStopVal: <IoIosPlay className="svg_icons" />
            })
        } else {
            // If Route is NOT being recorded 
            this.setState({
                recordingRoute: true,
                startpoint: this.state.lastMeasurement,
                startStopVal: <IoIosPause className="svg_icons" />
            })
        }
    }

    confirmDelete = () => {
        confirmAlert({
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
            startStopVal: <IoIosPlay className="svg_icons" />
        })
    }

    // Get Features between Start and End-Feature
    getFeatureGroup = () => {
        let featureGroup = {
            geoJson: {
                "type": "FeatureCollection",
                "features": []
            }
        }

        var startTime = this.state.startpoint.properties.time;
        var endTime = this.state.endpoint.properties.time;

        this.state.featureGroup.geoJson.features.forEach(function (feature) {
            let currFeatureTime = feature.properties.time;

            // Looks stupid but works as long as time is in 24h format...
            if (startTime < currFeatureTime && endTime > currFeatureTime) {
                featureGroup.geoJson.features.push(feature)
            }
        })
        return featureGroup;
    }

    // Save current route to device
    download() {
        let featureGroup = this.getFeatureGroup();

        const element = document.createElement("a");
        let recordingRoute = JSON.stringify(featureGroup)
        const file = new Blob([recordingRoute], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "measurements.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
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
                                _addCommentToGeoJson={this._addCommentToGeoJson}
                            />
                        }
                        {this.state.value === 2 &&
                            <StatusView />}
                        <Footer>
                            <ButtonGroup fullWidth color="primary" >
                                <Button onClick={this.handleStartStop}>{this.state.startStopVal}</Button>
                                <Button onClick={this.confirmDelete} disabled={!this.state.recordedRoute || this.state.recordingRoute}><IoIosTrash className="svg_icons" /></Button>
                                <Button onClick={this.sendtoBroker} disabled={!this.state.recordedRoute || this.state.recordingRoute || !this.state.connected}><IoIosCloudUpload className="svg_icons" /></Button>
                                <Button onClick={this.download} disabled={!this.state.recordedRoute || this.state.recordingRoute}><IoMdDownload className="svg_icons" /></Button>
                            </ButtonGroup>
                        </Footer>
                    </div>
                }
            </ErrorBoundary>
        );
    }
}

export default View;