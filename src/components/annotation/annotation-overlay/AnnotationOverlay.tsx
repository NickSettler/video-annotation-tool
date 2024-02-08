import { JSX, useMemo } from 'react';
import { Circle, Group, Line } from 'react-konva';
import Konva from 'konva';
import { getPolygonName } from '../../../utils/annotation/name';
import { getPolygonColor } from '../../../utils/annotation/palette';
import { useAppSelector } from '../../../store/store';
import { selectAnnotationsById } from '../../../store/annotation';
import { alpha } from '@mui/material';
import {
  videoHeightRatioSelector,
  videoWidthRatioSelector,
} from '../../../store/video';

export type TAnnotationOverlayProps = {
  points: Array<Array<number>>;
  flattenedPoints: Array<number>;
  handleMouseOverStartPoint(e: Konva.KonvaEventObject<MouseEvent>): void;
  handleMouseOutStartPoint(e: Konva.KonvaEventObject<MouseEvent>): void;
};

export const AnnotationOverlay = ({
  points,
  flattenedPoints,
  handleMouseOverStartPoint,
  handleMouseOutStartPoint,
}: TAnnotationOverlayProps): JSX.Element => {
  const widthRatio = useAppSelector(videoWidthRatioSelector);
  const heightRatio = useAppSelector(videoHeightRatioSelector);
  const uniqAnnotations = useAppSelector(selectAnnotationsById);

  const vertexRadius = 4;

  const newColor = useMemo(() => {
    return getPolygonColor(uniqAnnotations.length);
  }, [uniqAnnotations]);

  const fill = useMemo(() => alpha(newColor, 0.5), [newColor]);

  return (
    <Group name={getPolygonName()}>
      <Line
        points={flattenedPoints}
        stroke={newColor}
        strokeWidth={3}
        fill={fill}
      />

      {points.map((point, index) => {
        const x = (point[0] - vertexRadius / 2) / widthRatio;
        const y = (point[1] - vertexRadius / 2) / heightRatio;
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
            {...startPointAttr}
          />
        );
      })}
    </Group>
  );
};
