import { JSX, useMemo } from 'react';
import { TAnnotation } from '../../../store/annotation';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { Circle, ModeEdit } from '@mui/icons-material';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { setVideoCurrentFrameAction } from '../../../store/video';
import { useAppDispatch } from '../../../store/store';
import { E_ANNOTATION_DISPLAY_TYPE } from '../../../utils/annotation/types';

type TAnnotationListItemPropsSelectable =
  | {
      isSelectable: true;
      onSelected(id: string): void;
    }
  | {
      isSelectable?: false;
    };

type TAnnotationListItemPropsEditable =
  | {
      isEditable: true;
    }
  | {
      isEditable?: false;
    };

type TAnnotationListItemPropsRanged =
  | {
      type: E_ANNOTATION_DISPLAY_TYPE.POINT;
    }
  | {
      type: E_ANNOTATION_DISPLAY_TYPE.RANGE;
      startFrame: number;
      endFrame: number;
      selectedFrames?: Array<number>;
    };

export type TAnnotationListItemProps = TAnnotationListItemPropsEditable &
  TAnnotationListItemPropsRanged &
  TAnnotationListItemPropsSelectable & {
    annotation: TAnnotation;
    isSelected?: boolean;
  };

export const AnnotationListItem = ({
  annotation,
  ...rest
}: TAnnotationListItemProps): JSX.Element => {
  const { onOpen: openAnnotationEditModal } = useModal(
    E_MODALS.EDIT_ANNOTATION,
  );

  const dispatch = useAppDispatch();

  const primaryText = useMemo(() => annotation.properties?.name, [annotation]);

  const secondaryText = useMemo(() => {
    if (rest.type === E_ANNOTATION_DISPLAY_TYPE.POINT)
      return `Frame: ${annotation.properties.frame}`;

    const selectionText = !!rest.selectedFrames?.length
      ? `Selected: ${rest.selectedFrames?.join(', ')}`
      : null;

    return `Frames: ${rest.startFrame} - ${rest.endFrame}${
      selectionText ? `. ${selectionText}` : ''
    }`;
  }, [annotation, rest]);

  const handleClick = () => {
    if (rest.isSelectable) rest.onSelected(`${annotation.id}`);
    else dispatch(setVideoCurrentFrameAction(annotation.properties.frame));
  };

  const handleEdit = (id: string, frame: number) => () =>
    openAnnotationEditModal({
      id,
      frame,
    });

  return (
    <ListItem
      key={`${annotation.id}-${annotation.properties.frame}`}
      onClick={handleClick}
      selected={rest.isSelected}
    >
      <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
        <Circle sx={{ color: annotation.properties.color }} />
      </ListItemIcon>
      <ListItemText
        primary={primaryText ?? <i>Nso Name</i>}
        secondary={secondaryText}
      />
      {rest.isEditable && (
        <ListItemSecondaryAction>
          <IconButton
            color={'primary'}
            size={'small'}
            onClick={handleEdit(annotation.id, annotation.properties.frame)}
          >
            <ModeEdit />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};
