import React from 'react'
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet'
// icon creation
import L from 'leaflet'



/**
 * Icon creation for leaflet
 */
var greenIcon = new L.Icon({
    iconUrl: '/static/img/marker-icon-green.png',
    shadowUrl: '/static/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
/**
 * Class OwnMap 
 * provides the map in leaflet for the live component
 * the map receives the liveRoute as probs from the parent component 
 */
class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClickMarker = this.handleClickMarker.bind(this);
        this.deselect = this.deselect.bind(this);
    };

    /**
     * wen a marker is clicked it gets coloured and the table view is updated
     * @param {id of marker} e 
     */
    handleClickMarker(e) {
        // uses time string as id for the markers
        let time_string = e.target.options.value;
        this.setState({
            selectedMarker: time_string
        })
        this.props._toggleSelected(time_string);
    }
    deselect(e){
        this.setState({
            selectedMarker:''
        })
        this.props._toggleSelected('')
    }

    render() {
        // Muenster
        const position = [51.9688129, 7.5922197];
        return (
            <Map onClick={this.deselect} style={{ height: "50vh" }} center={this.props.route_coordinates.length > 0 ? this.props.route_coordinates[this.props.route_coordinates.length - 1 ] : position} zoom={15} ref="map" minZoom={12} maxZoom={17}>
                <TileLayer
                    attribution="Using Mapnik-Tiles"
                    url="/map-tiles/{z}/{x}/{y}.png"
                />
                {/* Map markers on the Map,if marker was clicked turn green */}
                {this.props.liveRoute.geoJson.features.map((marker, i) => {
                    return <Marker value={marker.properties.time} onClick={this.handleClickMarker} key={"marker" + i}
                        icon={ // if clause that checks if the marker is selected
                            this.state.selectedMarker === marker.properties.time?
                            greenIcon:redIcon
                        } position={marker.geometry.coordinates} />
                })}
                {/* Polyline extracted from the geoJSON */}
                {this.props.route_coordinates.length > 0 ? <Polyline positions={this.props.route_coordinates} /> : ""}
            </Map>
        );
    }
}

export default OwnMap