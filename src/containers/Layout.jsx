import React,{Component} from 'react';
import { Layout, Menu, Icon,Button,Modal,message,Tooltip } from 'antd';
import { Stage } from 'react-konva';
import { Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { delay,getPlayerFromId } from '../config/utils';
import PlayerDashboard from './PlayerDashboard';
import Players from './Players';
import { GAME_ON } from '../config/variables';

import '../assets/stylesheets/App.css';

import { addNewPlayer,
  getRollDiceResult,
  movePlayer,
  changePlayer,
  changePlayerPositionInBox,
  recordDiceLog,
  logMessage,
  enableDice,
  setPlayerPersistence,
  endGame,
  addSnakeBite,
  addLadderHike,
  restartGame,
  redraw } from '../store/items/actions';

import Grid from '../components/Grid';
import Ladder from '../components/Ladder';
import Player from '../components/Player';
import Snake from '../components/Snake';

const { Header, Sider, Content } = Layout;


message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});

class BasicLayout extends React.Component {
  state = {
    
    dashboardVisible:false
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  

  componentWillReceiveProps(nextProps){
    const {gameData} = this.props;
    if(gameData.status !== nextProps.gameData.status){
      if(nextProps.gameData.status !== GAME_ON){
        this.setState({dashboardVisible:true});
      }
    }

    if(gameData.players.current.id !== nextProps.gameData.players.current.id){
      message.info(`Player ${getPlayerFromId(nextProps.gameData.players.current.id)} turn`);
    }
  }
  render() {
    
  let {dashboardVisible} =this.state;
    const {
      status,
        players: {
            all,
            current: { color: currentPlayerColor },
            current
          },
        grid: { width, height, layout },
        grid,
        players,
        snakes,
        ladders,
        } = this.props.gameData;
    return (
      <Layout>
        <Sider
          trigger={null}
          
          
          width={400}
        >
          
          <div className="dice" >
          {this.state.diceOutput && <h1 style={{color: 'white'}}>{this.state.diceOutput}</h1>}
          </div>
          <div className="tools">
          <div className="control-buttons">
          <Tooltip placement="bottom" title="Roll Dice">
          <Button  size="large" shape="circle" disabled={status!==GAME_ON ? true:false} onClick={this.rollDice} style={{}}size='large'><Icon type="appstore" /></Button>
          </Tooltip>
          
          <Tooltip  placement="bottom" title="Restart Game">
          <Button  size="large" shape="circle" onClick={this.handleRestart} size='large'>
           <Icon type="reload" />
          </Button>
          </Tooltip>

          <Tooltip  placement="bottom" title="End Game">
          <Button size="large" shape="circle"onClick ={()=>{this.setState({dashboardVisible:true})}}
           type="danger" size="large"><Icon type="close" /></Button></Tooltip>
           </div>
        
          <Players
                players={players}
                addNewPlayer={this.addNewPlayer}
              />
              </div>
          
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <h1 style={{color:'#00142A'}}> Snakes N Ladders</h1>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Stage width={width} height={height}>
                <Grid grid={grid} />
                {/* snakes */
                snakes.map((s, index) => {
                  return (
                    <Snake
                      key={`canvasSnake_${index}`}
                      snake={s}
                      grid={grid}
                    />
                  );
                })}
                {/* ladders */
                ladders.map((l, index) => {
                  return (
                    <Ladder
                      key={`canvasLadder_${index}`}
                      ladder={l}
                      grid={grid}
                    />
                  );
                })}
                {/* players */
                all.map((p, index) => {
                  return (
                    <Player
                      key={`canvasPlayer_${index}`}
                      player={p}
                      current={current}
                      grid={grid}
                    />
                  );
                })}
           </Stage>
            <Modal
          visible={dashboardVisible}
          title="Player Dashboard"
          width={820}
          onCancel={()=>{this.setState({dashboardVisible:false})}}
          footer={
            <Tooltip placement="bottom" title="New Game">
            <Button shape="circle" size="large" key="submit" type="primary"  onClick={this.handleRestart}>
              <Icon type="reload" />
            </Button>
            </Tooltip>
            
          }
        >
          <PlayerDashboard status ={status} players={all}/> 
        </Modal>

                         
          </Content>
        </Layout>
      </Layout>
    );
  }

  handleRestart = () =>{
    this.setState({dashboardVisible:false});
    this.props.restartGame();
  }

  resolveOccupancyOverload = () => {
    delay(() => {
      const {
        grid: { occupancy },
        players: { all }
      } = this.props.gameData;
      const boxesWithMoreThanOneOccupants = Object.keys(occupancy).filter(
        box => occupancy[box] > 1
      );
      for (let box of boxesWithMoreThanOneOccupants) {
        const playersWithinBox = all.filter(player => player.pos == box);
        let count = 0;
        for (let player of playersWithinBox) {
          this.props.changePlayerPositionInBox(player.id, count++);
        }
      }
    });
  }

  checkSnakeBiteorLadderJump = (playerPos) => {
    const {
      snakes,
      ladders,
      players: {
        current: { id }
      }
    } = this.props.gameData;
    const snakeStartPosList = snakes.map(s => s.startPos);
    const ladderStartPosList = ladders.map(l => l.startPos);

    if (snakeStartPosList.indexOf(playerPos) !== -1) {
      /* busted */
      const snake = snakes.filter(s => s.startPos === playerPos)[0];
      this.props.movePlayer(snake.endPos);
      this.props.addSnakeBite();
      // this.props.logMessage(
      //   `A snake ate Player ${id} at ${playerPos}, moved to block ${
      //     snake.endPos
      //   }`
      // );
    }

    if (ladderStartPosList.indexOf(playerPos) !== -1) {
      /* got wings */
      const ladder = ladders.filter(l => l.startPos === playerPos)[0];
      this.props.movePlayer(ladder.endPos);
      this.props.addLadderHike();
      // this.props.logMessage(
      //   `Player ${id} found Ladder at ${playerPos}, moved to block ${
      //     ladder.endPos
      //   }`
      // );
    }
  }

  rollDice = () => {
    
    const {
      players: {
        current: { id, pos },
        persistence
      }
    } = this.props.gameData;
    const diceResult = getRollDiceResult();
    
    this.setState({
      diceOutput: diceResult
    });
    const newPos = pos + diceResult;
  
    this.props.recordDiceLog(diceResult);
  
    /**
     * GAME LOGIC
     **/
    if (newPos > 100) {
      // this.props.logMessage(`Hang in there Player ${id}`);
      this.props.changePlayer();
    } else if (newPos == 100) {
      this.props.movePlayer(newPos);
      this.props.endGame();
    } else {
      this.props.movePlayer(newPos);
      // this.props.logMessage(
      //   `Player ${id} moved from  block ${pos} to block ${newPos}. ${
      //     diceResult === 6 ? '**SIX**' : ''
      //   }`
      // );
  
      this.checkSnakeBiteorLadderJump(newPos);
      this.resolveOccupancyOverload();
  
      if (diceResult === 6 && persistence < 3) {
        this.props.enableDice();
        this.props.setPlayerPersistence(persistence + 1);
      } else {
        this.props.changePlayer();
        this.props.setPlayerPersistence(1);
      }
    }
  }

  addNewPlayer = () => {
    this.props.addNewPlayer();
    this.resolveOccupancyOverload();
  }



  resolveOccupancyOverload = () => {
    delay(() => {
      const {
        grid: { occupancy },
        players: { all }
      } = this.props.gameData;
      const boxesWithMoreThanOneOccupants = Object.keys(occupancy).filter(
        box => occupancy[box] > 1
      );
      for (let box of boxesWithMoreThanOneOccupants) {
        const playersWithinBox = all.filter(player => player.pos == box);
        let count = 0;
        for (let player of playersWithinBox) {
          this.props.changePlayerPositionInBox(player.id, count++);
        }
      }
    });
  }
}

function mapStateToProps(state) {
    return {
      gameData: state.gameData,
    };
  }
  
  export default withRouter(connect(mapStateToProps,{
    addNewPlayer,
    getRollDiceResult,
    movePlayer,
    changePlayer,
    changePlayerPositionInBox,
    recordDiceLog,
    logMessage,
    enableDice,
    setPlayerPersistence,
    endGame,
    addSnakeBite,
    addLadderHike,
    restartGame,
    redraw
  })(BasicLayout));