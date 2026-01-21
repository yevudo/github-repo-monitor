import * as dotenv from 'dotenv';
import { Config } from '../types/index';

dotenv.config();

export const getConfig = (): Config => {
  const config: Config = {
    REPO_URL: process.env.REPO_URL || '',
    BRANCH: process.env.BRANCH || '',
    REPO_PATH: process.env.REPO_PATH || '',
    CUSTOM_ENV_PATH: process.env.CUSTOM_ENV_PATH || '',
  };

  const requiredFields = {
    REPO_URL: config.REPO_URL,
    BRANCH: config.BRANCH,
    REPO_PATH: config.REPO_PATH,
    CUSTOM_ENV_PATH: config.CUSTOM_ENV_PATH,
  };

  if (Object.values(requiredFields).some((value) => value === '')) {
    console.log(config);
    throw new Error('Not all required environment variables are set');
  }

  return config;
}
