import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

export interface GroupedPermission {
  resource: string;
  permissions: {
    id: string;
    name: string;
    description: string | null;
  }[];
}

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async getGroupedPermissions(): Promise<GroupedPermission[]> {
    const permissions = await this.getAllPermissions();

    // Group permissions by resource (e.g., "recipes:read" -> "recipes")
    const grouped = new Map<string, GroupedPermission>();

    for (const permission of permissions) {
      const [resource] = permission.name.split(':');

      if (!grouped.has(resource)) {
        grouped.set(resource, {
          resource,
          permissions: [],
        });
      }

      grouped.get(resource)!.permissions.push({
        id: permission.id,
        name: permission.name,
        description: permission.description,
      });
    }

    // Convert map to array and sort by resource name
    return Array.from(grouped.values()).sort((a, b) =>
      a.resource.localeCompare(b.resource),
    );
  }
}
