import React, {Component} from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table,Button} from 'react-bootstrap'

class Explore extends  Component{
    constructor(props){
        super(props);
        this.state={date: "12-11-2019"}
        this.downloadSelectedRoute = this.downloadSelectedRoute.bind(this)
    }


    dates = [
    {
        value: '15-11-2019',
        label: '15. November 2019',
    },
    {
        value: '14-11-2019',
        label: '14. November 2019',
    },
    {
        value: '13-11-2019',
        label: '13. November 2019',
    },
    {
        value: '12-11-2019',
        label: '12. November 2019',
    },
];

    handlechange = (e) =>{
        this.setState({date: e.target.value})
    }

    downloadSelectedRoute(){
        console.log("downloadSelectedRoute");
    }
    render() {
        return (
            <Container fluid>
                <div>
                    <OwnMap/>
                </div>
                <Row>
                <Col md={8}>
                    <Card style={{'margin-top':'5px'}}>
                        <Card.Body>
                        <Card.Title>Hier kannst du Details zu der ausgewählten Route betrachten.</Card.Title>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Sensor</th>
                            <th>Messwert</th>
                            <th>Zeit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>1</td>
                            <td>Temperatur</td>
                            <td>33°C</td>
                            <td>2019-12-09T12:39:00</td>
                            </tr>
                            <tr>
                            <td>2</td>
                            <td>PM10</td>
                            <td>22.45µg/m³</td>
                            <td>2019-12-09T12:39:00</td>
                            </tr>
                            <tr>
                            <td>3</td>
                            <td>rel. Luftfeuchtigkeit</td>
                            <td>78%</td>
                            <td>2019-12-09T12:39:00</td>
                            </tr>
                        </tbody>
                        </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                <Card style={{'margin-top':'5px'}}>
                    <Card.Body>
                        <Card.Title>Wähle eine vorherige Route aus um sie auf der Karte anzuzeigen.</Card.Title>
                <TextField
                    id="standard-select-date"
                    select
                    label=""
                    value={this.state.date}
                    onChange={this.handlechange.bind(this)} 
                    margin="normal"
                    variant="outlined"
                >
                    {this.dates.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <br></br>
                <Button onClick={this.downloadSelectedRoute} variant="primary">Diese Route herunterladen</Button>
                </Card.Body>
                </Card>
                </Col>
                </Row>
            </Container>

        );
    }


}

export default Explore;