import { JSX, useMemo, useState } from 'react';
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
  selectAllAnnotations,
  updateFramePolygonAction,
} from '../../../store/annotation';
import { find, flattenDepth, some, uniq, uniqBy } from 'lodash';
import toast from 'react-hot-toast';
import { interpolatePolygons } from '../../../utils/polygons/interpolation';

const drawerWidth = '40%';

export const AppDrawer = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const allAnnotations = useAppSelector(selectAllAnnotations);

  const [rowSelection, setRowSelection] = useState<Array<string>>([]);

  const groupButtonVisible = useMemo(() => {
    const atLeastTwo = rowSelection.length > 1;
    const differentIDs = uniq(rowSelection).length > 1;

    return atLeastTwo && differentIDs;
  }, [rowSelection]);

  const interpolateButtonVisible = useMemo(
    () => rowSelection.length === 2,
    [rowSelection],
  );

  const someButtonVisible = useMemo(
    () => groupButtonVisible || interpolateButtonVisible,
    [groupButtonVisible, interpolateButtonVisible],
  );

  const handleRowSelectionChange = (id: string) => {
    setRowSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const handleGroup = () => {
    const frames: Array<[number, string]> = rowSelection.map((id) => [
      allAnnotations.findIndex((frameAnnotations) =>
        some(frameAnnotations, { id }),
      ),
      id,
    ]);

    const hasDuplicates =
      uniqBy(frames, (frame) => frame[0]).length !== frames.length;

    if (hasDuplicates) {
      toast.error('Cannot group annotations from the same frame!');
      return;
    }

    const firstAnnotation = find(flattenDepth(allAnnotations, 1), {
      id: rowSelection[0],
    });

    if (!firstAnnotation) return;

    setRowSelection([]);

    frames.forEach(([frame, id]) => {
      dispatch(
        updateFramePolygonAction({
          frame,
          polygonID: id,
          payload: {
            id: firstAnnotation.id,
            properties: {
              ...firstAnnotation.properties,
              frame,
            },
          },
        }),
      );
    });
  };

  const handleInterpolate = () => {
    const polygon1 = find(flattenDepth(allAnnotations, 1), {
      id: rowSelection[0],
    });

    const polygon2 = find(flattenDepth(allAnnotations, 1), {
      id: rowSelection[1],
    });

    if (!polygon1 || !polygon2) return;

    const interpolation = interpolatePolygons(
      polygon1.geometry.coordinates,
      polygon2.geometry.coordinates,
      5,
    );

    console.log(interpolation);
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
              {groupButtonVisible && (
                <Button onClick={handleGroup}>Group</Button>
              )}
              {interpolateButtonVisible && (
                <Button onClick={handleInterpolate}>Interpolate</Button>
              )}
            </ButtonGroup>
          )}
        </Stack>
        <AnnotationList
          rowSelection={rowSelection}
          onRowSelectionChange={handleRowSelectionChange}
        />
      </Box>
    </Drawer>
  );
};
