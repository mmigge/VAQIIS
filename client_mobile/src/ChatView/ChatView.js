import React, { Component } from 'react';
import { Container } from 'react-bootstrap'
import './ChatView.css'
/**
 * Chat class 
 * provides the chat view and functionality
 * The chat works via MQTT. The chat component listens to one MQTT topic
 * while it also pushes new messages to one MQTT topic
 */
class ChatView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatBox: ''
        }
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    componentDidMount() {
        this.props._readMessages();
    }
    _onChange(e) {
        this.setState({
            chatBox: e.target.value
        })
    }
    _onKeyDown(e) {

        if (e.key === 'Enter') {
            this.props._publishMQTT(this.state.chatBox, "chat_mobile");
            this.setState({ chatBox: "" })
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    render() {
        return (
            <Container fluid>
                <div className="chatBox">
                    <span className="mb-2 text-muted">Letzte Nachricht um {this.props.messages[0] ? this.props.messages
                    [this.props.messages.length - 1].time.toLocaleTimeString() : null} erhalten</span>
                    <div className="messagesWindow" style={{maxHeight:"60vh", overflow: "auto"}}>
                        {this.props.messages.map((message, i) => {
                            return (
                                <div className={message.destinationName === "chat_mobile" ? "rightSide" : "leftSide"} key={"idChat" + i}>
                                    <p>Nachricht von <span className={message.destinationName === "chat_mobile" ? "authorStationary" : "authorMobile"}>{message.destinationName === "chat_mobile" ? "Sensor Bike" : "Command Center"}</span>  um {message.time.toLocaleTimeString()}<br></br> {message.payloadString}</p>
                                </div>
                            )
                        })}
                     <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                    </div>

                </div>
                <input placeholder="Schreibe eine Nachricht..."className="input_chatbox" type="text" onChange={this._onChange} value={this.state.chatBox} onKeyDown={this._onKeyDown} />
            </Container>
        )
    }

}
export default ChatView