import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import {
  ROLE_DEFINITIONS,
  PERMISSION_DEFINITIONS,
  ROLE_PERMISSIONS,
} from '../rbac/rbac.constants';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      // Wait for migrations to complete before seeding
      await this.waitForTablesReady();
      await this.seedDatabase();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Failed to seed database', error);
      // Don't throw - allow app to start even if seeding fails
    }
  }

  /**
   * Wait for the roles table to be ready (migrations to complete)
   */
  private async waitForTablesReady(
    maxRetries = 20,
    delay = 500,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      for (let i = 0; i < maxRetries; i++) {
        try {
          // Try to query the roles table
          await queryRunner.query('SELECT COUNT(*) FROM roles;');
          this.logger.log('Tables are ready for seeding');
          return;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          if (i === maxRetries - 1) {
            throw new Error('Timeout waiting for tables to be created');
          }
          this.logger.debug(
            `Waiting for tables... (attempt ${i + 1}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    } finally {
      await queryRunner.release();
    }
  }

  private async seedDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await this.seedRbacData(queryRunner);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seeds default RBAC data (roles and permissions)
   */
  private async seedRbacData(queryRunner: QueryRunner): Promise<void> {
    try {
      // Create roles from constants
      for (const role of ROLE_DEFINITIONS) {
        const roleExists = (await queryRunner.query(
          `SELECT COUNT(*) as count FROM roles WHERE name = $1;`,
          [role.name],
        )) as Array<{ count: string }>;

        if (parseInt(roleExists[0].count, 10) === 0) {
          await queryRunner.query(
            `INSERT INTO roles (name, description) VALUES ($1, $2);`,
            [role.name, role.description],
          );
          this.logger.log(`Created ${role.name} role`);
        }
      }

      // Create permissions from constants
      for (const permission of PERMISSION_DEFINITIONS) {
        const permissionExists = (await queryRunner.query(
          `SELECT COUNT(*) as count FROM permissions WHERE name = $1;`,
          [permission.name],
        )) as Array<{ count: string }>;

        if (parseInt(permissionExists[0].count, 10) === 0) {
          await queryRunner.query(
            `INSERT INTO permissions (name, description) VALUES ($1, $2);`,
            [permission.name, permission.description],
          );
        }
      }

      // Assign permissions to roles based on ROLE_PERMISSIONS mapping
      for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
        const role = (await queryRunner.query(
          `SELECT id FROM roles WHERE name = $1;`,
          [roleName],
        )) as Array<{ id: string }>;

        if (role.length === 0) continue;

        for (const permissionName of permissions) {
          const permission = (await queryRunner.query(
            `SELECT id FROM permissions WHERE name = $1;`,
            [permissionName],
          )) as Array<{ id: string }>;

          if (permission.length === 0) continue;

          const rolePermissionExists = (await queryRunner.query(
            `SELECT COUNT(*) as count FROM role_permissions
            WHERE role_id = $1 AND permission_id = $2;`,
            [role[0].id, permission[0].id],
          )) as Array<{ count: string }>;

          if (parseInt(rolePermissionExists[0].count, 10) === 0) {
            await queryRunner.query(
              `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2);`,
              [role[0].id, permission[0].id],
            );
          }
        }
        this.logger.log(
          `Assigned ${permissions.length} permission(s) to ${roleName} role`,
        );
      }
    } catch (error) {
      this.logger.error('Error seeding RBAC data', error);
      // Don't throw - allow app to continue
    }
  }
}
