import React, { Component } from 'react';
import Modal from 'react-modal';
import OwnMap from '../Map/OwnMap'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import '../index.css'
import './MapView.css'
import { FaRegEdit } from 'react-icons/fa'
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: '80%',
        padding: '1rem'
    },
    overlay: {
        zIndex: 1000
    }
};

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            shortcuts: {
                AirTC_Avg: "°C",
                LiveBin_1dM: "P10",
                RH_Avg: "%",
                time: "Time",
                Gill_Diag: "Wind",
                compass_heading: "S/N/W/E",
                CPC_aux: "CPC",
                CO2: "CO2",
                u: 'u',
                v: 'v',
                w: 'w',
                Ts: 'Ts'
            },
            liveRoute: {
                geoJson: {
                    features: []
                }
            },
            CommentIsOpen: false,
            selectedMeasurement: []
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this._toggleSelected = this._toggleSelected.bind(this);
    }

    componentDidMount = () => {
        this.setState(this.props)
        Modal.setAppElement('body');
    }

    // handleSelected = (selectedTemp, selectedHumi, selectedPm10, selectedTime) => {
    //     this.setState({
    //         selectedTemp,
    //         selectedHumi,
    //         selectedPm10,
    //         selectedTime,
    //     })
    // }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.liveRoute) !== JSON.stringify(prevProps.liveRoute) || JSON.stringify(this.props.startpoint) !== JSON.stringify(prevProps.startpoint) || JSON.stringify(this.props.endpoint) !== JSON.stringify(prevProps.endpoint)) {
            this.setState(this.props)
        }
    }

    handleSubmit = (event) => {
        this.closeModal();
        event.preventDefault()
        var comment = event.target[0].value;
        this.props._addCommentToGeoJson(this.state.selectedRow, comment);
    }

    openModal(e) {
        let that = this;
        this.props.liveRoute.geoJson.features.forEach(function (feature) {
            if (feature.properties.time === e.target.value) {
                that.setState({ selectedComment: feature.properties.comment })
            }
        })
        this.setState({ CommentIsOpen: true, selectedRow: e.target.value });
    }

    closeModal() {
        this.setState({ CommentIsOpen: false });
    }

    _toggleSelected(e) {
        // this.setState((prevState) => {
        //     selected: !prevState.selected}
        // )
        // compare timestring if found push that whole measurement (feature) to the state
        let that = this;
        this.props.liveRoute.geoJson.features.forEach(function (feature) {
            if (feature.properties.time === e) {
                that.setState({ selectedMeasurement: feature, selected: true })
            }
        })    
    }

    handleInput(e) {
        this.setState({
            selectedComment: e.target.value
        })
    }

    render() {
        console.log(this.state.selectedMeasurement)

        return (
            <Container fluid>
                <div>
                    <OwnMap _toggleSelected={this._toggleSelected} liveRoute={this.props.liveRoute} route_coordinates={this.props.route_coordinates} startpoint={this.state.startpoint} endpoint={this.state.endpoint} handleSelected={this.handleSelected} />
                </div>
                <Row style={{ 'marginTop': '5px' }}>
                    <Col md={12}>
                        <div style={{ maxHeight: "300px", overflow: "auto" }}>
                            <Table striped bordered hover style={{ width: "100%", fontSize: "x-small" }}>
                                <thead>
                                    <tr>
                                        {Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                            if (this.state.shortcuts[key]) {
                                                return <th key={"id" + index}>{this.state.shortcuts[key]}</th>
                                            }
                                            else return
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.selected ?
                                        <tr>
                                            {Object.keys(this.state.selectedMeasurement.properties).map((key, i) => {
                                                if (this.state.shortcuts[key]) {
                                                    return <td className="customtd" key={"selected" + i}>{this.state.selectedMeasurement.properties[key]}</td>
                                                }
                                            })}
                                            <td className="customtd editButton"><Button value={this.state.selectedMeasurement.properties.time} onClick={this.openModal}><FaRegEdit /></Button></td>
                                        </tr>
                                        : null}
                                    {
                                        this.state.liveRoute.geoJson.features.map((item, i) => {
                                            return (
                                                <tr key={"id2" + i}>
                                                    {Object.keys(item.properties).map((key, index) => {
                                                        if (this.state.shortcuts[key]) {
                                                            return <td className="customtd" key={"ad2" + index} >{item.properties[key]}</td>
                                                        }
                                                    })
                                                    }
                                                    <td className="customtd editButton"><Button value={item.properties.time} onClick={this.openModal}><FaRegEdit /></Button></td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        <br />
                    </Col>
                </Row>
                <div>
                    <Modal
                        isOpen={this.state.CommentIsOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                    >
                        <h4>Kommentar-Funktion</h4>
                        <form onSubmit={this.handleSubmit}>
                            <input onChange={this.handleInput} defaultValue={this.state.selectedComment} type="text" />

                            <div className="button-wrapper">
                                <Button value={this.state.selectedRow} type="submit">Kommentar speichern</Button>
                                <Button onClick={this.closeModal} >Abbrechen</Button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </Container >
        );
    }
}

export default MapView;
