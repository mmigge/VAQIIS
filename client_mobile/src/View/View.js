import React, {Component} from 'react';
import {Tabs, Tab} from '@material-ui/core';
import MapView from "../MapView/MapView";
import TableView from "../TableView/TableView";
import StatusView from "../StatusView/StatusView";

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 0}
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
                    <Tab label="Table View"/>
                    <Tab label="Map View"/>
                    <Tab label="Status View"/>
                </Tabs>
                {this.state.value === 0 &&
                    <TableView/>
                }
                {this.state.value === 1 &&
                    <MapView/>
                }
                {this.state.value ===2 &&
                    <StatusView/>}
            </div>

        );
    }


}

export default View;