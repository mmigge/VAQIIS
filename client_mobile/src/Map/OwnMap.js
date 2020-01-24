import React from 'react'
import { Map, TileLayer, FeatureGroup, Marker, Polyline } from 'react-leaflet'

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


let last;
let selected;
export let ref;

class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleClick2 = this.handleClick2.bind(this);
    };

    componentDidMount() {
        firstTime = true
    }


    _onFeatureGroupReady = (ref) => {
        if (!firstTime) {
            return;
        }
    }

    handleClick = (selectedLayer, allLayers) => {
        allLayers.eachLayer(layer => { if (JSON.stringify(last) === JSON.stringify(layer._latlng)) { layer.setIcon(goldIcon) } else { layer.setIcon(blueIcon) } });
        if (JSON.stringify(selected) === JSON.stringify(selectedLayer._latlng)) {
            this.props.handleSelected();
            selected = null;
        }
        else {
            const properties = selectedLayer.feature.properties;
            selected = selectedLayer._latlng
            selectedLayer.setIcon(greenIcon)
            this.props.handleSelected(properties.temp, properties.humi, properties.pm10, properties.time);
        }
    }
    handleClick2(e) {
        // uses time string as id for the markers
        let time_string = e.target.options.value;
        this.setState({
            selectedMarker: time_string
        })
        this.props._toggleSelected(time_string);
    }

    render() {

        const position = [51.9688129, 7.5922197];

        return (
            <Map style={{ height: "50vh" }} center={position} zoom={15} ref="map" minZoom={12} maxZoom={17}>
                <TileLayer
                    attribution="Using Mapnik-Tiles"
                    url="map-tiles/{z}/{x}/{y}.png"
                />
                <FeatureGroup ref={(reactFGref) => { this._onFeatureGroupReady(reactFGref); ref = reactFGref }}>
                </FeatureGroup>
                {this.props.liveRoute.geoJson.features.map((marker, i) => {
                    return <Marker value={marker.properties.time} onClick={this.handleClick2} key={"marker" + i}
                        icon={ // if clause that checks if the marker is selected
                            this.state.selectedMarker == marker.properties.time?
                            greenIcon:redIcon
                        } position={marker.geometry.coordinates} />
                })}
                <Polyline positions={this.props.route_coordinates} />
            </Map>
        );
    }
}

export default OwnMap