import { BaseService } from '../base/service';
import Api from '../base/api';
import { E_PROJECT_ENTITY_KEYS, TProject } from './types';

export type TProjectCreateData = {
  [E_PROJECT_ENTITY_KEYS.NAME]: TProject[E_PROJECT_ENTITY_KEYS.NAME];
  [E_PROJECT_ENTITY_KEYS.VIDEO_ID]: TProject[E_PROJECT_ENTITY_KEYS.VIDEO_ID];
};

export type TProjectCreateMutationVariables = {
  data: TProjectCreateData;
};

export class ProjectsService extends BaseService {
  protected static readonly endpoint = '/projects';

  public static async getProjects(): Promise<Array<TProject>> {
    return Api.instance.get<Array<TProject>>(this.endpoint);
  }

  public static async createProject(
    data: TProjectCreateData,
  ): Promise<TProject> {
    return await Api.instance.post<TProjectCreateData, TProject>(
      this.endpoint,
      {
        [E_PROJECT_ENTITY_KEYS.NAME]: data[E_PROJECT_ENTITY_KEYS.NAME],
        [E_PROJECT_ENTITY_KEYS.VIDEO_ID]: data[E_PROJECT_ENTITY_KEYS.VIDEO_ID],
      },
    );
  }

  public static async deleteProject(
    id: TProject[E_PROJECT_ENTITY_KEYS.ID],
  ): Promise<void> {
    return Api.instance.delete<void>(`${this.endpoint}/${id}`);
  }
}
