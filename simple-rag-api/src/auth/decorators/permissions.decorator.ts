import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for permissions
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to mark a controller or method as requiring specific permissions
 * @param permissions - The permissions required for the controller or method
 * @returns A metadata object with the permissions
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
