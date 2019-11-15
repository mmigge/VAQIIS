import React, {Component} from 'react';
import { TextField, MenuItem } from '@material-ui/core'
import OwnMap from '../Map/OwnMap'

class Explore extends  Component{
    constructor(props){
        super(props);
        this.state={date: "12-11-2019"}
    }

    dates = [
    {
        value: '15-11-2019',
        label: '15. November 2019',
    },
    {
        value: '14-11-2019',
        label: '14. November 2019',
    },
    {
        value: '13-11-2019',
        label: '13. November 2019',
    },
    {
        value: '12-11-2019',
        label: '12. November 2019',
    },
];

    handlechange = (e) =>{
        this.setState({date: e.target.value})
    }

    render() {
        return (
            <div>
                <TextField
                    id="standard-select-date"
                    select
                    label="Select"
                    value={this.state.date}
                    onChange={this.handlechange.bind(this)}
                    helperText="Please select your date"
                    margin="normal"
                    variant="outlined"
                >
                    {this.dates.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <div>
                    <OwnMap/>
                </div>
            </div>

        );
    }


}

export default Explore;