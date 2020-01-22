import React, { Component } from 'react';
import { Button } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import { Container, Row, Col, Card, Table } from 'react-bootstrap'
import '../index.css'

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            shortcuts: {
                AirTC_Avg: "°C",
                LiveBin_10dM: "P10",
                RH_Avg: "%",
                rmclatitude:"lat",
                time:"Time"
            },
            liveRoute: {
                geoJson: {
                    features: []
                }
            }

        }
        this.submit = this.submit.bind(this);
    }

    componentDidMount = () => {
        this.setState(this.props)

    }
    handleSelected = (selectedTemp, selectedHumi, selectedPm10, selectedTime) => {
        this.setState({
            selectedTemp,
            selectedHumi,
            selectedPm10,
            selectedTime,
        })
    }

    submit() {
        console.log("submit");
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.liveRoute) !== JSON.stringify(prevProps.liveRoute) || JSON.stringify(this.props.startpoint) !== JSON.stringify(prevProps.startpoint) || JSON.stringify(this.props.endpoint) !== JSON.stringify(prevProps.endpoint)) {
            this.setState(this.props)
        }

    }

    transfromDate = function (date) {

        if (!date) { return "" }
        date = new Date(date)
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
        var hours = date.getHours();
        var min = date.getMinutes();

        return (dd > 9 ? '' : '0') + dd + "-" + (mm > 9 ? '' : '0') + mm + "-" + date.getFullYear() + " " + (hours > 9 ? '' : '0') + hours + ":" + (min > 9 ? '' : '0') + min;
    };

    render() {
        console.log(this.props.liveRoute)
        return (
            <Container fluid>
                <div>
                    <OwnMap route={this.props.liveRoute} lastMeasurement={this.state.lastMeasurement} startpoint={this.state.startpoint} endpoint={this.state.endpoint} handleSelected={this.handleSelected} />
                </div>
                <Row style={{ 'marginTop': '5px' }}>
                    <Col md={8}>
                        <div style={{ maxHeight: "300px", overflow: "auto" }}>
                            <Table striped bordered hover style={{ width: "100%", fontSize: "x-small" }}>
                                <thead>
                                    <tr >
                                        {
                                            Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                                return <th key={"id"+index}>{this.state.shortcuts[key]}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
{/* 
                                    <tr >
                                        <td>Selected</td>
                                        <td>{this.state.selectedTemp}</td>
                                        <td>{this.state.selectedPm10}</td>
                                        <td>{this.state.selectedHumi}</td>
                                        <td>{this.transfromDate(this.state.selectedTime)}</td>
                                    </tr> */}
                                    {this.state.liveRoute.geoJson.features.map((item, i) => {
                                        return (
                                            <tr key={"id2"+i}>
                                                {Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                                    return <td key={"ad2"+index}>{this.props.liveRoute.geoJson.features[0].properties[key]}</td>
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>

                            </Table>
                        </div>
                        <br />
                    </Col>
                    <Col md={4}>
                        <Card >
                            <Card.Body>
                                <Card.Title>Connection overview</Card.Title>
                                <Card.Text>
                                    Click here to manage your connection to the eco bike
                                </Card.Text>
                                <Button style={{ "margin": "15px" }} variant="contained" color="primary">
                                    Check if Bike is on Track
                            </Button>
                                {/* If clause to decide which button to display */}
                                {this.state.connected
                                    ? <Button
                                        style={{ "margin": "15px" }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.disconnectMQTT}
                                    >Disconnect from MQTT
                                </Button>
                                    :
                                    <Button
                                        style={{ "margin": "15px" }}
                                        variant="contained"
                                        color="primary"
                                        onClick={this.connectMQTT}
                                    >Connect to the Bike
                                </Button>
                                }                    </Card.Body>
                        </Card>
                    </Col>

                </Row>

                <Row>
                    <Col md={8}>

                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Add comments to the measured data</Card.Title>
                                <Card.Text>Crucial information about how to understand the dataset e.g. "High PM10 values because we were standing behind a bus can be added here.</Card.Text>
                                <form onSubmit={this.submit}>
                                    <label>
                                        <textarea value={this.state.value} onChange={this.handleChange}></textarea>
                                    </label>
                                    <input style={{ "margin": "15px" }} type="submit" value="Submit" />
                                </form>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
        );
    }


}

export default MapView;
