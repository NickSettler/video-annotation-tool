import { JSX, useMemo, useState, MouseEvent } from 'react';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';
import { Circle, FilterNone, Redo } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectAnnotationsGroupedById } from '../../../store/annotation';
import { map, reduce, some } from 'lodash';
import { setVideoCurrentFrameAction } from '../../../store/video';

export type TAnnotationGroupListItemProps = {
  id: string;
};

export const AnnotationGroupListItem = ({
  id,
}: TAnnotationGroupListItemProps): JSX.Element => {
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

  return (
    <>
      <ListItem role='button' onClick={handleToggleExpanded}>
        <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
          <FilterNone sx={{ color: annotations[0].properties.color }} />
        </ListItemIcon>
        <ListItemText primary={id} />
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
          </Stack>
        </ListItemSecondaryAction>
      </ListItem>
      {isExpanded && (
        <List dense disablePadding>
          {annotations.map((annotation, index) => (
            <ListItemButton
              key={`group-${id}-${index}`}
              onClick={handleJumpToFrame(annotation.properties.frame)}
            >
              <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
                <Circle sx={{ color: annotation.properties.color }} />
              </ListItemIcon>
              <ListItemText
                primary={annotation.properties.name ?? <i>No Name</i>}
                secondary={`Frame: ${annotation.properties.frame}`}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </>
  );
};
