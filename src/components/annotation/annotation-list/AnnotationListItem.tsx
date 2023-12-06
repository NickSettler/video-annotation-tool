import { JSX } from 'react';
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

type TAnnotationListItemPropsSelectable =
  | {
      isSelectable: true;
      isSelected: boolean;
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

export type TAnnotationListItemProps = {
  annotation: TAnnotation;
} & (TAnnotationListItemPropsEditable & TAnnotationListItemPropsSelectable);

export const AnnotationListItem = ({
  annotation,
  ...rest
}: TAnnotationListItemProps): JSX.Element => {
  const { onOpen: openAnnotationEditModal } = useModal(
    E_MODALS.EDIT_ANNOTATION,
  );

  const dispatch = useAppDispatch();

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
      {...(rest.isSelectable && { selected: rest.isSelected })}
    >
      <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
        <Circle sx={{ color: annotation.properties.color }} />
      </ListItemIcon>
      <ListItemText
        primary={annotation.properties?.name ?? <i>Nso Name</i>}
        secondary={`Frame: ${annotation.properties.frame}`}
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
