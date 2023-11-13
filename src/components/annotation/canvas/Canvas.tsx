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
  selectFrameAnnotations,
  setFrameAnnotationAction,
} from '../../../store/annotation';

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
  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const currentFrameAnnotations = useAppSelector((state) =>
    selectFrameAnnotations(state, currentFrame),
  );

  const [points, setPoints] = useState<Array<Array<number>>>([]);
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);
  const [isPolyComplete, setIsPolyComplete] = useState(false);

  useEffect(() => {
    if (currentFrameAnnotations) {
      // console.log(currentFrameAnnotations[0].geometry.coordinates);
      setPosition(currentFrameAnnotations[0].geometry.coordinates[0]);
      setPoints(currentFrameAnnotations[0].geometry.coordinates);
      setIsPolyComplete(true);
    } else {
      setPosition([0, 0]);
      setIsPolyComplete(false);
      setPoints([]);
    }
  }, [currentFrameAnnotations]);

  const flattenedPoints = useMemo(
    () =>
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points],
  );

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

  const handlePointDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();

    if (!stage) return;

    const index = e.target.index - 1;
    const pos = [e.target._lastPos?.x ?? 0, e.target._lastPos?.y ?? 0];

    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();

    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  const handleGroupDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target.name() === 'polygon') {
      const result: Array<Array<number>> = [];
      const copyPoints = [...points];

      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()]),
      );
      e.target.position({ x: 0, y: 0 });

      setPoints(result);

      dispatch(
        setFrameAnnotationAction({
          frame: currentFrame,
          annotation: {
            type: 'Feature',
            properties: currentFrameAnnotations?.[0].properties ?? {
              name: 'new',
              color: '#000000',
            },
            id: currentFrameAnnotations?.[0].id ?? 'new',
            geometry: {
              type: currentFrameAnnotations?.[0].geometry.type ?? 'MultiPoint',
              coordinates: result,
            },
          },
        }),
      );
    }
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
            handlePointDragMove={handlePointDragMove}
            handleGroupDragEnd={handleGroupDragEnd}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
            isFinished={isPolyComplete}
          />
        </Layer>
      </Stage>
    </CanvasBox>
  );
};
