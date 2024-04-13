import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import { toast } from 'react-hot-toast';
import {
  ProjectsService,
  TProjectCreateMutationVariables,
} from '../../api/projects/project.service';
import { TProject } from '../../api/projects/types';

export type TUseProjectMutationsParams = {
  refetch(): Promise<unknown>;
};

export type TUseProjectMutations = {
  createMutation: UseMutationResult<
    TProject,
    TApiError,
    TProjectCreateMutationVariables
  >;
  deleteMutation: UseMutationResult<void, TApiError, string>;
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
      await refetch();

      toast.success('Successfully created project');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create project');
    },
  });

  const deleteMutation = useMutation<void, TApiError, string>({
    mutationFn: async (projectID: string) =>
      ProjectsService.deleteProject(projectID),
    onSuccess: async () => {
      await refetch();

      toast.success('Successfully deleted project');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete project');
    },
  });

  return {
    createMutation,
    deleteMutation,
  };
};
