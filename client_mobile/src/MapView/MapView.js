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
                rmclatitude: "lat",
                time: "Time"
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
        return (
            <Container fluid>
                <div>
                    <OwnMap liveRoute={this.props.liveRoute}  route_coordinates={this.props.route_coordinates} startpoint={this.state.startpoint} endpoint={this.state.endpoint} handleSelected={this.handleSelected} />
                </div>
                <Row style={{ 'marginTop': '5px' }}>
                    <Col md={12}>
                        <div style={{ maxHeight: "300px", overflow: "auto" }}>
                            <Table striped bordered hover style={{ width: "100%", fontSize: "x-small" }}>
                                <thead>
                                    <tr>
                                        {Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                            return <th key={"id" + index}>{this.state.shortcuts[key]}</th>
                                        })}
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
                                    {
                                    this.state.liveRoute.geoJson.features.map((item, i) => {
                                        return (
                                            <tr key={"id2" + i}>
                                        {Object.keys(item.properties).map((key, index) => {
                                            return <td key={"ad2" + index}>{item.properties[key]}</td>
                                        })}
                                    </tr>
                                        )
                                    })}
                                </tbody>

                            </Table>
                        </div>
                        <br />
                    </Col>
                </Row>
            </Container >
        );
    }


}

export default MapView;
