import { useSelector } from 'react-redux';
import { selectAllAnnotationsPure } from '../../store/annotation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useProjectMutations } from '../projects/useProjectMutations';
import { E_PROJECT_ENTITY_KEYS } from '../../api/projects/types';
import { setSaveInProgress, studioProjectSelector } from '../../store/studio';

export const useAnnotationCloudSave = () => {
  const dispatch = useAppDispatch();

  const { updateAnnotationsMutation } = useProjectMutations({});

  const allAnnotations = useSelector(selectAllAnnotationsPure);
  const currentProject = useAppSelector(studioProjectSelector);

  useEffect(() => {
    if (!currentProject) return;

    dispatch(setSaveInProgress(true));

    updateAnnotationsMutation.mutate(
      {
        [E_PROJECT_ENTITY_KEYS.ID]: currentProject[E_PROJECT_ENTITY_KEYS.ID],
        [E_PROJECT_ENTITY_KEYS.ANNOTATIONS]: allAnnotations,
      },
      {
        onSettled() {
          dispatch(setSaveInProgress(false));
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAnnotations]);
};
