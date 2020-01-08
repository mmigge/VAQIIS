import React, {Component} from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table,Button} from 'react-bootstrap'
import des from './des.json'
import fastTable from './fastTable.json'
import fastTableValues from './fastTableValues'

class TableView extends Component{

    constructor(props){
        super(props);   
        this.state={
            data:des,
            fastTable:fastTable,
            fastTableValues:fastTableValues
        }
    }  

    componentDidMount(){
        // pose request to get all fields from the fastdata table 
        let url = 'http://128.176.146.233:3134/logger/command=browseSymbols&format=json'
        var keyNames = Object.keys(this.state.data.symbols)

        /*
        fetch(url)
        .then((response)=>{
            console.log("here", response)
            return response.json()
        })
        .then((json)=>{
            console.log(json);
            this.setState(
                {
                    data:json
                }
            )
        })

        */

    }

    handlechange = (e) =>{
        this.setState({date: e.target.value})
    }

    render() {
        console.log(this.state.fastTableValues)
        return (
            <Container fluid>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>uri</th>
                        <th>type</th>
                        <th>is_enabled</th>
                        <th>is_read_only</th>
                        <th>can_expand</th>
                    </tr>
                    </thead>
                    <tbody>
                {this.state.data.symbols.map((field)=>(
                    <tr>
                        <td>{field.name}</td>
                        <td>{field.uri}</td>
                        <td>{field.type}</td>
                        <td>{field.is_enabled.toString()}</td>
                        <td>{field.is_read_only.toString()}</td>
                        <td>{field.can_expand.toString()}</td>
                    </tr>
                    ))}
                    </tbody>
                </Table>
                <hr></hr>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>uri</th>
                        <th>type</th>
                        <th>is_enabled</th>
                        <th>is_read_only</th>
                        <th>can_expand</th>
                    </tr>
                    </thead>
                    <tbody>
                {this.state.fastTable.symbols.map((field)=>(
                <tr>
                    <td>{field.name}</td>
                    <td>{field.uri}</td>
                    <td>{field.type}</td>
                    <td>{field.is_enabled.toString()}</td>
                    <td>{field.is_read_only.toString()}</td>
                    <td>{field.can_expand.toString()}</td>
                </tr>
                ))}
                </tbody>
                </Table>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Units</th>
                        <th>Process</th>
                        <th>Settable</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.fastTableValues.head.fields.map((field,index)=>(
                     <tr>
                     <td>{field.name}</td>   
                     <td>{field.type}</td>   
                     <td>{field.process}</td>   
                     <td>{field.settable}</td>   
                     <td>{field.name}</td>
                     <td>{this.state.fastTableValues.data[0].vals[index]}</td>
                     </tr>   
                     ))}
                     </tbody>
                </Table>
            </Container>

        );
    }

    convertGPSData(coordinateObjectString){
        // Leading zeros not allowed --> string
        const position = ['5157.88870', '00736.34599'];
        
        let lat_temp_1 = parseFloat(position[0].split('.')[0].substring(0,2));
        let lat_temp_2 = parseFloat(position[0].split(lat_temp_1)[1])/60;
        let lat = lat_temp_1 + lat_temp_2;

        let long_temp_1 = parseFloat(position[1].split('.')[0].substring(0,3));
        let long_temp_2 = parseFloat(position[1].split(long_temp_1)[1])/60;
        let long = long_temp_1 + long_temp_2;

        const coordinates = {
            latitude: lat,
            longtitude: long
        }
        return coordinates;
    }
}

export default TableView;