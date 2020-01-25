import React, { Component } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import Live from "../Live/Live";
import Explore from "../Explore/Explore";
import Chat from "../Chat/Chat";
var Paho = require('paho-mqtt');

var client;


class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 2,
            server_ip: '10.6.4.7',
            server_port: 9001,
            messages:[],
            unread:false
        }

        this._publishMQTT = this._publishMQTT.bind(this);
        this._subscribeToTopic = this._subscribeToTopic.bind(this);
        this._readMessages = this._readMessages.bind(this);
        this.connectMQTT = this.connectMQTT.bind(this);
        this.disconnectMQTT = this.disconnectMQTT.bind(this);
    }
    componentDidMount() {
        this.connectMQTT();
    }
    handleChange = (e, newValue) => {
        this.setState({ value: newValue })
    };
    _readMessages() {
        this.setState({ unread: false })
    }
    _subscribeToTopic(topic) {
        console.log("Subscribing to topic", topic);
        client.subscribe(topic);
    }
    _publishMQTT(_message, topic) {
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
        this._subscribeToTopic("chat_mobile");
        this._subscribeToTopic("chat_stationary");
        this._subscribeToTopic("messwerte");
        this.setState({
            connected: true,
        })
    };
    onMessageArrived(message) {
        if (message.destinationName == "chat_mobile" || message.destinationName == "chat_stationary") {
            console.log(message.payloadString)
            this.setState({
                messages: [...this.state.messages, { destinationName: message.destinationName, payloadString: message.payloadString, time: new Date() }]
            })
            if (this.state.value != 2) {
                this.setState({ unread: true })
            }
        }
        if(message.destinationName==="messwerte"){
            console.log(JSON.parse(message.payloadString));
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
        this._publishMQTT(JSON.stringify(featureGroup), "messungen")
    }
    connectMQTT() {
        const self = this;
        // generating random clientID
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        client = new Paho.Client(this.state.server_ip, this.state.server_port, uniqid);
        client.onConnectionLost = this.onConnectionLost;
        client.onMessageArrived = this.onMessageArrived.bind(this);

        // connect the client
        client.connect({ onSuccess: this.onConnect.bind(this) });
    };
    // simple disconnect handler, stes state of connected variable
    disconnectMQTT() {
        console.log("Disconnecting from MQTT now")
        this.setState({ connected: false })
        client.end()
    }

    render() {
        return (
            <div>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Live View" />
                    <Tab label="Explore View" />
                    <Tab label="Chat View" style={this.state.unread?{"color":"orange"}:null} />
                </Tabs>
                {this.state.value === 0 &&
                    <Live />
                }
                {this.state.value === 1 &&
                    <Explore />
                }
                {this.state.value === 2 &&
                    <Chat _readMessages={this._readMessages} messages={this.state.messages} _publishMQTT={this._publishMQTT} _subscribeToTopic={this._subscribeToTopic} />}
            </div>

        );
    }


}

export default View;