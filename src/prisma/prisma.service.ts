import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');
  private monitorInterval: NodeJS.Timeout | null = null;

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

  private async logConnections() {
    try {
      const result = await this.$queryRaw<[{ total: bigint; active: bigint; idle: bigint }]>`
        SELECT
          count(*)::int                                          AS total,
          count(*) FILTER (WHERE state = 'active')::int         AS active,
          count(*) FILTER (WHERE state = 'idle')::int           AS idle
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;
      const { total, active, idle } = result[0];
      this.logger.debug(
        `DB connections → total: ${total}  active: ${active}  idle: ${idle}`,
      );
    } catch {
      // pg_stat_activity may not be accessible on some Railway plans
    }
  }
}
