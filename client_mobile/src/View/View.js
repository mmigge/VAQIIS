import React, { Component } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import MapView from "../MapView/MapView";
import TableView from "../TableView/TableView";
import StatusView from "../StatusView/StatusView";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary"


var Paho = require('paho-mqtt');

const server_ip = '10.6.4.7';
const server_port = 9001;

var client = null;
var topic = '#';
var topic = 'TestNick';

const featureGroup = {geojson: {
    "type": "FeatureCollection",
    "features": [
    ]
}
}

const example=       {
    "type": "Feature",
    "properties": {temp : 2, humi: 10, pm10: 2, time: new Date("2020-01-01")},
    "geometry": {
      "type": "Point",
      "coordinates": [
        7.6100921630859375,
        51.967115491837404
      ]
    }
  }

  const example2 =       {
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


class View extends Component {
    constructor(props) {
        super(props);
        this.state = { value: 0, liveRoute: featureGroup }

    }

    componentDidMount = () => {
        this.startPullLoop();
        this.connectMQTT();
        const timer = setTimeout(
            () => this.publishMQTT(JSON.stringify(example)),
            5000,
        );
        const timer2 = setTimeout(
            () => this.publishMQTT(JSON.stringify(example2)),
            10000,
        );
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    handleChange = (e, newValue) => {
        this.setState({ value: newValue })
    };

    startPullLoop = () => {
        this.getDataFromPie();
        this.timer = setInterval(
            () =>this.getDataFromPie(),
            5000,
        );
    }

    getDataFromPie = () => {
        const self = this;
        Promise.all([self._getLat(), self._getLng(), self._getTmp(), self._getHumi(), self._getPM10(), self._getTime()]).then(values => { self.addMarker(values) })
    }

    addMarker = (values) => {
        console.log(values)
        const geoJSON = JSON.parse(JSON.stringify(this.state.liveRoute));

        const coordinates = this._convertGPSData(values[0], values[1])
        const marker = {
            "type": "Feature",
            "properties": { temp: values[2], humi: values[3], pm10: values[4], time: values[5] },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    coordinates.latitude,
                    coordinates.longtitude
                ]
            }
        }

        geoJSON.features.push(marker);
        this.publishMQTT(JSON.stringify(marker));
        this.setState({ liveRoute: geoJSON, lastMeasurement: marker })
    }

    _getLat = () => {
        const self = this;
        return new Promise(async function (res, rej) {
            console.log("getLocation()");
            let url_latitude = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable.rmclatitude&mode=most-recent&format=json';
            const result = await self._request(url_latitude);
            res(result)
        })
    }

    _getLng = () => {
        const self = this;
        return new Promise(async function (res, rej) {
            let url_longitude = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable.rmclongitude&mode=most-recent&format=json';
            const result = await self._request(url_longitude);
            res(result)
        })
    }

    _getTmp = () => {
        const self = this;
        return new Promise(async function (res, rej) {
            let url_temp = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable.AirTC_Avg&mode=most-recent&format=json';
            const result = await self._request(url_temp);
            res(result)
        })
    }

    _getHumi = () => {
        const self = this;
        return new Promise(async function (res, rej) {
            let url_humi = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable.RH_Avg&mode=most-recent&format=json';
            const result = await self._request(url_humi);
            res(result)
        })
    }

    _getPM10 = () => {
        const self = this;
        return new Promise(async function (res, rej) {
            let url_pm10 = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable.LiveBin_10dM&mode=most-recent&format=json';
            const result = await self._request(url_pm10);
            res(result)
        })
    }

    _getTime = () => {
        const self = this;
        return new Promise(async function (res, rej) {
            let url_time = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:fasttable.TIMESTAMP&mode=most-recent&format=json';
            const result = await self._request(url_time);
            res(result)
        })
    }

    _request = (url) => {
        return new Promise(async function (res, rej) {
            fetch(url)
                .then((response) => response.json())
                .then(json => {
                    res(json.data[0].vals)
                })
        })
    }

    _convertGPSData(lat1, lon) {
        // Leading zeros not allowed --> string
        const position = ['5157.88870', '00736.34599'];

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
        return coordinates;
    }

    connectMQTT() {
        // generating random clientID
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        client = new Paho.Client(server_ip, server_port, uniqid);
        client.onConnectionLost = this.onConnectionLost;
        //client.onMessageArrived = this.onMessageArrived;

        // connect the client
        client.connect({ onSuccess: this.onConnect.bind(this) });
    };

    publishMQTT(_message) {
        if(this.state.connected){
        const message = new Paho.Message(_message);
        message.destinationName = topic;
        client.send(message);}
        else{
            console.log(_message)
        }
    }

    /** Stationary  // called when a message arrives
       onMessageArrived(message) {
           console.log("onMessageArrived: " + message.payloadString);
       }; */

    // called when the client loses its connection
    onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost: " + responseObject.errorMessage);
            this.setState({connected: false})
            //TODO connectMQTT + delay
        }
    };

    // called when the client connects
    onConnect() {
        console.log("MQTT Broker Connect: Success");
        client.subscribe(topic);
        this.setState({connected: true})
    };


    render() {
        return (
            <ErrorBoundary>
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
                        <TableView />
                    }
                    {this.state.value === 1 &&
                        <MapView liveRoute={this.state.liveRoute} lastMeasurement={this.state.lastMeasurement} />
                    }
                    {this.state.value === 2 &&
                        <StatusView />}
                </div>
            </ErrorBoundary>
        );
    }


}

export default View;