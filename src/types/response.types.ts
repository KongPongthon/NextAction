export interface IResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T[] | T;
}

export interface IResponseError {
  success: boolean;
  code: number;
  message: string;
}
