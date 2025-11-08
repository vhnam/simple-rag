import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

/**
 * Service that automatically discovers and syncs permissions from controller decorators to the database
 * This eliminates the need to manually maintain permission definitions in constants
 */
@Injectable()
export class PermissionSyncService implements OnModuleInit {
  private readonly logger = new Logger(PermissionSyncService.name);

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async onModuleInit() {
    try {
      await this.syncPermissionsFromControllers();
      this.logger.log('Permission sync completed successfully');
    } catch (error) {
      this.logger.error('Failed to sync permissions', error);
      // Don't throw - allow app to start even if sync fails
    }
  }

  /**
   * Scans all controllers for @Permissions() decorators and syncs to database
   */
  async syncPermissionsFromControllers(): Promise<void> {
    const controllers = this.discovery.getControllers();

    const permissions = new Set<string>();

    // Scan all controllers for permission metadata
    for (const { instance } of controllers) {
      if (!instance) continue;
      const prototype = Object.getPrototypeOf(instance) as object;

      const methodNames = this.metadataScanner.getAllMethodNames(prototype);
      for (const methodName of methodNames) {
        const meta: unknown = Reflect.getMetadata(
          'permissions',
          prototype,
          methodName,
        );
        if (Array.isArray(meta)) {
          meta.forEach((perm: string) => permissions.add(perm));
        }
      }
    }

    this.logger.log(
      `Discovered ${permissions.size} unique permissions from controllers`,
    );

    // Get existing permissions from database
    const existing = await this.permissionRepo.find();
    const existingNames = new Set(existing.map((p) => p.name));

    // Find new permissions that don't exist in DB yet
    const newPerms = Array.from(permissions).filter(
      (p) => !existingNames.has(p),
    );

    // Insert new permissions
    if (newPerms.length > 0) {
      await this.permissionRepo.save(
        newPerms.map((name) => ({
          name,
          description: this.generateDescriptionFromPermission(name),
        })),
      );
      this.logger.log(`Synced ${newPerms.length} new permissions to database`);
      this.logger.debug(`New permissions: ${newPerms.join(', ')}`);
    } else {
      this.logger.log('Permissions already up-to-date');
    }
  }

  /**
   * Generates a human-readable description from a permission name
   * Example: "recipes:read" -> "Can read recipes"
   */
  private generateDescriptionFromPermission(permission: string): string {
    const parts = permission.split(':');
    if (parts.length === 2) {
      const [resource, action] = parts;
      return `Can ${action} ${resource}`;
    }
    return `Permission: ${permission}`;
  }
}
