"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class RefreshAuthGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
}
exports.RefreshAuthGuard = RefreshAuthGuard;
//# sourceMappingURL=refresh-auth.guard.js.map