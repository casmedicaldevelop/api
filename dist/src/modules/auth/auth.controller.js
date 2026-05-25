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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const allow_must_change_password_decorator_1 = require("./decorators/allow-must-change-password.decorator");
const public_decorator_1 = require("./decorators/public.decorator");
const change_password_dto_1 = require("./dto/change-password.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        const result = await this.authService.login(req.user);
        res.cookie('cas_refresh_token', result.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { accessToken: result.accessToken, user: result.user };
    }
    async refresh(req, res) {
        const token = req.cookies['cas_refresh_token'];
        if (!token)
            throw new common_1.UnauthorizedException('no refresh token');
        const result = await this.authService.refresh(token);
        res.cookie('cas_refresh_token', result.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { accessToken: result.accessToken };
    }
    logout(res) {
        res.clearCookie('cas_refresh_token', { httpOnly: true, sameSite: 'lax' });
        return this.authService.logout();
    }
    me(req) {
        return this.authService.me(req.user.sub);
    }
    forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    verifyOtp(dto) {
        return this.authService.verifyOtp(dto.email, dto.otp);
    }
    resetPassword(dto) {
        return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
    }
    changePassword(req, dto) {
        return this.authService.changePassword(req.user.sub, dto.currentPassword, dto.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, allow_must_change_password_decorator_1.AllowMustChangePassword)(),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, allow_must_change_password_decorator_1.AllowMustChangePassword)(),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, allow_must_change_password_decorator_1.AllowMustChangePassword)(),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map