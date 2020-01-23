import React, { Component } from 'react';
import Modal from 'react-modal';
import OwnMap from '../Map/OwnMap'
import { Container, Row, Col, Table } from 'react-bootstrap'
import '../index.css'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: { zIndex: 1000 }
};

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
                time: "Time",
                Gill_Diag: "Wind"

            },
            liveRoute: {
                geoJson: {
                    features: []
                }
            },
            CommentIsOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount = () => {
        this.setState(this.props)
        Modal.setAppElement('body');
    }

    handleSelected = (selectedTemp, selectedHumi, selectedPm10, selectedTime) => {
        this.setState({
            selectedTemp,
            selectedHumi,
            selectedPm10,
            selectedTime,
        })
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.liveRoute) !== JSON.stringify(prevProps.liveRoute) || JSON.stringify(this.props.startpoint) !== JSON.stringify(prevProps.startpoint) || JSON.stringify(this.props.endpoint) !== JSON.stringify(prevProps.endpoint)) {
            this.setState(this.props)
        }
    }

    handleSubmit = (event) => {
        this.closeModal();
        event.preventDefault()
        var comment = event.target[0].value;
        this.props._addCommentToGeoJson(this.state.selectedRow,comment);
    }

    openModal(e) {
        let that = this;
        this.props.liveRoute.geoJson.features.forEach(function(feature){
            if(feature.properties.time===e.target.value){
                that.setState({selectedComment:feature.properties.comment})
            }
        })
        this.setState({ CommentIsOpen: true ,selectedRow:e.target.value});
    }

    closeModal() {
        this.setState({ CommentIsOpen: false });
    }
    handleInput(e){
        this.setState({
            selectedComment:e.target.value
        })
    }
    render() {
        return (
            <Container fluid>
                <div>
                    <OwnMap liveRoute={this.props.liveRoute} route_coordinates={this.props.route_coordinates} startpoint={this.state.startpoint} endpoint={this.state.endpoint} handleSelected={this.handleSelected} />
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
                                    {
                                        this.state.liveRoute.geoJson.features.map((item, i) => {
                                            return (
                                                <tr key={"id2" + i}>
                                                    {Object.keys(item.properties).map((key, index) => {
                                                        return <td key={"ad2" + index} >{item.properties[key]}</td>
                                                    })}
                                                    <td><button value={item.properties.time} onClick={this.openModal}>Add Comment</button></td>
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
                        contentLabel="Example Modal"
                        class="Model"
                    >
                        <h3>Kommentar Editieren</h3>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input onChange={this.handleInput} value={this.state.selectedComment} type="text"/>
                            </div>
                            <div className="button-wrapper">
                                <button value={this.state.selectedRow} type="submit">Kommentar speichern</button>
                                <button onClick={this.closeModal} >Abbrechen</button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </Container >
        );
    }
}

export default MapView;
