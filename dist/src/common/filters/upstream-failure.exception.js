"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpstreamFailureException = void 0;
class UpstreamFailureException extends Error {
    upstream;
    reason;
    route;
    code;
    constructor(upstream, reason, route, code = null) {
        super(`[UPSTREAM:${upstream}] ${route} → ${reason}${code ? ` (${code})` : ''}`);
        this.upstream = upstream;
        this.reason = reason;
        this.route = route;
        this.code = code;
        this.name = 'UpstreamFailureException';
    }
}
exports.UpstreamFailureException = UpstreamFailureException;
//# sourceMappingURL=upstream-failure.exception.js.map