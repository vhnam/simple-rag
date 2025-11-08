import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Guard that validates the token but doesn't require user to exist in database
 * Useful for APIs that need to validate Auth0 tokens but don't need full user lookup
 */
@Injectable()
export class JwtOptionalGuard extends AuthGuard('jwt-optional') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
