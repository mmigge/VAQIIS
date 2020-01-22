import React, { Component } from 'react';
import { Container, Table, Dropdown, DropdownButton } from 'react-bootstrap'
import ReactLoading from 'react-loading'
//
class TableView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            tables: []
        }
    }

    // _getAllTables(){
    //     let url = 'http://128.176.146.233:3134/logger/command=browseSymbols&format=json'
    //     fetch(url)
    //     .then(response=>response.json())
    //     .then(json=>{json.symbols.map((table)=>this.state.tables.push(table.name))})
    //     .then(()=>this._getTableByName(this.state.tables[0]))

    // }
    // _getTableByName(name){
    //     this.setState({loading:true})
    //     let url = 'http://128.176.146.233:3134/logger/command=dataQuery&uri=dl:'+name+'&mode=most-recent&format=json';
    //     fetch(url)
    //     .then((response)=>response.json())
    //     .then((json)=>{
    //         this.setState({
    //             selectedTable:json
    //         })
    //     })
    //     .then(()=>this._getSensors(name))
    // }
    // _getSensors(name)
    // {   console.log(name,"function called")
    //     let url = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:'+name+'&mode=most-recent&format=json'
    //     fetch(url)
    //     .then(response=>response.json())
    //     .then(json=>{
    //         this.setState(
    //             {
    //                 selectedTableValues:json,
    //                 loading:false
    //             }
    //         )
    //     })
    // }

    componentDidMount() {
        console.log(this.props)
        // this._getAllTables()
    }

    // _convertGPSData(coordinateObjectString){
    //     // Leading zeros not allowed --> string
    //     const position = ['5157.88870', '00736.34599'];
    //     let lat_temp_1 = parseFloat(position[0].split('.')[0].substring(0,2));
    //     let lat_temp_2 = parseFloat(position[0].split(lat_temp_1)[1])/60;
    //     let lat = lat_temp_1 + lat_temp_2;
    //     let long_temp_1 = parseFloat(position[1].split('.')[0].substring(0,3));
    //     let long_temp_2 = parseFloat(position[1].split(long_temp_1)[1])/60;
    //     let long = long_temp_1 + long_temp_2;

    //     const coordinates = {
    //         latitude: lat,
    //         longtitude: long
    //     }
    //     return coordinates;
    // }

    // handlechange = (e) =>{
    //     this.setState({date: e.target.value})
    // }

    render() {
        if (!this.state.loading) {
            return (
                <div className="ReactLoading">
                    <ReactLoading className="Spinner" type="spin" color="blue" />
                </div>
            )
        }
        else {
            return (
                <Container fluid>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                    return <th key={"id" + index}>{key}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.liveRoute.geoJson.features.map((item, i) => {
                                return (
                                    <tr key={"id2" + i}>
                                        {Object.keys(this.props.liveRoute.geoJson.features[0].properties).map((key, index) => {
                                            return <td key={"ad2" + index}>{this.props.liveRoute.geoJson.features[0].properties[key]}</td>
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
            )
        }
    }

}

export default TableView;