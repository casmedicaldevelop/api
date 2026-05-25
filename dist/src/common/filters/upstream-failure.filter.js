"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpstreamFailureFilter = void 0;
const common_1 = require("@nestjs/common");
const upstream_failure_exception_1 = require("./upstream-failure.exception");
let UpstreamFailureFilter = class UpstreamFailureFilter {
    logger = new common_1.Logger('Upstream');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const codeTag = exception.code ? ` (${exception.code})` : '';
        this.logger.warn(`[${exception.upstream}] ${req.method} ${req.url} → ${exception.reason}${codeTag}`);
        res.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).json({
            statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Upstream Service Unavailable',
            upstream: exception.upstream,
            message: `${exception.upstream} no está disponible. Reintentá en unos minutos.`,
            reason: exception.reason,
            code: exception.code,
        });
    }
};
exports.UpstreamFailureFilter = UpstreamFailureFilter;
exports.UpstreamFailureFilter = UpstreamFailureFilter = __decorate([
    (0, common_1.Catch)(upstream_failure_exception_1.UpstreamFailureException)
], UpstreamFailureFilter);
//# sourceMappingURL=upstream-failure.filter.js.map