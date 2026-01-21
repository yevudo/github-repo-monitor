/**
 * Result of checking for repository updates
 */
export interface CheckResult {
  readonly hasUpdates: boolean;
  readonly output: string;
  readonly error?: string;
}
