"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const upstream_failure_filter_1 = require("./common/filters/upstream-failure.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new upstream_failure_filter_1.UpstreamFailureFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.enableShutdownHooks();
    await app.listen(parseInt(process.env.PORT || '3001', 10));
}
bootstrap();
//# sourceMappingURL=main.js.map