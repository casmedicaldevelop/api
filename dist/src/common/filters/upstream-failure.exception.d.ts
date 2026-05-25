export declare class UpstreamFailureException extends Error {
    readonly upstream: string;
    readonly reason: string;
    readonly route: string;
    readonly code: string | null;
    constructor(upstream: string, reason: string, route: string, code?: string | null);
}
