import React, {Component} from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table,Button} from 'react-bootstrap'
import des from './des.json'

class TableView extends  Component{
    constructor(props){
        super(props);
        this.state={
            data:des
        }
    }

    componentDidMount(){
        // pose request to get all fields from the fastdata table 
        let url = 'http://128.176.146.233:3134/logger/command=browseSymbols&format=json'
        var keyNames = Object.keys(this.state.data.symbols)
        console.log(keyNames)

         console.log(des)
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
        return (
            <Container fluid>
                <Table striped bordered hover>
                    <tr>
                        <th>Name</th>
                        <th>uri</th>
                        <th>type</th>
                        <th>is_enabled</th>
                        <th>is_read_only</th>
                        <th>can_expand</th>
                    </tr>
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
                </Table>
            </Container>

        );
    }


}

export default TableView;