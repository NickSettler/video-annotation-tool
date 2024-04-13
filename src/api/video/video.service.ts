import { BaseService } from '../base/service';
import { E_VIDEO_ENTITY_KEYS, TVideo } from './types';
import Api from '../base/api';
import { AxiosProgressEvent } from 'axios';

export type TVideoCreateData = {
  [E_VIDEO_ENTITY_KEYS.NAME]: TVideo[E_VIDEO_ENTITY_KEYS.NAME];
  video: File;
};

export type TVideoCreateOptions = {
  onUploadProgress?(event: AxiosProgressEvent): void;
};

export type TVideoCreateMutationVariables = {
  data: TVideoCreateData;
};

export class VideoService extends BaseService {
  protected static readonly endpoint = '/videos';

  public static async getVideos(): Promise<Array<TVideo>> {
    return Api.instance.get<Array<TVideo>>(this.endpoint);
  }

  public static async getVideoPoster(video: TVideo): Promise<string> {
    const image = await Api.instance.get<Blob>(
      `${Api.apiUrl}${this.endpoint}/${video[E_VIDEO_ENTITY_KEYS.ID]}/posters/${video[E_VIDEO_ENTITY_KEYS.POSTER_ID]}`,
      {
        responseType: 'blob',
      },
    );

    return URL.createObjectURL(image);
  }

  public static async createVideo(
    data: TVideoCreateData,
    options?: TVideoCreateOptions,
  ): Promise<TVideo> {
    const formData = new FormData();
    formData.append(E_VIDEO_ENTITY_KEYS.NAME, data[E_VIDEO_ENTITY_KEYS.NAME]);
    formData.append('video', data.video);

    return Api.instance.post<FormData, TVideo>(this.endpoint, formData, {
      onUploadProgress: options?.onUploadProgress,
    });
  }

  public static async deleteVideo(id: string): Promise<void> {
    return Api.instance.delete<void>(`${this.endpoint}/${id}`);
  }
}
