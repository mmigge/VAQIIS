import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap'
import ReactLoading from 'react-loading'

/**
 * Class TableView 
 * Child component to View 
 * Everytime a new measurement arrives the table view is updated and a new row is added to the table
 */
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            tables: []
        }
    }
    componentDidMount() {
    }

    isRecorded = (time) => {
        var startTime;
        var endTime;
        if (this.props.startpoint) {
            startTime = this.props.startpoint.properties.time;
            if (this.props.endpoint) {
                endTime = this.props.endpoint.properties.time;
            }
        }
        else {
            return false;
        }
        // Looks stupid but works as long as time is in 24h format...
        if (startTime <= time) {
            if (endTime) {
                if (endTime > time) {
                    return true;
                }
            }
        }

        return false;
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="ReactLoading">
                    <ReactLoading className="Spinner" type="spin" color="blue" />
                </div>
            )
        }
        else {
            return (
                <Container fluid>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                    return <th key={"id" + index}>{key}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.liveRoute.geoJson.features.map((item, i) => {
                                return (
                                    <tr key={"id2" + i} class={this.isRecorded(item.properties.time) ? "highlighted" : ""} >
                                        {Object.keys(item.properties).map((key, index) => {
                                            return <td key={"ad2" + index}>{item.properties[key]}</td>
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
            )
        }
    }

}

export default TableView;