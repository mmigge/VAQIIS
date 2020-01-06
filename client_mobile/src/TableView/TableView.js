import React, {Component} from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table,Button} from 'react-bootstrap'
import des from './des.json'
import fastTable from './fastTable.json'
import fastTableValues from './fastTableValues'

class TableView extends  Component{
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

        // fetch(url)
        // .then((response)=>{
        //     console.log(response)
        //     return response.json()
        // })
        // .then((json)=>{
        //     console.log(json);
        //     this.setState(
        //         {
        //             data:json
        //         }
        //     )
        // })

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
}

export default TableView;