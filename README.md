# GitHub Repository Monitor

A Node.js application that monitors a GitHub repository for updates every 15 minutes, automatically pulls changes to the main branch, and restarts Docker services using `docker compose up -d`.

## Features

- 🔔 **Automated Monitoring**: Checks for repository updates every 15 minutes
- 📥 **Auto Clone**: Automatically clones the repository on first run
- 🔄 **Auto Pull**: Pulls the latest changes from the remote branch
- 🐳 **Docker Integration**: Automatically runs `docker compose up -d` after pulling updates
- 🌙 **Background Daemon**: Runs as a PM2 daemon process
- 📝 **Logging**: All operations are logged with timestamps
- ⚙️ **Configurable**: Easy configuration via `.env` file

## Prerequisites

- Node.js >= 22.19.0
- npm or yarn
- Git
- Docker & Docker Compose (if using docker functionality)

## Installation

```bash
git clone <repository-url>
cd github-repo-monitor
npm install
npm run build
```

## Environment Configuration

Create a `.env` file in the root directory with your configuration:

```env
# GitHub repository URL (required)
REPO_URL=https://github.com/your-user/your-repo.git

# Branch to monitor and pull (default: main)
BRANCH=main

# Local directory path for the cloned repository (required)
REPO_PATH=./temp/your-repo
```

### Example Configuration

```env
REPO_URL=https://github.com/yevudo/yevudo.dev.git
BRANCH=main
REPO_PATH=./temp/yevudo.dev
```

## Usage

### Start as Background Daemon

```bash
npm run start:daemon
```

This command will:
1. Compile TypeScript to JavaScript (`npm run build`)
2. Start the process with PM2 in the background

The process will continue running even if you close the terminal.

### View Process Status

```bash
npm run status
```

Output example:
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ github-repo-monit… │ fork     │ 2    │ online    │ 0%       │ 247.4mb  │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### View Logs

View logs in real-time:
```bash
npm run logs
```

This will stream all output and error logs from the running process.

### Manage the Process

**Stop the process:**
```bash
npm run stop
```

**Restart the process:**
```bash
npm run restart
```

**Remove from PM2 completely:**
```bash
npm run cleanup
```

### Development Mode

Run directly with ts-node without compilation:
```bash
npm run dev
```

Note: This runs the TypeScript code directly without compilation. Use for development and testing only.

## Project Structure

```
github-repo-monitor/
├── src/
│   ├── index.ts                      # Application entry point
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces and types
│   └── lib/
│       ├── config.ts                 # Environment configuration loader
│       ├── git-utils.ts              # Git command execution utilities
│       ├── git.ts                    # Git operations (fetch, pull, check updates)
│       ├── docker.ts                 # Docker compose operations
│       └── scheduler.ts              # Cron job scheduler
├── logs/
│   ├── out.log                       # Application output logs
│   └── error.log                     # Error logs
├── .env                              # Environment variables (git ignored)
├── ecosystem.config.js               # PM2 configuration
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

## How It Works

### Workflow

1. **Initialization**
   - Loads configuration from `.env` file
   - Validates all required environment variables
   - Checks if repository already exists locally
   - Clones the repository if it doesn't exist

2. **Scheduling**
   - Sets up a cron job that runs every 15 minutes
   - Runs an initial check immediately on startup

3. **Update Check**
   - Executes `git fetch` to get latest commits from remote
   - Compares local HEAD with remote tracking branch
   - Determines if new commits are available

4. **Update & Deploy**
   - If updates are found:
     - Executes `git pull` to fetch and merge changes
     - Runs `docker compose up -d` to restart services
   - Logs all operations with timestamps

### Cron Schedule

The default schedule is every 15 minutes:
```
*/15 * * * *
```

To modify the schedule, edit the cron expression in `src/lib/scheduler.ts`

## Logs

All application logs are stored in the `logs/` directory:

- **`logs/out.log`**: Normal output and info messages
- **`logs/error.log`**: Error messages and stack traces

Example log output:
```
2026-01-21 01:42:09 +02:00: 🚀 Scheduler started
2026-01-21 01:42:09 +02:00: 📦 Repository: https://github.com/yevudo/yevudo.dev.git
2026-01-21 01:42:09 +02:00: 📁 Directory: /your-directory/temp/yevudo.dev
2026-01-21 01:42:09 +02:00: 🌿 Branch: main
2026-01-21 01:42:09 +02:00: ⏱️  Checking every 15 minutes
2026-01-21 01:42:09 +02:00: 📅 Check [1/21/2026, 1:42:09 AM]
2026-01-21 01:42:10 +02:00: ℹ️  Repository is up to date. No updates found.
```

## Building for Production

The project uses compiled JavaScript for production. TypeScript is automatically compiled when you run:

```bash
npm run start:daemon
```

To manually compile TypeScript to JavaScript:

```bash
npm run build
```

This generates compiled output in the `dist/` directory. The PM2 daemon runs the compiled JavaScript files from `dist/index.js`, which provides better stability and performance compared to running TypeScript directly with ts-node.

## Troubleshooting

### Process keeps crashing or restarting?

Check the error logs:
```bash
npm run logs
```

Common issues:
- Missing or incorrect `.env` variables
- Permission issues with repository directory
- Git or Docker not installed/configured
- Network connectivity issues
- Code not compiled: Make sure to run `npm run build` or use `npm run start:daemon` which compiles automatically

### How to verify the process is running?

```bash
npm run status
```

Should show status as `online`.

### How to see what the process is doing?

```bash
npm run logs
```

### Can I change the check interval?

Yes! Edit the cron expression in `src/lib/scheduler.ts`:

```typescript
cron.schedule('*/15 * * * *', async () => {  // Change 15 to desired minutes
  await checkAndPull(config);
});
```

## Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REPO_URL` | Yes | - | Full URL to GitHub repository |
| `BRANCH` | No | `main` | Git branch to monitor and pull |
| `REPO_PATH` | Yes | - | Local directory path for repository |

## License

MIT
