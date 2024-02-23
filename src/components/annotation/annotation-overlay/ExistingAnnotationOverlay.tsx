import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import {
  selectIsAnnotationSelected,
  TAnnotation,
  toggleSelectionItemAction,
  updateFramePolygonAction,
} from '../../../store/annotation';
import { Circle, Group, Label, Line, Rect, Tag, Text } from 'react-konva';
import { getPolygonName, isGroupName } from '../../../utils/annotation/name';
import Konva from 'konva';
import { minMax } from '../../../utils/annotation/min-max';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  videoCurrentFrameSelector,
  videoZoomSelector,
} from '../../../store/video';
import { alpha } from '@mui/material';
import { compare } from '../../../utils/object/compare';
import { getPolygonCentroid } from '../../../utils/polygons/centroid';
import { useVideoRatio } from '../../../hooks/video/useVideoRatio';

export type TExistingAnnotationOverlayProps = {
  annotation: TAnnotation;
};

export const ExistingAnnotationOverlay = ({
  annotation,
}: TExistingAnnotationOverlayProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const isAnnotationsSelected = useAppSelector(
    selectIsAnnotationSelected(annotation.id, annotation.properties.frame),
  );

  const videoZoom = useAppSelector(videoZoomSelector);

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
  const [selectionRect, setSelectionRect] = useState<Array<number>>([
    0, 0, 0, 0,
  ]);

  const { widthRatio, heightRatio, maxRatio } = useVideoRatio();

  const center = useMemo(() => {
    const [centerX, centerY] = getPolygonCentroid(renderPoints);

    return [centerX, centerY];
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

  useEffect(() => {
    const arrX = renderPoints.map((p) => p[0]);
    const arrY = renderPoints.map((p) => p[1]);

    const _minMaxX = minMax(arrX);
    const _minMaxY = minMax(arrY);

    setSelectionRect([_minMaxX[0], _minMaxY[0], _minMaxX[1], _minMaxY[1]]);
  }, [renderPoints]);

  const handleGroupMouseDown = () => {
    dispatch(
      toggleSelectionItemAction({
        id: annotation.id,
        frame: annotation.properties.frame,
      }),
    );
  };

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

    if (x + vertexRadius > stageWidth) x = stageWidth;
    if (x - vertexRadius < 0) x = 0;
    if (y + vertexRadius > stageHeight) y = stageHeight;
    if (y - vertexRadius < 0) y = 0;

    return { x, y };
  };

  const handlePointDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const _stage = e.target.getStage();

    if (!_stage) return;

    const index = e.target.index - 1;
    const pos = [
      ((e.target._lastPos?.x ?? 0) * widthRatio) / videoZoom,
      ((e.target._lastPos?.y ?? 0) * heightRatio) / videoZoom,
    ];

    /** 0 <= pos[w] <= stage.width() * widthRatio */
    pos[0] = Math.min(
      Math.max(pos[0], 0),
      (_stage.width() * widthRatio) / videoZoom,
    );
    /** 0 <= pos[h] <= stage.height() * heightRatio */
    pos[1] = Math.min(
      Math.max(pos[1], 0),
      (_stage.height() * heightRatio) / videoZoom,
    );

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
    const arrX = renderPoints.map((p) => (p[0] / widthRatio) * videoZoom);
    const arrY = renderPoints.map((p) => (p[1] / heightRatio) * videoZoom);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  }, [heightRatio, renderPoints, widthRatio, videoZoom]);

  const handleGroupDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const result: Array<Array<number>> = [];
    const copyPoints = [...renderPoints];

    copyPoints.map((point) =>
      result.push([point[0] + e.target.x(), point[1] + e.target.y()]),
    );

    const arrX = result.map((p) => p[0]);
    const arrY = result.map((p) => p[1]);

    setSelectionRect([
      minMax(arrX)[0],
      minMax(arrY)[0],
      minMax(arrX)[1],
      minMax(arrY)[1],
    ]);
  };

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
      setPoints(result);
    }
  };

  const flattenedPoints = useMemo(
    () =>
      renderPoints
        .reduce((a, b) => a.concat(b), [])
        .map((point, index) => (index % 2 === 0 ? point : point)),
    [renderPoints],
  );

  const fill = useMemo(() => {
    return alpha(annotation.properties.color, 0.5);
  }, [annotation]);

  return (
    <Group>
      <Group
        name={getPolygonName(annotation)}
        draggable
        onClick={handleGroupMouseDown}
        onMouseOver={handleGroupMouseOver}
        onMouseOut={handleGroupMouseOut}
        dragBoundFunc={groupDragBound}
        onDragStart={handleGroupDragStart}
        onDragMove={handleGroupDragMove}
        onDragEnd={handleGroupDragEnd}
      >
        <Group>
          <Line
            points={flattenedPoints}
            strokeWidth={(3 * maxRatio) / videoZoom}
            stroke={annotation.properties.color}
            fill={fill}
            closed
          />

          {renderPoints.map((point, index) => {
            const x = point[0] - (vertexRadius * maxRatio) / videoZoom / 2;
            const y = point[1] - (vertexRadius * maxRatio) / videoZoom / 2;
            return (
              <Circle
                name={`polygon-${annotation.id}-point-${index}`}
                key={index}
                x={x}
                y={y}
                radius={(vertexRadius * maxRatio) / videoZoom}
                fill='white'
                stroke='black'
                strokeWidth={(2 * maxRatio) / videoZoom}
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
            <Tag
              fill={annotation.properties.color}
              offsetX={(50 * maxRatio) / videoZoom}
            />
            <Text
              fill={'black'}
              text={annotation.properties.name}
              width={(100 * maxRatio) / videoZoom}
              offsetX={(50 * maxRatio) / videoZoom}
              padding={(4 * maxRatio) / videoZoom}
              fontSize={(12 * maxRatio) / videoZoom}
              align={'center'}
            />
          </Label>
        </Group>
      </Group>
      {isAnnotationsSelected && (
        <Group>
          <Rect
            x={selectionRect[0]}
            y={selectionRect[1]}
            width={selectionRect[2] - selectionRect[0]}
            height={selectionRect[3] - selectionRect[1]}
            stroke={'blue'}
            strokeWidth={maxRatio / videoZoom}
            fillEnabled={false}
          />
        </Group>
      )}
    </Group>
  );
};
