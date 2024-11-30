import { SignUpDto } from '../dto/signUp.dto';
import { Request } from 'express';

export const signUpDto: SignUpDto = {
  email: 'test@test.com',
  password: 'password',
  confirmedPassword: 'password',
  name: 'name',
  nickname: 'nickname',
  phoneNumber: '01000000000',
  code: '1234',
};

export const loginDTO = {
  email: 'test@test.com',
  password: 'test',
};

export const mockRequest: Request = {
  session: { code: 'wrongCode' },
} as unknown as Request;
