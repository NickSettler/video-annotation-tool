import { JSX, useEffect, useMemo, useState } from 'react';
import { Box, styled } from '@mui/material';
import { Layer, Stage } from 'react-konva';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  videoCurrentFrameSelector,
  videoViewportHeightSelector,
  videoViewportWidthSelector,
} from '../../../store/video';
import { AnnotationOverlay } from '../annotation-overlay/AnnotationOverlay';
import Konva from 'konva';
import {
  addFrameAnnotationAction,
  selectAnnotationsById,
  selectFrameAnnotations,
} from '../../../store/annotation';
import { ExistingAnnotationOverlay } from '../annotation-overlay/ExistingAnnotationOverlay';
import { isEmpty } from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { NEW_POLYGON_NAME } from '../../../utils/annotation/name';
import { getPolygonColor } from '../../../utils/annotation/palette';

export const CanvasBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const Canvas = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const videoViewportWidth = useAppSelector(videoViewportWidthSelector);
  const videoViewportHeight = useAppSelector(videoViewportHeightSelector);
  const uniqAnnotations = useAppSelector(selectAnnotationsById);
  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const currentFrameAnnotations = useAppSelector((state) =>
    selectFrameAnnotations(state, currentFrame),
  );

  const [points, setPoints] = useState<Array<Array<number>>>([]);
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);
  const [isPolyComplete, setIsPolyComplete] = useState(false);

  const flattenedPoints = useMemo(
    () =>
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points],
  );

  useEffect(() => {
    if (!isPolyComplete) return;

    if (isEmpty(points)) return;

    const uuid = uuidV4();
    const color = getPolygonColor(uniqAnnotations.length);

    dispatch(
      addFrameAnnotationAction({
        frame: currentFrame,
        annotation: {
          type: 'Feature',
          properties: {
            name: uuid,
            frame: currentFrame,
            color: color,
          },
          id: uuid,
          geometry: {
            type: 'MultiPoint',
            coordinates: points,
          },
        },
      }),
    );

    setPosition([0, 0]);
    setIsPolyComplete(false);
    setPoints([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolyComplete]);

  const getMousePos = (stage: Konva.Stage) => {
    return [
      stage.getPointerPosition()?.x ?? 0,
      stage.getPointerPosition()?.y ?? 0,
    ];
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPolyComplete) return;

    const stage = e.target.getStage();

    if (!stage) return;

    const isOverPolygon = e.target.getType() === 'Shape';
    const isOverSelf = e.target.parent?.name() === NEW_POLYGON_NAME;

    if (isOverPolygon && !isOverSelf) return;

    const mousePos = getMousePos(stage);

    if (isMouseOverPoint && points.length >= 3) {
      setIsPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (!stage) return;

    const mousePos = getMousePos(stage);

    setPosition(mousePos);
  };

  const handleMouseOverStartPoint = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPolyComplete || points.length < 3) return;

    e.target.scale({ x: 3, y: 3 });
    setIsMouseOverPoint(true);
  };

  const handleMouseOutStartPoint = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.target.scale({ x: 1, y: 1 });
    setIsMouseOverPoint(false);
  };

  return (
    <CanvasBox>
      <Stage
        width={videoViewportWidth ?? 480}
        height={videoViewportHeight ?? 480}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      >
        <Layer>
          <AnnotationOverlay
            points={points}
            flattenedPoints={flattenedPoints}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
          />
          {currentFrameAnnotations?.map((annotation) => (
            <ExistingAnnotationOverlay
              annotation={annotation}
              key={`${currentFrame}-${annotation.id}`}
            />
          ))}
        </Layer>
      </Stage>
    </CanvasBox>
  );
};
