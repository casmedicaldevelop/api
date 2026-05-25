/**
 * Thrown when a third-party service (e.g. SISPRO) is unreachable, times out,
 * or otherwise fails to respond. Distinct from our own backend bugs — the
 * UpstreamFailureFilter formats it as a clear [UPSTREAM:<name>] log entry at
 * WARN level so it does not get mixed with errors from this codebase.
 */
export class UpstreamFailureException extends Error {
  constructor(
    public readonly upstream: string,
    public readonly reason: string,
    public readonly route: string,
    public readonly code: string | null = null,
  ) {
    super(`[UPSTREAM:${upstream}] ${route} → ${reason}${code ? ` (${code})` : ''}`)
    this.name = 'UpstreamFailureException'
  }
}
