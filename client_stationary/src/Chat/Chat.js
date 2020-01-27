import React, { Component } from 'react';
import { Container } from 'react-bootstrap'
import './Chat.css'
class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatBox: ''

        }
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    _onChange(e) {
        this.setState({
            chatBox: e.target.value
        })
    }
    _onKeyDown(e) {

        if (e.key === 'Enter') {
            this.props._publishMQTT(this.state.chatBox, "chat_stationary");
            this.setState({ chatBox: "" })
        }
    }

    componentDidMount() {
        console.log("Mounted status view");
        this.props._readMessages();
    }
   
    componentDidUpdate() {
        this.scrollToBottom();
      }

      scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }


    render(){
        return(
            <Container fluid>
                <div className="chatBox">
                    <span className="mb-2 text-muted">Letzte Nachricht um {this.props.messages[0] ? this.props.messages
                    [this.props.messages.length - 1].time.toLocaleTimeString() : null} erhalten</span>
                    <div className="messagesWindow" style={{maxHeight:"60vh", overflow: "auto"}} ref="window">
                        {this.props.messages.map((message, i) => {
                            return (
                                <div className={message.destinationName === "chat_stationary" ? "rightSide" : "leftSide"} key={"idChat" + i}>
                                    <p>Nachricht von <span className={message.destinationName === "chat_mobile" ? "authorStationary" : "authorMobile"}>{message.destinationName === "chat_mobile" ? "Sensor Bike" : "Command Center"}</span>  um {message.time.toLocaleTimeString()}<br></br> {message.payloadString}</p>
                                </div>
                            )
                        })}
                                            <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                    </div>

                </div>
                <input placeholder="Schreibe eine Nachricht..." className="input_chatbox" type="text" onChange={this._onChange} value={this.state.chatBox} onKeyDown={this._onKeyDown} />
            </Container>
        )
    }

}
export default Chat