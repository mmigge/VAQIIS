import React from 'react'
import { Map, TileLayer, FeatureGroup,Marker,Popup } from 'react-leaflet'

import L from 'leaflet'

let firstTime = true

export let ref;

class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };


    _onFeatureGroupReady = (ref) => {

        if (!firstTime) {
            return;
        }
        this.FG = ref;
        let GeoJSON = this.getGeoJson()
        let leafletGeoJSON = new L.GeoJSON(GeoJSON);
        let leafletFG = this.FG.leafletElement;
        leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
        firstTime = false;
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log(prevProps)
        console.log(this.props)
         {
            console.log("updated")
            this.FG = ref;
            let GeoJSON = this.getGeoJson()
            let leafletGeoJSON = new L.GeoJSON(GeoJSON);
            let leafletFG = this.FG.leafletElement;
            leafletFG.clearLayers()
            leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
        }
      }



    getGeoJson = () => {
        if(this.props.route){
            return this.props.route.geojson
        }
        else{ return null}
    }





    render() {
        const position = [51.9688129,7.5922197];

        return (
            <Map style={{ height: "50vh" }} center={position} zoom={11} ref="map">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup ref={(reactFGref) => { this._onFeatureGroupReady(reactFGref); ref = reactFGref }}>
                </FeatureGroup>
            </Map>
            );
    }
}

export default OwnMap
