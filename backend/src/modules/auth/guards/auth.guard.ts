import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { UserEntity } from './../entities/user.entity';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { EntityManager } from 'typeorm';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    this.AUTH0_AUDIENCE = this.config.get('AUTH0_AUDIENCE');
    this.AUTH0_DOMAIN = this.config.get('AUTH0_DOMAIN');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req: Request | any = ctx.getRequest();
    const res = ctx.getResponse();
    const token = req.headers['authorization'].split(' ')[1];
    const tokenInfo = await lastValueFrom(
      await this.authService.decodeToken(token),
    );
    this.authService.createIdentity(tokenInfo, token);
    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );
    try {
      await checkJwt(req, res);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
