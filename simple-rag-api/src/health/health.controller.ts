import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
@SkipThrottle() // Skip rate limiting for health checks
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database connectivity check
      () => this.db.pingCheck('database'),

      // Memory heap check (alert if heap exceeds 300MB)
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),

      // Memory RSS check (alert if RSS exceeds 500MB)
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),

      // Disk storage check (alert if more than 90% used)
      // Using percentage-based threshold only for flexibility across different storage sizes
      () =>
        this.disk.checkStorage('disk_storage', {
          path: '/',
          thresholdPercent: 0.9, // Alert if more than 90% used (less than 10% free)
        }),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  liveness() {
    // Simple liveness check - just returns if app is running
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    // Readiness check - includes database connectivity
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
