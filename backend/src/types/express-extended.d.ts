import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { VerifyPaymentRequest } from './index';

declare namespace Express {
  export interface Request {
    body: any;
    params: any;
  }

  export interface Response {
    status(code: number): Response;
    json(data: any): Response;
  }
} 