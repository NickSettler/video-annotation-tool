import axios, { AxiosInstance, AxiosResponse } from 'axios';
import LocalStorage, { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import { parseJWT } from '../../utils/jwt';
import { Toast, toast } from 'react-hot-toast';
import { TApiError } from './types';
import { flatten, map, startCase, values } from 'lodash';
import Close from '@mui/icons-material/Close';
import { routesPaths } from '../../utils/router';
import { Box, IconButton, Stack, Typography } from '@mui/material';

/**
 * API class (Singleton)
 * @class Api
 */
export default class Api {
  public static readonly apiUrl = import.meta.env.VITE_APP_API_URL;

  /**
   * API instance
   * @private
   */
  private static _instance: Api;

  /**
   * Axios instance
   * @private
   */
  private _axiosInstance: AxiosInstance;

  private constructor() {
    this._axiosInstance = axios.create({
      baseURL: Api.apiUrl,
    });

    this._axiosInstance.interceptors.request.use((config) => {
      const accessToken = LocalStorage.getItem<string>(
        E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
      );

      if (!accessToken) return config;

      try {
        const jwtToken = parseJWT(accessToken);
        if (jwtToken.exp * 1000 < Date.now()) throw new Error('Token expired');
      } catch (e) {
        // TODO: Refresh token
      }

      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    });

    this._axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status >= 400 && error.response.status < 500) {
          if (error.response.status === 400) {
            const errors = map(
              flatten(map(error.response.data?.errors, values)),
              (err) =>
                `${startCase(err.split(' ')[0])} ${err
                  .split(' ')
                  .slice(1)
                  .join(' ')}`,
            );

            const errorsList =
              error.response.status === 400 &&
              error.response.data?.errors &&
              errors.map((e: string) => (
                <Typography variant={'subtitle2'} key={e}>
                  {e}
                </Typography>
              ));

            const message = (t: Toast) => (
              <Stack direction={'row'} alignItems={'center'}>
                <Stack direction={'column'}>
                  <Typography sx={{ color: 'error.main' }} variant={'h6'}>
                    {error.response.data.message}
                  </Typography>
                  <Stack gap={0.5}>{errorsList}</Stack>
                </Stack>
                <Box sx={{ ml: 'auto' }}>
                  <IconButton
                    size={'small'}
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Stack>
            );

            toast((t) => message(t), {
              duration: Math.max(errors.length * 1000, 1500),
            });
          } else {
            toast.error(
              `(${error.response.status}) ${error.response.data?.message}` ??
                'Unknown error',
            );
          }

          if (
            error.response.status === 401 &&
            window.location.pathname !==
              [routesPaths.auth.root, routesPaths.auth.login].join('/')
          ) {
            LocalStorage.clear();
            window.location.href = [
              routesPaths.auth.root,
              routesPaths.auth.login,
            ].join('/');
          }
        }

        const apiResponse = error.response.data as TApiError;

        if (apiResponse) throw apiResponse;

        throw error;
      },
    );
  }

  /**
   * Get API instance
   */
  public static get instance(): Api {
    if (!this._instance) this._instance = new Api();

    return this._instance;
  }

  /**
   * Send GET request to API
   * @param url - API endpoint
   */
  public async get<Response>(url: string): Promise<Response> {
    return await this._axiosInstance
      .get<Response>(url)
      .then((response) => response.data);
  }

  /**
   * Send POST request to API
   * @param url - API endpoint
   * @param data - Data to send
   */
  public async post<Data, Response>(
    url: string,
    data: Data,
  ): Promise<Response> {
    return await this._axiosInstance
      .post<Response, AxiosResponse<Response>, Data>(url, data)
      .then((response) => response.data);
  }

  /**
   * Send PUT request to API
   * @param url - API endpoint
   * @param data - Data to send
   */
  public async put<Data, Response>(url: string, data: Data): Promise<Response> {
    return await this._axiosInstance
      .put<Response, AxiosResponse<Response>, Data>(url, data)
      .then((response) => response.data);
  }

  /**
   * Send DELETE request to API
   * @param url - API endpoint
   */
  public async delete<Response>(url: string): Promise<Response> {
    return await this._axiosInstance
      .delete<Response>(url)
      .then((response) => response.data);
  }
}
