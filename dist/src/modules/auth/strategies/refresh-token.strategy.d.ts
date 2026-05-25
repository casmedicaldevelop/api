import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
declare const RefreshTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    constructor(configService: ConfigService);
    validate(req: Request, payload: {
        sub: string;
        name: string;
        email: string;
        role: string;
        mustChangePassword: boolean;
    }): {
        rawRefreshToken: string;
        sub: string;
        name: string;
        email: string;
        role: string;
        mustChangePassword: boolean;
    };
}
export {};
