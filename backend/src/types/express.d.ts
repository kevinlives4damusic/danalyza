declare module 'express' {
  export interface Request {
    body: any;
    params: any;
  }

  export interface Response {
    status(code: number): Response;
    json(data: any): Response;
  }
}

declare module 'cors';
declare module 'helmet';
declare module 'dotenv'; 