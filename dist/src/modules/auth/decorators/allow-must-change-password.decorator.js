"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowMustChangePassword = exports.ALLOW_MCP_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ALLOW_MCP_KEY = 'allowMustChangePassword';
const AllowMustChangePassword = () => (0, common_1.SetMetadata)(exports.ALLOW_MCP_KEY, true);
exports.AllowMustChangePassword = AllowMustChangePassword;
//# sourceMappingURL=allow-must-change-password.decorator.js.map