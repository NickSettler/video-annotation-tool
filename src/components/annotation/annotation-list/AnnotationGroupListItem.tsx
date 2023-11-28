import { JSX, MouseEvent, useMemo, useState } from 'react';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';
import { FilterNone, ModeEdit, Redo } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectAnnotationsGroupedById } from '../../../store/annotation';
import { setVideoCurrentFrameAction } from '../../../store/video';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { AnnotationListItem } from './AnnotationListItem';
import { isGroupInterpolatable } from '../../../utils/annotation/interpolation';

export type TAnnotationGroupListItemProps = {
  id: string;
};

export const AnnotationGroupListItem = ({
  id,
}: TAnnotationGroupListItemProps): JSX.Element => {
  const { onOpen: openAnnotationEditModal } = useModal(
    E_MODALS.EDIT_ANNOTATION,
  );

  const dispatch = useAppDispatch();

  const annotations = useAppSelector(selectAnnotationsGroupedById(id));

  const [isExpanded, setIsExpanded] = useState(false);

  const canInterpolate = useMemo(
    () => isGroupInterpolatable(annotations),
    [annotations],
  );

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInterpolate = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleJumpToFrame =
    (frame = annotations[0].properties.frame) =>
    () => {
      dispatch(setVideoCurrentFrameAction(frame));
    };

  const handleEdit = () => openAnnotationEditModal({ id });

  return (
    <>
      <ListItem role='button' onClick={handleToggleExpanded}>
        <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
          <FilterNone sx={{ color: annotations[0].properties.color }} />
        </ListItemIcon>
        <ListItemText primary={annotations[0].properties.name} />
        <ListItemSecondaryAction>
          <Stack direction={'row'} spacing={1}>
            {canInterpolate && (
              <Button
                variant={'outlined'}
                size={'small'}
                onClick={handleInterpolate}
              >
                Interpolate
              </Button>
            )}
            <IconButton
              color={'primary'}
              size={'small'}
              onClick={handleJumpToFrame()}
            >
              <Redo />
            </IconButton>
            <IconButton color={'primary'} size={'small'} onClick={handleEdit}>
              <ModeEdit />
            </IconButton>
          </Stack>
        </ListItemSecondaryAction>
      </ListItem>
      {isExpanded && (
        <List dense disablePadding>
          {annotations.map((annotation, index) => (
            <AnnotationListItem
              key={`group-${id}-${index}`}
              annotation={annotation}
            />
          ))}
        </List>
      )}
    </>
  );
};
