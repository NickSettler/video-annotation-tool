import { JSX, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { Layer, Stage } from 'react-konva';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  addVideoTranslateXAction,
  addVideoTranslateYAction,
  addVideoZoomAction,
  setVideoCurrentFrameAction,
  videoCurrentFrameSelector,
  videoTranslateXSelector,
  videoTranslateYSelector,
  videoViewportHeightSelector,
  videoViewportWidthSelector,
  videoZoomSelector,
} from '../../../store/video';
import { AnnotationOverlay } from '../annotation-overlay/AnnotationOverlay';
import Konva from 'konva';
import {
  addFrameAnnotationAction,
  clearSelectionAction,
  selectAnnotationsById,
  selectCurrentFrameHasSelection,
  selectFrameAnnotations,
  selectSelectionAnnotations,
} from '../../../store/annotation';
import { ExistingAnnotationOverlay } from '../annotation-overlay/ExistingAnnotationOverlay';
import { isEmpty, some } from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { NEW_POLYGON_NAME } from '../../../utils/annotation/name';
import { getPolygonColor } from '../../../utils/annotation/palette';
import { getCopyKey } from '../../../utils/misc/keyboard';
import {
  copyAnnotation,
  pasteAnnotation,
} from '../../../utils/annotation/clipboard';
import toast from 'react-hot-toast';
import { useVideoRatio } from '../../../hooks/video/useVideoRatio';

export const CanvasBox = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const Canvas = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const videoViewportWidth = useAppSelector(videoViewportWidthSelector);
  const videoViewportHeight = useAppSelector(videoViewportHeightSelector);

  const videoZoom = useAppSelector(videoZoomSelector);
  const videoTranslateX = useAppSelector(videoTranslateXSelector);
  const videoTranslateY = useAppSelector(videoTranslateYSelector);

  const uniqAnnotations = useAppSelector(selectAnnotationsById);
  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const currentFrameAnnotations = useAppSelector((state) =>
    selectFrameAnnotations(state, currentFrame),
  );
  const selectionAnnotations = useAppSelector(selectSelectionAnnotations);
  const currentFrameHasSelections = useAppSelector(
    selectCurrentFrameHasSelection,
  );

  const boxRef = useRef<HTMLDivElement | null>(null);

  const [points, setPoints] = useState<Array<Array<number>>>([]);
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setIsMouseOverPoint] = useState(false);
  const [isPolyComplete, setIsPolyComplete] = useState(false);

  const { widthRatio, heightRatio } = useVideoRatio();

  const stageSize = useMemo(
    () => [
      (videoViewportWidth ?? 480) * videoZoom,
      (videoViewportHeight ?? 480) * videoZoom,
    ],
    [videoViewportWidth, videoViewportHeight, videoZoom],
  );

  const stageScale = useMemo(
    () => [(1 / widthRatio) * videoZoom, (1 / heightRatio) * videoZoom],
    [widthRatio, heightRatio, videoZoom],
  );

  const flattenedPoints = useMemo(
    () =>
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
        .map((point, index) => (index % 2 === 0 ? point : point)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDocumentKey = async (event: KeyboardEvent) => {
    const { code } = event;

    if (code === 'Escape') {
      setPosition([0, 0]);
      setIsPolyComplete(false);
      setPoints([]);
    }

    if (code === 'ArrowLeft') {
      dispatch(setVideoCurrentFrameAction(currentFrame - 1));
    }

    if (code === 'ArrowRight') {
      dispatch(setVideoCurrentFrameAction(currentFrame + 1));
    }

    if (event[getCopyKey()] && code === 'KeyC') {
      await copyAnnotation(selectionAnnotations);
      dispatch(clearSelectionAction());
    }

    if (event[getCopyKey()] && code === 'KeyV') {
      const annotation = await pasteAnnotation().catch((e) => {
        toast.error(e);

        return null;
      });

      if (!annotation) return;

      const currentFrameHasAnnotation = some(currentFrameAnnotations, [
        'id',
        annotation.id,
      ]);

      if (currentFrameHasAnnotation) return;

      dispatch(
        addFrameAnnotationAction({
          frame: currentFrame,
          annotation: {
            ...annotation,
            properties: {
              ...annotation.properties,
              frame: currentFrame,
            },
          },
        }),
      );
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleDocumentKey);

    return () => document.removeEventListener('keydown', handleDocumentKey);
  }, [handleDocumentKey]);

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
            type: null,
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
      (stage.getPointerPosition()?.x ?? 0) * widthRatio,
      (stage.getPointerPosition()?.y ?? 0) * heightRatio,
    ];
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (!stage) return;

    const isOverPolygon = e.target.getType() === 'Shape';
    const isOverSelf = e.target.parent?.name() === NEW_POLYGON_NAME;

    if (currentFrameHasSelections && !isOverPolygon) {
      dispatch(clearSelectionAction());
      return;
    }

    if (isPolyComplete) return;

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

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const { deltaX, deltaY, ctrlKey } = e;

      if (ctrlKey) {
        if (deltaY) dispatch(addVideoZoomAction(-deltaY / 100));
      } else {
        if (deltaX) dispatch(addVideoTranslateXAction(-deltaX));
        if (deltaY) dispatch(addVideoTranslateYAction(-deltaY));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!boxRef.current) return;

    const refValue = boxRef;

    refValue.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    });

    return () => {
      refValue.current?.removeEventListener('wheel', handleWheel);
      refValue.current = null;
    };
  }, [handleWheel]);

  return (
    <CanvasBox ref={boxRef}>
      <Stage
        width={stageSize[0]}
        height={stageSize[1]}
        style={{
          transform: `translate(${videoTranslateX * videoZoom}px, ${videoTranslateY * videoZoom}px)`,
        }}
        scaleX={stageScale[0]}
        scaleY={stageScale[1]}
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
          {currentFrameAnnotations?.map((annotation, index) => (
            <ExistingAnnotationOverlay
              annotation={annotation}
              key={`${currentFrame}-${annotation.id}-${index}`}
            />
          ))}
        </Layer>
      </Stage>
    </CanvasBox>
  );
};
