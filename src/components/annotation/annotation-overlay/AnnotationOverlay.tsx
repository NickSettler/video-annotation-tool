import { JSX, useCallback, useState } from 'react';
import { Circle, Group, Line } from 'react-konva';
import Konva from 'konva';
import { minMax } from '../../../utils/annotation/min-max';

export type TAnnotationOverlayProps = {
  points: Array<Array<number>>;
  flattenedPoints: Array<number>;
  isFinished: boolean;
  handlePointDragMove(e: Konva.KonvaEventObject<DragEvent>): void;
  handleGroupDragEnd(e: Konva.KonvaEventObject<DragEvent>): void;
  handleMouseOverStartPoint(e: Konva.KonvaEventObject<MouseEvent>): void;
  handleMouseOutStartPoint(e: Konva.KonvaEventObject<MouseEvent>): void;
};

export const AnnotationOverlay = ({
  points,
  flattenedPoints,
  isFinished,
  handlePointDragMove,
  handleGroupDragEnd,
  handleMouseOverStartPoint,
  handleMouseOutStartPoint,
}: TAnnotationOverlayProps): JSX.Element => {
  const vertexRadius = 6;

  const [stage, setStage] = useState<Konva.Stage>();
  const [minMaxX, setMinMaxX] = useState([0, 0]);
  const [minMaxY, setMinMaxY] = useState([0, 0]);

  const handleGroupMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isFinished) return;

    const _stage = e.target.getStage();

    if (!_stage) return;

    _stage.container().style.cursor = 'move';
    setStage(_stage);
  };

  const handleGroupMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const _stage = e.target.getStage();

    if (!_stage) return;

    _stage.container().style.cursor = 'default';
  };

  const handleGroupDragStart = useCallback(() => {
    const arrX = points.map((p) => p[0]);
    const arrY = points.map((p) => p[1]);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  }, [points]);

  const groupDragBound = useCallback(
    (pos: Konva.Vector2d) => {
      if (!stage) return pos;

      let { x, y } = pos;

      const sw = stage.width();
      const sh = stage.height();

      if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
      if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
      if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
      if (minMaxX[1] + x > sw) x = sw - minMaxX[1];

      return { x, y };
    },
    [minMaxX, minMaxY, stage],
  );

  const dragBoundFunc = (pos: Konva.Vector2d) => {
    if (!stage) return pos;

    const stageWidth = stage.width();
    const stageHeight = stage.height();

    let { x, y } = pos;

    if (pos.x + vertexRadius > stageWidth) x = stageWidth;
    if (pos.x - vertexRadius < 0) x = 0;
    if (pos.y + vertexRadius > stageHeight) y = stageHeight;
    if (pos.y - vertexRadius < 0) y = 0;

    return { x, y };
  };

  return (
    <Group
      name='polygon'
      draggable={isFinished}
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
      dragBoundFunc={groupDragBound}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
    >
      <Line
        points={flattenedPoints}
        stroke='red'
        strokeWidth={3}
        closed={isFinished}
        fill='rgb(0,128,0,0.5)'
      />

      {points.map((point, index) => {
        const x = point[0] - vertexRadius / 2;
        const y = point[1] - vertexRadius / 2;
        const startPointAttr =
          index === 0
            ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
              }
            : null;
        return (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={vertexRadius}
            fill='white'
            stroke='black'
            strokeWidth={2}
            draggable
            onDragMove={handlePointDragMove}
            dragBoundFunc={dragBoundFunc}
            {...startPointAttr}
          />
        );
      })}
    </Group>
  );
};
