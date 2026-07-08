import bcrypt from 'bcrypt';
import { config } from '../config';

export async function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, config.bcrypt.saltRounds);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
