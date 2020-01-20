import React, {Component} from 'react';
import {HashRouter, Route} from "react-router-dom";
import './App.css';

import View from '../View/View'

class App extends  Component{
    constructor(props){
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch("http://localhost:9000/api")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
    }

    componentWillMount() {
        this.callAPI();
    }

    render() {
        return (
            <div className="App">
                <HashRouter>
                    <Route exact path= "/" component={View}/>
                </HashRouter>
            </div>
        );
    }


}

export default App;
