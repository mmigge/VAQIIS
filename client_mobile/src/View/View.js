import React, { Component } from 'react';
import { Tabs, Tab, ButtonGroup, Button } from '@material-ui/core';
import MapView from "../MapView/MapView";
import TableView from "../TableView/TableView";
import ChatView from "../ChatView/ChatView";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import Footer from "./Footer"
import ReactLoading from 'react-loading'
import { IoMdDownload, IoIosCloudUpload, IoIosTrash, IoIosPlay, IoIosPause } from 'react-icons/io'
import axios from 'axios'

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
            value: 2,
            startpoint: null,
            endpoint: null,
            loading: true,
            recordingRoute: false,
            startStopVal: <IoIosPlay className="svg_icons" />,
            connected: false,
            sensors: [
                // These are sensors that get queried every 5 seconds
                "rmcspeed",
                "rmclatitude",
                "rmclongitude",
                "AirTC_Avg",
                "RH_Avg",
                "LiveBin_1dM",
                "u",
                "v",
                "w",
                "Ts",
                "CPC_aux",
                "CO2",
                "H2O",        //this._addMarker();

                "diag_LI75"
            ],
            server_ip: '10.6.4.7',
            server_port: 9001,
            featureGroup: {
                geoJson: {
                    "type": "FeatureCollection",
                    "features": [],
                }
            },
            route_coordinates: [],
            counter: 0,
            messages:[],
            unread:false
        }
        this._addCommentToGeoJson = this._addCommentToGeoJson.bind(this);
        this.download = this.download.bind(this);
        this._publishMQTT = this._publishMQTT.bind(this);
        this._subscribeToTopic = this._subscribeToTopic.bind(this);
        this._readMessages = this._readMessages.bind(this);
    }

    componentDidMount = () => {
        this.connectMQTT();
        this._getSensors()
            .then(() => {
                const sensor_data = { ...this.state.sensor_data_public, ...this.state.sensor_data_fasttable }
                this.setState({ sensor_data })
            })
            .then(() => this._addMarker())
            .then(() => this.setState({ loading: false }));
        this.timer = setInterval(() => {
            this._getSensors().then(() => {
                const sensor_data = { ...this.state.sensor_data_public, ...this.state.sensor_data_fasttable }
                this.setState({ sensor_data })
            }).then(() => this._addMarker());
        }, 2000,
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }
    _readMessages(){
        this.setState({unread:false})
    }
    handleChange = (e, newValue) => {
        this.setState({ value: newValue })
    };

    _addMarker() {
        let marker = {
            "type": "Feature",
            "properties": this.state.sensor_data,
            "geometry": {
                "type": "Point",
                "coordinates": [this.state.sensor_data.rmclatitude, this.state.sensor_data.rmclongitude]
            }
        }
        let newFeatureGroup = this.state.featureGroup;
        newFeatureGroup.geoJson.features.unshift(marker);
        this.setState({
            featureGroup: newFeatureGroup,
            lastMeasurement: marker
        })
    }

    _getFasttable() {
        let url_fasttable = "http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable&mode=most-recent&format=json";
        return fetch(url_fasttable)
            .then(response => response.json())
            .then((json) => {
                let sensor_data_fasttable = {}
                json.head.fields.map((field, index) => {
                    if (this.state.sensors.includes(field.name)) {
                        if (field.name == "rmclatitude") sensor_data_fasttable.rmclatitude = this._convertLat(json.data[0].vals[index]);
                        else if (field.name == "rmclongitude") sensor_data_fasttable.rmclongitude = this._convertLon(json.data[0].vals[index]);
                        else sensor_data_fasttable[field.name] = json.data[0].vals[index]
                    }
                })
                this.setState({ sensor_data_fasttable })
            })
    }
    _getPublicTable() {
        let url_public = "http://128.176.146.233:3134/logger/command=dataquery&uri=dl:Public&mode=most-recent&format=json";
        return fetch(url_public)
            .then(response => response.json())
            .then((json) => {
                let sensor_data_public = {}
                let date = new Date(json.data[0].time);
                sensor_data_public.timeStamp= date;
                sensor_data_public.time = date.toLocaleTimeString();
                json.head.fields.map((field, index) => {
                    if (this.state.sensors.includes(field.name)) {
                        if (field.name == "rmclatitude") return;
                        else if (field.name == "rmclongitude") return;
                        else sensor_data_public[field.name] = json.data[0].vals[index]
                    }
                })
                this.setState({ sensor_data_public })

            })
    }
    _getSensors() {
        return Promise.all([this._getFasttable(), this._getPublicTable()])
    }
    _convertLat(lat) {
        if (!lat || lat == "") {
            return 51.9688129// dummy coordinates or last known coordinates
        }
        else {
            let lat_temp_1 = parseFloat(lat.split('.')[0].substring(0, 2));
            let lat_temp_2 = parseFloat(lat.split(lat_temp_1)[1]) / 60;
            let lat = lat_temp_1 + lat_temp_2;
            return lat
        }
    }
    _convertLon(lon) {
        if (!lon || lon == "") {
            return 7.5922197// dummy coordinates or last known coordinates
        }
        else {
            let long_temp_1 = parseFloat(lon.split('.')[0].substring(0, 3));
            let long_temp_2 = parseFloat(lon.split(long_temp_1)[1]) / 60;
            let long = long_temp_1 + long_temp_2;
            return long;
        }

    }
    connectMQTT() {
        // generating random clientID
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        client = new Paho.Client(this.state.server_ip, this.state.server_port, uniqid);
        client.onConnectionLost = this.onConnectionLost;
        client.onMessageArrived = this.onMessageArrived.bind(this);

        //client.onMessageArrived = this.onMessageArrived;

        // connect the client
        client.connect({
            onSuccess: this.onConnect.bind(this)
        });
        
    };
    _subscribeToTopic(topic){
        console.log("Subscribing to topic",topic);
        client.subscribe(topic);
    }
    _publishMQTT(_message,topic) {
        if (this.state.connected) {
            const message = new Paho.Message(_message);
            message.destinationName = topic;
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
        this._subscribeToTopic("chat_mobile");
        this._subscribeToTopic("chat_stationary");
        this.setState({
            connected: true,
        })
    };
    onMessageArrived(message){
        if(message.destinationName=="chat_mobile" || message.destinationName=="chat_stationary"){
            this.setState({
                messages: [...this.state.messages,{destinationName:message.destinationName,payloadString:message.payloadString,time:new Date()}]
            })
            if(this.state.value!=2){
                this.setState({unread:true})
            }
        }
    }
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
        const self=this;
        const object= {geoJson: featureGroup.geoJson, date: featureGroup.geoJson.features[0].properties.timeStamp}
        axios.post('http://giv-project2:9000/api/course', {route: object})
            .then(res => {
            })
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
                            <Tab label="Table View"/>
                            <Tab label="Map View" />
                            <Tab className="chatTab" style={this.state.unread?{"color":"orange"}:null} label="Chat View" />
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
                            <ChatView _readMessages={this._readMessages} messages={this.state.messages}_publishMQTT={this._publishMQTT} _subscribeToTopic={this._subscribeToTopic} />}
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