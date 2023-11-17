import { JSX, useMemo, useState } from 'react';
import { TAnnotation } from '../../../store/annotation';
import { Circle, Group, Line } from 'react-konva';
import { getPolygonName } from '../../../utils/annotation/name';

export type TExistingAnnotationOverlayProps = {
  annotation: TAnnotation;
};

export const ExistingAnnotationOverlay = ({
  annotation,
}: TExistingAnnotationOverlayProps): JSX.Element => {
  const vertexRadius = 6;

  const [points, setPoints] = useState<Array<Array<number>>>(
    annotation.geometry.coordinates,
  );

  const flattenedPoints = useMemo(
    () => points.reduce((a, b) => a.concat(b), []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [points],
  );

  return (
    <Group
      name={getPolygonName(annotation)}
      draggable
      // onMouseOver={handleGroupMouseOver}
      // onMouseOut={handleGroupMouseOut}
      // dragBoundFunc={groupDragBound}
      // onDragStart={handleGroupDragStart}
      // onDragEnd={handleGroupDragEnd}
    >
      <Line
        closed
        points={flattenedPoints}
        stroke='red'
        strokeWidth={3}
        fill='rgb(0,128,0,0.5)'
      />

      {points.map((point, index) => {
        const x = point[0] - vertexRadius / 2;
        const y = point[1] - vertexRadius / 2;
        const startPointAttr =
          index === 0
            ? {
                hitStrokeWidth: 12,
                // onMouseOver: handleMouseOverStartPoint,
                // onMouseOut: handleMouseOutStartPoint,
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
            // onDragMove={handlePointDragMove}
            // dragBoundFunc={dragBoundFunc}
            {...startPointAttr}
          />
        );
      })}
    </Group>
  );
};
