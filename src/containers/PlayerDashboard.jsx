import React, { Component } from 'react';
import {Table} from 'antd';
import { GAME_ON } from '../config/variables';



class PlayerDashboard extends Component {

    state = {
        dataSource:[],
         columns : [{
            title: 'Players',
            dataIndex: 'playerId',
            key: 'playerId',
          },{
            title: 'Dice Thrown',
            dataIndex: 'diceThrown',
            key: 'diceThrown',
          },{
            title: 'Number of 6 Rolled',
            dataIndex: 'sixRolled',
            key: 'sixRolled',
          },{
            title: 'Ladders Climbed',
            dataIndex: 'laddersClimbed',
            key: 'laddersClimbed',
          },{
            title: 'Snakes Encountered',
            dataIndex: 'snakesEncountered',
            key: 'snakesEncountered',
          }]
      
    };
    findWinner = (players) =>{
        let winner;
         players.map((player)=>{
             if(player.pos === 100){
                 winner = player.id;
             }
        });
        
        return winner;
    }
   
    adjustDataforTable = (players) => {
     let dataSource = players.map((elem)=>{
           return { 'diceThrown':elem.diceLog.length,
           'sixRolled':elem.diceLog.filter(dice=>dice === 6).length,
           'laddersClimbed':elem.ladderHikes,
           'snakesEncountered':elem.snakeBites,
           'playerId':`Player ${elem.id}`}

       });
      this.setState({dataSource});
    }

    componentDidMount(){
       
        this.adjustDataforTable(this.props.players);
    }

    componentWillReceiveProps(nextprops) {
        this.adjustDataforTable(nextprops.players);
    }
   

    render() {
        let {players,status} = this.props;
        let {dataSource,columns} = this.state; 
         return dataSource.length ?
         (
            <div>
              {status !== GAME_ON && <h1>{`Player ${this.findWinner(players)} wins!!` }</h1>}
              <Table dataSource={dataSource} columns={columns} pagination={false}/>
            </div>
            
          ) : null;
    }
}

export default PlayerDashboard;