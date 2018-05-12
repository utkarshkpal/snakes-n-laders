import React, { Component } from 'react';
import {Table} from 'antd';


class PlayerDashboard extends Component {

    state = {
        dataSource:[],
         columns : [{
            title: 'Dice Thrown',
            dataIndex: 'diceThrown',
            key: 'diceThrown',
          },{
            title: 'Number of 6 Rolled',
            dataIndex: 'sixRolled',
            key: 'sixRolled',
          }, {
            title: 'Ladders Climbed',
            dataIndex: 'laddersClimbed',
            key: 'laddersClimbed',
          }, {
            title: 'Snakes Encountered',
            dataIndex: 'snakesEncountered',
            key: 'snakesEncountered',
          }]
      
    };
   
    adjustDataforTable = (players) => {
     let dataSource = players.map((elem)=>{
           return { 'diceThrown':elem.diceLog.length,
           'sixRolled':elem.diceLog.filter(dice=>dice ===6).length,
           'laddersClimbed':elem.ladderHikes,
           'snakesEncountered':elem.snakeBites,
           'playerId':elem.id}

       });
      this.setState({dataSource});
    }

    componentDidMount(){
        console.log('conmponentDidMount');
        this.adjustDataforTable(this.props.players);
    }
   

    render() {
        let {players} = this.props;
        let {dataSource,columns} = this.state; 
       
        
        return dataSource.length ?
         [
             
             <h2>{`Player ${dataSource[0].playerId}`}</h2>,
            <Table dataSource={dataSource} columns={columns} pagination={false}/>
            
        ] : null;
    }
}

export default PlayerDashboard;