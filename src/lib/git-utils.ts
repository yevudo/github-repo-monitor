import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execPromise = promisify(exec);

/**
 * Copy file from source to destination
 */
export const copyEnvFile = async (sourcePath: string, destinationDir: string): Promise<void> => {
  try {
    const fileName = path.basename(sourcePath);
    const destPath = path.join(destinationDir, fileName);
    
    console.log(`📄 Copying ${sourcePath} to ${destPath}...`);
    await fs.copyFile(sourcePath, destPath);
    console.log('✅ File copied successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error copying file:', errorMessage);
    throw error;
  }
}

export const execInDir = async (command: string, cwd: string): Promise<string> => {
  const { stdout } = await execPromise(command, { cwd });
  return stdout;
}

export const execInRepo = async (command: string, repoDirPath: string): Promise<string> => {
  return execInDir(command, repoDirPath);
}

export const checkIsRepositoryExists = async (repoPath: string): Promise<boolean> => {
  try {
    await fs.access(path.join(repoPath, '.git'));
    return true;
  } catch {
    return false;
  }
}

export const cloneRepository = async (repoUrl: string, branch: string, repoPath: string): Promise<void> => {
  try {
    console.log(`📥 Cloning repository to ${repoPath}...`);
    await execPromise(`git clone --branch ${branch} ${repoUrl} "${repoPath}"`);
    console.log('✅ Repository cloned successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error cloning:', errorMessage);
    throw error;
  }
}
