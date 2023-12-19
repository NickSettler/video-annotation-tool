import { JSX, useMemo } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { AnnotationList } from '../../annotation/annotation-list/AnnotationList';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  addFrameAnnotationAction,
  clearSelectionAction,
  groupSelectionAction,
  selectAnnotationsSelection,
  selectIsAnnotationSelectionGroupable,
  selectIsAnnotationSelectionInterpolatable,
  selectSelectionAnnotations,
  TAnnotationSelection,
  toggleSelectionItemAction,
} from '../../../store/annotation';
import { forEach } from 'lodash';
import { interpolatePolygons } from '../../../utils/polygons/interpolation';

const drawerWidth = '40%';

export const AppDrawer = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const annotationSelection = useAppSelector(selectAnnotationsSelection);
  const annotationsSelection = useAppSelector(selectSelectionAnnotations);
  const isGroupable = useAppSelector(selectIsAnnotationSelectionGroupable);
  const isInterpolatable = useAppSelector(
    selectIsAnnotationSelectionInterpolatable,
  );

  const someButtonVisible = useMemo(
    () => isGroupable || isInterpolatable,
    [isGroupable, isInterpolatable],
  );

  const handleSelectionChange = (selection: TAnnotationSelection) => {
    dispatch(toggleSelectionItemAction(selection));
  };

  const handleGroup = () => {
    dispatch(groupSelectionAction());
  };

  const handleInterpolate = () => {
    if (annotationSelection.length !== 2) return;

    const [polygon1, polygon2] = annotationsSelection;

    if (!polygon1 || !polygon2) return;

    const firstFrame = Math.min(
      polygon1.properties.frame,
      polygon2.properties.frame,
    );

    const framesDiff = Math.abs(
      polygon1.properties.frame - polygon2.properties.frame,
    );

    const interpolation = interpolatePolygons(
      polygon1.geometry.coordinates,
      polygon2.geometry.coordinates,
      framesDiff,
    );

    forEach(interpolation, (polygon, index) => {
      const polygonFrame = firstFrame + index + 1;

      dispatch(
        addFrameAnnotationAction({
          frame: polygonFrame,
          annotation: {
            id: polygon1.id,
            type: 'Feature',
            geometry: {
              type: 'MultiPoint',
              coordinates: polygon,
            },
            properties: {
              name: polygon1.properties.name,
              frame: polygonFrame,
              type: polygon1.properties.type,
              color: polygon1.properties.color,
            },
          },
        }),
      );
    });

    dispatch(clearSelectionAction());
  };

  return (
    <Drawer
      variant='permanent'
      anchor={'right'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          spacing={2}
          sx={{ px: 2, mb: 2 }}
        >
          <Typography variant={'h6'}>Annotations</Typography>
          {someButtonVisible && (
            <ButtonGroup variant={'outlined'} size={'small'}>
              {isGroupable && <Button onClick={handleGroup}>Group</Button>}
              {isInterpolatable && (
                <Button onClick={handleInterpolate}>Interpolate</Button>
              )}
            </ButtonGroup>
          )}
        </Stack>
        <AnnotationList
          selection={annotationSelection}
          onSelectionChange={handleSelectionChange}
        />
      </Box>
    </Drawer>
  );
};
