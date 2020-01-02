import React, { Component } from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap'


var exampleData = {
    data: [
        {
            date: "15-11-2019",
            data: 0,
            geojson: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    7.60528564453125,
                                    51.97155731422007
                                ],
                                [
                                    7.605628967285155,
                                    51.964577109947506
                                ],
                                [
                                    7.6197052001953125,
                                    51.95759581845331
                                ],
                                [
                                    7.632408142089844,
                                    51.96119237712624
                                ],
                                [
                                    7.634468078613281,
                                    51.96732701717229
                                ],
                                [
                                    7.622451782226563,
                                    51.97134580885172
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        {
            date: "24-11-2019",
            data: 1, 
            geojson: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    7.6032257080078125,
                                    51.9599230364245
                                ],
                                [
                                    7.623481750488281,
                                    51.96690396550418
                                ],
                                [
                                    7.615585327148437,
                                    51.94638116576159
                                ]
                            ]
                        }
                    }
                ]
            }
        }
    ]
}

class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = { date: "null", route: null }
        this.downloadSelectedRoute = this.downloadSelectedRoute.bind(this)
    }


    dates = [{value: "null", label: "dd-mm-yyyy"}];

    componentWillMount(){
        for (var date of exampleData.data){
            this.dates.push({value: date.date, label: date.date})
        }
        console.log(this.dates)
    }

    handlechange = (e) => {

        const value = e.target.value
        let route;
        if (value == null){
            route= null
        }
        else{
        for (var data of exampleData.data){
            if(data.date=== value)
            {
                route= data
            }
        }
    }
        this.setState({ date: value, route : route })

    }

    downloadSelectedRoute() {
        console.log("downloadSelectedRoute");
    }
    render() {
        return (
            <Container fluid>
                <div>
                    <OwnMap route={this.state.route} />
                </div>
                <Row>
                    <Col md={8}>
                        <Card style={{ 'margin-top': '5px' }}>
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
                        <Card style={{ 'margin-top': '5px' }}>
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
                                    placholder="dd-mm-yyyy"
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