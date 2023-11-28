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
  groupSelectionAction,
  selectAnnotationsSelection,
  selectIsAnnotationSelectionGroupable,
  selectIsAnnotationSelectionInterpolatable,
  TAnnotationSelection,
  toggleSelectionItemAction,
} from '../../../store/annotation';

const drawerWidth = '40%';

export const AppDrawer = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const annotationSelection = useAppSelector(selectAnnotationsSelection);
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
    // const polygon1 = find(flattenDepth(allAnnotations, 1), {
    //   id: rowSelection[0],
    // });
    //
    // const polygon2 = find(flattenDepth(allAnnotations, 1), {
    //   id: rowSelection[1],
    // });
    //
    // if (!polygon1 || !polygon2) return;
    //
    // const interpolation = interpolatePolygons(
    //   polygon1.geometry.coordinates,
    //   polygon2.geometry.coordinates,
    //   5,
    // );
    //
    // console.log(interpolation);
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
