import React from 'react';
import { Layer, Line } from 'react-konva';
import { getPlayerCoordinates } from '../config/utils';
import { styles } from '../styles';

export default class CanvasLadder extends React.Component {
  render () {
    const { ladder: { startPos, endPos }, grid } = this.props;
    const { x: startX, y: startY } = getPlayerCoordinates(startPos, grid);
    const { x: endX, y: endY } = getPlayerCoordinates(endPos, grid);

    return (
      <Layer>
        <Line
          points={[startX, startY, endX, endY]}
          stroke={styles.yellow}
          lineCap="round"
          strokeWidth={4}
          
          />
        <Line
          points={[startX - 25, startY, endX - 25, endY]}
          stroke={styles.yellow}
          lineCap="round"
          strokeWidth={4}
          
          />
      </Layer>
    )
  }
}
