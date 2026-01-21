import * as cron from 'node-cron';
import * as path from 'path';
import { Config } from '../types/index';
import { checkForUpdates, pullBranch } from './git';
import { startDockerCompose } from './docker';

const checkAndPull = async (config: Config): Promise<void> => {
  const timestamp = new Date().toLocaleString('en-US');
  console.log(`\n📅 Check [${timestamp}]`);

  try {
    const result = await checkForUpdates(config);

    if (result.error) {
      console.error('❌', result.error);
      return;
    }

    console.log(`ℹ️  ${result.output}`);

    if (result.hasUpdates) {
      console.log('🔄 Pulling updates...');
      await pullBranch(config);
      await startDockerCompose(config);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

export const startScheduler = (config: Config): cron.ScheduledTask => {
  console.log('🚀 Scheduler started');
  console.log(`📦 Repository: ${config.REPO_URL}`);
  console.log(`📁 Directory: ${path.resolve(config.REPO_PATH)}`);
  console.log(`🌿 Branch: ${config.BRANCH}`);
  console.log('⏱️  Checking every 15 minutes');

  checkAndPull(config);

  const task = cron.schedule('*/15 * * * *', () => {
    checkAndPull(config);
  });

  return task;
}
