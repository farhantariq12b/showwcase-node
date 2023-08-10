import { Request } from "express";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface DecodedUser {
  _id: string;
  email: string;
}
export interface SignUpRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface UserRequest extends Request {
  user?: User
}
