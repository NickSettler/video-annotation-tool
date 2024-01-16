import { JSX } from 'react';
import { TAnnotationType } from '../../../store/annotation';
import { Circle } from '@mui/icons-material';

export type TAnnotationTypeListItemProps = {
  annotation: TAnnotationType;
};

export const AnnotationTypeListItem = ({
  annotation,
}: TAnnotationTypeListItemProps): JSX.Element => {
  return (
    <>
      <Circle
        sx={{
          color:
            annotation.color === '$NEW$' ? 'transparent' : annotation.color,
          mr: 1,
        }}
      />
      {annotation.type}
    </>
  );
};
