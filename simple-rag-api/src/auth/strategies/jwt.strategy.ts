import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
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

  async validate(payload: any) {
    // Look up the user in the database by auth0Id
    const user = await this.userRepository.findOne({
      where: { auth0Id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    // Return the user object with the database UUID as id
    return {
      id: user.id, // Database UUID
      auth0Id: payload.sub, // Auth0 ID
      email: user.email,
      name: user.name,
      ...payload,
    };
  }
}
