import { getConfig } from './lib/config';
import { checkIsRepositoryExists, cloneRepository } from './lib/git-utils';
import { startScheduler } from './lib/scheduler';

(async () => {
  try {
    const config = getConfig();

    const exists = await checkIsRepositoryExists(config.REPO_PATH);
    if (!exists) {
      await cloneRepository(config.REPO_URL, config.BRANCH, config.REPO_PATH);
    }

    const schedulerTask = startScheduler(config);

    process.on('SIGINT', () => {
      console.log('\n\n👋 Scheduler stopped (SIGINT)');
      schedulerTask.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n\n👋 Scheduler stopped (SIGTERM)');
      schedulerTask.stop();
      process.exit(0);
    });

    process.on('beforeExit', (code) => {
      console.log(`⚠️  Process is about to exit with code: ${code}`);
    });

    process.on('exit', (code) => {
      console.log(`🛑 Process exited with code: ${code}`);
    });
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
})();
