import React,{Component} from 'react';
import { Layout, Menu, Icon,Button } from 'antd';
import { Stage } from 'react-konva';
import { Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { delay } from '../config/utils';


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


 class BasicLayout extends React.Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {

    const {
        players: {
            all,
            current: { color: currentPlayerColor },
            current
          },
        grid: { width, height, layout },
        grid,
        snakes,
        ladders,
        } = this.props.gameData;
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width={400}
        >
          <div className="logo" >
          
          <Button onClick={this.rollDice} style={{marginTop:'550px'}}size='large'>Roll dice</Button>
          </div>
          
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
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
          </Content>
        </Layout>
      </Layout>
    );
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
    console.log('rollDice');
    const {
      players: {
        current: { id, pos },
        persistence
      }
    } = this.props.gameData;
    const diceResult = getRollDiceResult();
    console.log(diceResult);
    this.setState({
      diceOutput: diceResult
    },()=>{
      console.log(this.state);
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