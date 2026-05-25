import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly User: "User";
    readonly Module: "Module";
    readonly UserModule: "UserModule";
    readonly PasswordResetOtp: "PasswordResetOtp";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly identificationNumber: "identificationNumber";
    readonly username: "username";
    readonly password: "password";
    readonly role: "role";
    readonly isActive: "isActive";
    readonly mustChangePassword: "mustChangePassword";
    readonly refreshToken: "refreshToken";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ModuleScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly label: "label";
    readonly icon: "icon";
    readonly description: "description";
    readonly displayOrder: "displayOrder";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum];
export declare const UserModuleScalarFieldEnum: {
    readonly userId: "userId";
    readonly moduleId: "moduleId";
    readonly createdAt: "createdAt";
};
export type UserModuleScalarFieldEnum = (typeof UserModuleScalarFieldEnum)[keyof typeof UserModuleScalarFieldEnum];
export declare const PasswordResetOtpScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly otpHash: "otpHash";
    readonly expiresAt: "expiresAt";
    readonly attempts: "attempts";
    readonly used: "used";
    readonly createdAt: "createdAt";
};
export type PasswordResetOtpScalarFieldEnum = (typeof PasswordResetOtpScalarFieldEnum)[keyof typeof PasswordResetOtpScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
