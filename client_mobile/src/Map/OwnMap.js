import React from 'react'
import { Map, TileLayer, FeatureGroup, Marker, Popup } from 'react-leaflet'


class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    render() {
        const position = [51.9688129, 7.5922197];

        return (
            <Map style={{ height: "50vh" }} center={position} zoom={15} ref="map" minZoom={12} maxZoom={17}>

                <TileLayer
                    attribution="This map is offline and was created with mapnik tiles"
                    url="map-tiles/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup open>Das Fahrrad steht hier</Popup>
                </Marker>


            </Map>
        );
    }
}

export default OwnMap
