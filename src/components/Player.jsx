import React from 'react';
import { Motion, spring } from 'react-motion';
import { Circle, Layer, Group, Text } from 'react-konva';
import { getPlayerCoordinates,getColorFromId } from '../config/utils';
import { styles } from '../styles';

export default class CanvasPlayer extends React.Component {

  render () {
    const { player: {  id, pos, boxPosition }, current: { id: currentPlayerId }, grid: { box: { width }}, grid } = this.props;
    const color = getColorFromId(id);
    const { x, y } = getPlayerCoordinates(pos, grid, boxPosition);
    const isCurrent = !!(id === currentPlayerId);
    const isSmallScreen = !!(width < 48)

    return (
      <Layer>
        <Motion style={{x: spring(x), y: spring(y)}}>
          {
            ({x, y}) => (
              <Group>
                <Circle
                  x={x}
                  y={y}
                  radius={ isSmallScreen ? 6 : 12}
                  fill={isCurrent ? styles.white :color }
                  stroke={color}
                  strokeWidth={4}
                  />
                
              </Group>
            )
          }
        </Motion>
      </Layer>
    );
  }
}
