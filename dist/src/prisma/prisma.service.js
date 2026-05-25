"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger('PrismaService');
    monitorInterval = null;
    async onModuleInit() {
        await this.$connect();
        this.logger.log(`Connected — pool limit: ${process.env.DATABASE_URL?.match(/connection_limit=(\d+)/)?.[1] ?? 'default'}`);
        if (process.env.NODE_ENV !== 'production') {
            this.monitorInterval = setInterval(() => this.logConnections(), 30_000);
        }
    }
    async onModuleDestroy() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        this.logger.warn('Disconnecting — releasing all pool connections');
        await this.$disconnect();
        this.logger.log('Disconnected ✓');
    }
    async logConnections() {
        try {
            const result = await this.$queryRaw `
        SELECT
          count(*)::int                                          AS total,
          count(*) FILTER (WHERE state = 'active')::int         AS active,
          count(*) FILTER (WHERE state = 'idle')::int           AS idle
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;
            const { total, active, idle } = result[0];
            this.logger.debug(`DB connections → total: ${total}  active: ${active}  idle: ${idle}`);
        }
        catch {
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map