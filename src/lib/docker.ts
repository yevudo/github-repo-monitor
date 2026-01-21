import { Config } from '../types/index';
import { execInRepo } from './git-utils';

export const startDockerCompose = async (config: Config): Promise<void> => {
  try {
    console.log('🐳 Starting docker compose...');
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execPromise = promisify(exec);
    
    const { stdout, stderr } = await execPromise('docker compose up -d --build', { 
      cwd: config.REPO_PATH 
    });
    
    console.log('✅ Docker compose completed');
    if (stdout) {
      console.log('Output:', stdout.trim());
    }
    if (stderr) {
      console.log('Build info:', stderr.trim());
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Docker compose error:', errorMessage);
    throw error;
  }
}
