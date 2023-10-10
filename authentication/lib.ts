import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import * as dotenv from 'dotenv';

const config = dotenv.config().parsed as any;

/**
 * Security utils
 */

if (!config.JWT_SECRET) {
  throw new Error('process.env.JWT_SECRET is not provided')
}

if (!config.HASH_FUNC) {
  throw new Error('process.env.HASH_FUNC is not provided')
}

export const createJWT = (data) => {
  return jwt.sign(data, config.JWT_SECRET)
}

export const readJWT = (token) => {
  try {
    return Promise.resolve(jwt.verify(token, config.JWT_SECRET));
  } catch (e) {
    return Promise.reject();
  }
}

export const createUUID = () => {
  return uuid()
}

export const generateSalt = () => {
  return crypto.randomBytes(128).toString('base64');
};

export const getPasswordHash = async (password, salt, iterations) => {
  return crypto.pbkdf2Sync(password, salt, iterations, 512, config.HASH_FUNC).toString('hex');
};
