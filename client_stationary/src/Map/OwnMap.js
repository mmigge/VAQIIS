// export default OwnMap
import React from 'react'
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet'
// icon creation
import L from 'leaflet'

let firstTime = true

var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var goldIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClickMarker = this.handleClickMarker.bind(this);
        this.deselect = this.deselect.bind(this);
    };


    handleClickMarker(e) {
        // uses time string as id for the markers
        let time_string = e.target.options.value;
        this.setState({
            selectedMarker: time_string
        })
        this.props._toggleSelected(time_string);
    }
    deselect(e) {
        this.setState({
            selectedMarker: ''
        })
        this.props._toggleSelected('')
    }

    render() {
        const position = [51.9688129, 7.5922197];
        return (
            <Map onClick={this.deselect} style={{ height: "50vh" }} center={position} zoom={15} ref="map" minZoom={12} maxZoom={17}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Map markers on the Map,if marker was clicked turn green */}
                {this.props.liveRoute.geoJson.features.map((marker, i) => {
                    return <Marker value={marker.properties.time} onClick={this.handleClickMarker} key={"marker" + i}
                        icon={ // if clause that checks if the marker is selected
                            this.state.selectedMarker == marker.properties.time ?
                                greenIcon : redIcon
                        } position={marker.geometry.coordinates} />
                })}
                {/* Polyline extracted from the geoJSON */}
                { this.props.route_coordinates.length > 0 ? <Polyline positions={this.props.route_coordinates} /> : ""}
            </Map>
        );
    }
}

export default OwnMap