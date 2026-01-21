import { Config } from '../types/index';
import { execInRepo } from './git-utils';

export const startDockerCompose = async (config: Config): Promise<void> => {
  try {
    console.log('🐳 Starting docker compose...');
    const stdout = await execInRepo('docker compose up -d', config.REPO_PATH);
    console.log('✅ Docker compose started successfully:');
    console.log(stdout);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Docker compose error:', errorMessage);
  }
}
