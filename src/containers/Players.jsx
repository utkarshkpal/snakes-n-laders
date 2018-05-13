import React from 'react';
import { styles } from '../styles';
import { MAX_PLAYERS } from '../config/variables';
import {getColorFromId} from '../config/utils';
import {Button,Icon,Tooltip} from 'antd';
import '../assets/stylesheets/App.css';


export default class Players extends React.Component {
  render () {
    const { all, current: { id }, count:playersCount } = this.props.players;
    return [
      <div className="player">
        
      <span className="player-span">
        Players
         </span>
      {
          playersCount < MAX_PLAYERS
          ?
          <Tooltip title="Add Player" placement="bottom">
          <Button className="add-new" size="large" shape="circle" onClick={() => { this.props.addNewPlayer() }}><Icon type="user-add" /></Button></Tooltip>
          : null 
        }
        </div>
      
      ,
      <div style={{marginTop:'30px'}}>
        {
        all.map((p, index) => {
          return (
            <Player player={p} currentPlayerId={id} key={`player_${index}`} />
          );
        })
      }
        </div>

    ]
  }
}

class Player extends React.Component {
  render () {
    const { player: {id, pos}, currentPlayerId } = this.props;
    const color = getColorFromId(id);
    const highlight =  id === currentPlayerId ? {
      color: color,
      background: color,
      borderColor: '#ffff',
    } : {}
    const playerStyle = {
      ...styles.player,
      background: color,
      borderColor: color,
      ...highlight,
      marginLeft:'30px'
      
    }

    return (
      <div style={playerStyle}>
       
      </div>
    )
  }
}
