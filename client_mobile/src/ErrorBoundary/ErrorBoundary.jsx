import React, {Component} from 'react';


class ErrorBoundary extends Component{
    constructor(props){
        super(props);
        this.state={hasError:false};
    }   

    componentDidCatch(error,info){
        this.setState({hasError:true})
        console.log(info,error);
    }

    render(){
        if(this.state.hasError){
            return (
                <div>
                <h1>Something went wrong</h1>
                <h2>Please try to reload the website</h2>
                </div>
                )
        }
        return this.props.children;
    }
}

export default ErrorBoundary