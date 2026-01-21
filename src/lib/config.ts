import * as dotenv from 'dotenv';
import { Config } from '../types/index';

dotenv.config();

export const getConfig = (): Config => {
  const config: Config = {
    REPO_URL: process.env.REPO_URL || '',
    BRANCH: process.env.BRANCH || '',
    REPO_PATH: process.env.REPO_PATH || '',
  };

  if (Object.values(config).some((value) => value === '')) {
    console.log(config);
    throw new Error('Not all required environment variables are set');
  }

  return config;
}
