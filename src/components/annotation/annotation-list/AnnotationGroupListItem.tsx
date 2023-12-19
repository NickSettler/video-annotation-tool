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
import {
  selectAnnotationsGroupedById,
  selectAnnotationsSelection,
  TAnnotation,
} from '../../../store/annotation';
import { setVideoCurrentFrameAction } from '../../../store/video';
import { useModal } from '../../../hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { AnnotationListItem } from './AnnotationListItem';
import { isGroupInterpolatable } from '../../../utils/annotation/interpolation';
import { filter, map, reduce, some } from 'lodash';
import { E_ANNOTATION_DISPLAY_TYPE } from '../../../utils/annotation/types';

export type TAnnotationGroupListItem =
  | {
      annotation: TAnnotation;
      type: E_ANNOTATION_DISPLAY_TYPE.POINT;
      frame: number;
    }
  | {
      annotation: TAnnotation;
      type: E_ANNOTATION_DISPLAY_TYPE.RANGE;
      startFrame: number;
      endFrame: number;
    };

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

  const annotationSelection = useAppSelector(selectAnnotationsSelection);
  const annotations = useAppSelector(selectAnnotationsGroupedById(id));

  const [isExpanded, setIsExpanded] = useState(false);

  const formattedAnnotations = useMemo(
    () =>
      reduce(
        annotations,
        (acc, annotation, index) => {
          if (index === 0) {
            acc.push({
              annotation,
              frame: annotation.properties.frame,
              type: E_ANNOTATION_DISPLAY_TYPE.POINT,
            });
            return acc;
          }

          const prevAnnotation = annotations[index - 1];

          if (
            prevAnnotation.properties.frame + 1 !==
            annotation.properties.frame
          ) {
            acc.push({
              annotation,
              frame: annotation.properties.frame,
              type: E_ANNOTATION_DISPLAY_TYPE.POINT,
            });
          } else {
            acc[acc.length - 1] = {
              annotation,
              startFrame:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                acc[acc.length - 1].startFrame ?? acc[acc.length - 1].frame,
              endFrame: annotation.properties.frame,
              type: E_ANNOTATION_DISPLAY_TYPE.RANGE,
            };
          }

          return acc;
        },
        [] as Array<TAnnotationGroupListItem>,
      ),
    [annotations],
  );

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
          {formattedAnnotations.map((annotation, index) =>
            annotation.type === E_ANNOTATION_DISPLAY_TYPE.POINT ? (
              <AnnotationListItem
                key={`group-${id}-${index}-${E_ANNOTATION_DISPLAY_TYPE.POINT}`}
                annotation={annotation.annotation}
                type={annotation.type}
                isSelected={some(annotationSelection, {
                  id: annotation.annotation.id,
                  frame: annotation.annotation.properties.frame,
                })}
              />
            ) : (
              <AnnotationListItem
                key={`group-${id}-${index}-${E_ANNOTATION_DISPLAY_TYPE.RANGE}`}
                annotation={annotation.annotation}
                type={annotation.type}
                startFrame={annotation.startFrame}
                endFrame={annotation.endFrame}
                isSelected={some(
                  annotationSelection,
                  (selection) =>
                    selection.id === annotation.annotation.id &&
                    selection.frame >= annotation.startFrame &&
                    selection.frame <= annotation.endFrame,
                )}
                selectedFrames={map(
                  filter(
                    annotationSelection,
                    (selection) =>
                      selection.id === annotation.annotation.id &&
                      selection.frame >= annotation.startFrame &&
                      selection.frame <= annotation.endFrame,
                  ),
                  'frame',
                )}
              />
            ),
          )}
        </List>
      )}
    </>
  );
};
