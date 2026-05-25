import { SetMetadata } from '@nestjs/common';

export const ALLOW_MCP_KEY = 'allowMustChangePassword';
export const AllowMustChangePassword = () => SetMetadata(ALLOW_MCP_KEY, true);
