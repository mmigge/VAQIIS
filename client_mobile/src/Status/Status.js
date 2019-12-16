import React, {Component} from 'react';
import {Container,Row,Col} from 'react-bootstrap'

class Status extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount(){
        console.log("Mounted status view");
    }
   
    render(){
        return(
            <Container className="Status_Container">
                <Row>
                    <Col>
                        <p>Connection to Command Center:</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Last saved dataset:</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Last sent dataset:</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>The bike has been acitve for XX hours/minutes</p>
                    </Col>
                </Row>
            </Container>
            )
    }

}
export default Status