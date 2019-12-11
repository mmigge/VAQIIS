import React from 'react'
import { Map, TileLayer, FeatureGroup,Marker,Popup } from 'react-leaflet'


class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };



    render() {
        const position = [51.9688129,7.5922197];

        return (
            <Map style={{ height: "50vh" }} center={position} zoom={16} ref="map">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position = {position}>
                    <Popup open>Das Fahrrad steht hier</Popup>
                </Marker>


            </Map>
            );
    }
}

export default OwnMap
