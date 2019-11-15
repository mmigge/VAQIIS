import React, {Component} from 'react';
import { Button, Card } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'

class Live extends  Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
            <Button style={{"margin": "15px"}} variant="contained" color="primary">
                Check if Bike is on Track
            </Button>
                <div>
                        <OwnMap/>
                </div>
            </div>

        );
    }


}

export default Live;