import React, {Component} from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'
import {Container,Row,Col,Card,Table,Button} from 'react-bootstrap'

class TableView extends  Component{
    constructor(props){
        super(props);
        this.state={
            data:null
        }
    }

    componentDidMount(){
        // pose request to get all fields from the fastdata table 
        let url = 'http://128.176.146.233:3134/logger/command=browseSymbols&format=json';
        fetch(url)
        .then((response)=>{
            return response.json()
        })
        .then((json)=>{
            this.setState(
                {
                    data:json
                }
            )
        })

    }

    handlechange = (e) =>{
        this.setState({date: e.target.value})
    }

    render() {
        return (
            <Container fluid>
            </Container>

        );
    }


}

export default TableView;