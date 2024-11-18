import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing-interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashingService implements HashingService {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
