import { CheckResult, Config } from '../types/index';
import { execInRepo } from './git-utils';

const REMOTE_NAME = 'origin';

export const checkForUpdates = async (config: Config): Promise<CheckResult> => {
  try {
    // Fetch latest commits from remote without pull
    await execInRepo(`git fetch ${REMOTE_NAME}`, config.REPO_PATH);

    // Compare local branch with remote
    const remoteRef = `${REMOTE_NAME}/${config.BRANCH}`;
    const stdout = await execInRepo(
      `git rev-list --left-right --count HEAD...${remoteRef}`,
      config.REPO_PATH
    );

    const [local, remote] = stdout.trim().split('\t').map(Number);

    if (remote > 0) {
      return {
        hasUpdates: true,
        output: `Found ${remote} new commit(s) in remote. Local: ${local}`,
      };
    }

    return {
      hasUpdates: false,
      output: 'Repository is up to date. No updates found.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      hasUpdates: false,
      output: '',
      error: `Error checking for updates: ${errorMessage}`,
    };
  }
}

export const pullBranch = async (config: Config): Promise<void> => {
  try {
    const stdout = await execInRepo(
      `git pull ${REMOTE_NAME} ${config.BRANCH}`,
      config.REPO_PATH
    );
    console.log('✅ Branch updated successfully:');
    console.log(stdout);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Pull error:', errorMessage);
  }
}
