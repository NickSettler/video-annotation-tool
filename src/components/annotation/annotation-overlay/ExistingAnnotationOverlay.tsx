import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import {
  TAnnotation,
  updateFramePolygonAction,
} from '../../../store/annotation';
import { Circle, Group, Label, Line, Tag, Text } from 'react-konva';
import { getPolygonName, isGroupName } from '../../../utils/annotation/name';
import Konva from 'konva';
import { minMax } from '../../../utils/annotation/min-max';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { videoCurrentFrameSelector } from '../../../store/video';
import { alpha } from '@mui/material';
import { compare } from '../../../utils/object/compare';
import { getPolygonCentroid } from '../../../utils/polygons/centroid';

export type TExistingAnnotationOverlayProps = {
  annotation: TAnnotation;
};

export const ExistingAnnotationOverlay = ({
  annotation,
}: TExistingAnnotationOverlayProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const currentFrame = useAppSelector(videoCurrentFrameSelector);

  const vertexRadius = 3;

  const [points, setPoints] = useState<Array<Array<number>>>(
    annotation.geometry.coordinates,
  );
  const [renderPoints, setRenderPoints] = useState<Array<Array<number>>>(
    annotation.geometry.coordinates,
  );
  const [stage, setStage] = useState<Konva.Stage>();
  const [minMaxX, setMinMaxX] = useState([0, 0]);
  const [minMaxY, setMinMaxY] = useState([0, 0]);

  const center = useMemo(() => {
    return getPolygonCentroid(renderPoints);
  }, [renderPoints]);

  const updateAnnotation = useCallback(() => {
    dispatch(
      updateFramePolygonAction({
        polygonID: `${annotation.id}`,
        frame: currentFrame,
        payload: {
          geometry: {
            coordinates: points,
          },
        },
      }),
    );
  }, [annotation, currentFrame, dispatch, points]);

  useEffect(() => {
    if (!compare(points, annotation.geometry.coordinates)) updateAnnotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  const handleGroupMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
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

  const pointBoundFunc = (pos: Konva.Vector2d) => {
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

  const handlePointDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const _stage = e.target.getStage();

    if (!_stage) return;

    const index = e.target.index - 1;
    const pos = [e.target._lastPos?.x ?? 0, e.target._lastPos?.y ?? 0];

    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > _stage.width()) pos[0] = _stage.width();
    if (pos[1] > _stage.height()) pos[1] = _stage.height();

    const result = [
      ...renderPoints.slice(0, index),
      pos,
      ...renderPoints.slice(index + 1),
    ];

    setRenderPoints(result);
  };

  const handlePointDragEnd = () => {
    setPoints(renderPoints);
  };

  const handleGroupDragStart = useCallback(() => {
    const arrX = renderPoints.map((p) => p[0]);
    const arrY = renderPoints.map((p) => p[1]);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  }, [renderPoints]);

  const handleGroupDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const isGroup = isGroupName(e.target.name());

    if (isGroup) {
      const result: Array<Array<number>> = [];
      const copyPoints = [...renderPoints];

      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()]),
      );
      e.target.position({ x: 0, y: 0 });

      setRenderPoints(result);
      setPoints(renderPoints);
    }
  };

  const flattenedPoints = useMemo(
    () => renderPoints.reduce((a, b) => a.concat(b), []),
    [renderPoints],
  );

  const fill = useMemo(() => {
    return alpha(annotation.properties.color, 0.5);
  }, [annotation]);

  return (
    <Group
      name={getPolygonName(annotation)}
      draggable
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
      dragBoundFunc={groupDragBound}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
    >
      <Group>
        <Line
          points={flattenedPoints}
          strokeWidth={3}
          stroke={annotation.properties.color}
          fill={fill}
          closed
        />

        {renderPoints.map((point, index) => {
          const x = point[0] - vertexRadius / 2;
          const y = point[1] - vertexRadius / 2;
          return (
            <Circle
              name={`polygon-${annotation.id}-point-${index}`}
              key={index}
              x={x}
              y={y}
              radius={vertexRadius}
              fill='white'
              stroke='black'
              strokeWidth={2}
              draggable
              onDragEnd={handlePointDragEnd}
              onDragMove={handlePointDragMove}
              dragBoundFunc={pointBoundFunc}
            />
          );
        })}
      </Group>
      <Group>
        <Label x={center[0]} y={center[1]} opacity={0.75}>
          <Tag fill={annotation.properties.color} offsetX={50} />
          <Text
            fill={'black'}
            text={annotation.properties.name}
            width={100}
            offsetX={50}
            padding={4}
            align={'center'}
          />
        </Label>
      </Group>
    </Group>
  );
};
