"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustChangePasswordGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const allow_must_change_password_decorator_1 = require("../decorators/allow-must-change-password.decorator");
let MustChangePasswordGuard = class MustChangePasswordGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        const isAllowed = this.reflector.getAllAndOverride(allow_must_change_password_decorator_1.ALLOW_MCP_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isAllowed)
            return true;
        if (user.mustChangePassword === true) {
            throw new common_1.ForbiddenException({ code: 'MUST_CHANGE_PASSWORD' });
        }
        return true;
    }
};
exports.MustChangePasswordGuard = MustChangePasswordGuard;
exports.MustChangePasswordGuard = MustChangePasswordGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], MustChangePasswordGuard);
//# sourceMappingURL=must-change-password.guard.js.map