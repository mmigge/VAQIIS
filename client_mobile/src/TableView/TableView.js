import React, {Component} from 'react';
import {Container,Table,Dropdown,DropdownButton} from 'react-bootstrap'
import ReactLoading from 'react-loading'
//
class TableView extends Component{

    constructor(props){
        super(props);   
        this.state={
            data:[],
            loading:true,
            tables:[]
        }
    }  

    _getAllTables(){
        let url = 'http://128.176.146.233:3134/logger/command=browseSymbols&format=json'
        fetch(url)
        .then(response=>response.json())
        .then(json=>{json.symbols.map((table)=>this.state.tables.push(table.name))})
        .then(()=>this._getTableByName(this.state.tables[0]))

    }
    _getTableByName(name){
        this.setState({loading:true})
        let url = 'http://128.176.146.233:3134/logger/command=dataQuery&uri=dl:'+name+'&mode=most-recent&format=json';
        fetch(url)
        .then((response)=>response.json())
        .then((json)=>{
            this.setState({
                selectedTable:json
            })
        })
        .then(()=>this._getSensors(name))
    }
    _getSensors(name)
    {   console.log(name,"function called")
        let url = 'http://128.176.146.233:3134/logger/command=dataquery&uri=dl:'+name+'&mode=most-recent&format=json'
        fetch(url)
        .then(response=>response.json())
        .then(json=>{
            this.setState(
                {
                    selectedTableValues:json,
                    loading:false
                }
            )
        })
    }

    componentDidMount(){
       // this._getAllTables()
        
    }  

    _convertGPSData(coordinateObjectString){
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

    handlechange = (e) =>{
        this.setState({date: e.target.value})
    }

    render() {
        if(this.state.loading)
        { 
            return( 

            <div className="ReactLoading">
                <ReactLoading className="Spinner" type="spin" color="blue"/>
            </div>
            )
        }
        else {
        return(
            <Container fluid>
                <DropdownButton id="dropdown-basic-button" title={this.state.selectedTable.head.environment.table_name}>
                    {this.state.tables.map((name,index)=>{
                        return(
                            <Dropdown.Item onSelect={()=>this._getTableByName(name)} key={"id"+index}>{name}</Dropdown.Item>
                        )
                    })}

                </DropdownButton>
                <Table>
                    <thead>
                        <tr>
                            {this.props.liveRoute.geoJson.features[0].properties.map((propertie,i)=>{
                                return(<td key={"id"+i}>{propertie.name}</td>)
                            })}
                        </tr>
                    </thead>
                </Table>
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
            {this.state.selectedTable.head.fields.map
                ((field,index)=>
                    {   
                        if(this.state.selectedTableValues.data.length===0){
                            return(
                                <tr key={"id"+index}>
                                    <td>{field.name}</td>   
                                </tr> 
                                )
                        }
                        if(this.state.selectedTableValues.data[0].vals[index])
                        {
                            return(
                            <tr key={"id"+index}>
                                <td>{field.name}</td>   
                                <td>{this.state.selectedTableValues.data[0].vals[index]}</td>
                            </tr> 
                            )
                        }
                        else return null;
                        
                })
            }
            </tbody>
        </Table> 
        </Container>
        )
    }
    }

}

export default TableView;