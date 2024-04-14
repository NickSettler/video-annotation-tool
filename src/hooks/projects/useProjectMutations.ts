import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import { toast } from 'react-hot-toast';
import {
  ProjectsService,
  TProjectCreateMutationVariables,
  TProjectUpdateAnnotationsMutationVariables,
} from '../../api/projects/project.service';
import { E_PROJECT_ENTITY_KEYS, TProject } from '../../api/projects/types';

export type TUseProjectMutationsParams = {
  refetch?(): Promise<unknown>;
};

export type TUseProjectMutations = {
  createMutation: UseMutationResult<
    TProject,
    TApiError,
    TProjectCreateMutationVariables
  >;
  deleteMutation: UseMutationResult<void, TApiError, string>;
  updateAnnotationsMutation: UseMutationResult<
    TProject,
    TApiError,
    TProjectUpdateAnnotationsMutationVariables
  >;
};

export const useProjectMutations = ({
  refetch,
}: TUseProjectMutationsParams): TUseProjectMutations => {
  const createMutation = useMutation<
    TProject,
    TApiError,
    TProjectCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TProjectCreateMutationVariables) =>
      ProjectsService.createProject(createData),
    onSuccess: async () => {
      if (refetch) await refetch();

      toast.success('Successfully created project');
    },
    onError: async () => {
      if (refetch) await refetch();

      toast.error('Failed to create project');
    },
  });

  const deleteMutation = useMutation<void, TApiError, string>({
    mutationFn: async (projectID: string) =>
      ProjectsService.deleteProject(projectID),
    onSuccess: async () => {
      if (refetch) await refetch();

      toast.success('Successfully deleted project');
    },
    onError: async () => {
      if (refetch) await refetch();

      toast.error('Failed to delete project');
    },
  });

  const updateAnnotationsMutation = useMutation<
    TProject,
    TApiError,
    TProjectUpdateAnnotationsMutationVariables
  >({
    mutationFn: async ({
      [E_PROJECT_ENTITY_KEYS.ID]: id,
      [E_PROJECT_ENTITY_KEYS.ANNOTATIONS]: annotations,
    }: TProjectUpdateAnnotationsMutationVariables) =>
      ProjectsService.updateProjectAnnotations(id, annotations),
    onSuccess: async () => {
      if (refetch) await refetch();
    },
    onError: async () => {
      if (refetch) await refetch();
    },
  });

  return {
    createMutation,
    deleteMutation,
    updateAnnotationsMutation,
  };
};
