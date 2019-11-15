import React from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'



class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };



    render() {
        const position = [52, 7.6];

        return (
            <Map style={{ height: "50vh" }} center={position} zoom={11} ref="map">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


            </Map>);
    }
}

export default OwnMap
