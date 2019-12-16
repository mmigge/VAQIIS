import React, {Component} from 'react';
import {Tabs, Tab} from '@material-ui/core';
import Live from "../Live/Live";
import Explore from "../Explore/Explore";
import Status from "../Status/Status";

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 1}
    }

    handleChange = (e, newValue) => {
        this.setState({value: newValue})
    };


    render() {
        return (
            <div>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Live View"/>
                    <Tab label="Explore View"/>
                    <Tab label="Status View"/>
                </Tabs>
                {this.state.value === 0 &&
                    <Live/>
                }
                {this.state.value === 1 &&
                    <Explore/>
                }
                {this.state.value ===2 &&
                    <Status/>}
            </div>

        );
    }


}

export default View;