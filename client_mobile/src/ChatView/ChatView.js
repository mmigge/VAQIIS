import React, {Component} from 'react';
import {Container,Row,Col} from 'react-bootstrap'
import './ChatView.css'
class ChatView extends Component{
    constructor(props){
        super(props)
        this.state = {
            chatBox:''
        }
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    componentDidMount(){
        console.log("Mounted chat view");
        this.props._readMessages();
    }



    _onChange(e){
        this.setState({
            chatBox:e.target.value
        })
    }
    _onKeyDown(e){

        if(e.key === 'Enter'){
            this.props._publishMQTT(this.state.chatBox,"chat_mobile");
        }
    }
    render(){
        return(
            <Container className="Status_Container">
                {this.props.messages.map((message,i)=>{
                    return <p className={message.destinationName==="chat_mobile"?"rightSide":"leftSide"} key={"idChat"+i}>Nachricht von {message.destinationName} um {message.time.toLocaleTimeString()}:{message.payloadString}</p>
                })}
                <input className="input_chatbox" type="text" onChange={this._onChange} value={this.state.chatBox} onKeyDown={this._onKeyDown}/>
                
            </Container>
            )
    }

}
export default ChatView