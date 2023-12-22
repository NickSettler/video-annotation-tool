import { HttpStatusCode } from 'axios';

export type TApiError = {
  message: string;
  statusCode: HttpStatusCode;
};
