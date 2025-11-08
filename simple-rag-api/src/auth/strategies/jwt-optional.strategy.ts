import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface ValidatedJwtUser {
  auth0Id: string;
  email?: string;
  name?: string;
}

/**
 * JWT Strategy that validates Auth0 tokens without requiring database lookup
 * Use this for APIs that need to verify JWT authenticity but don't need user data from DB
 */
@Injectable()
export class JwtOptionalStrategy extends PassportStrategy(
  Strategy,
  'jwt-optional',
) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('AUTH0_ISSUER_URL')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: `${configService.get<string>('AUTH0_ISSUER_URL')}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload): ValidatedJwtUser {
    // Return user info directly from JWT payload without database lookup
    return {
      auth0Id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
