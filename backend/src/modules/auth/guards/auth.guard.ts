import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { UserEntity } from './../entities/user.entity';
import { AxiosResponse } from './../../../../node_modules/@nestjs/axios/node_modules/axios/index.d';
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
import { getAppContextALS } from 'src/utils/context';
import { AppRequestContext } from 'src/utils/request.context';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  constructor(
    private config: ConfigService,
    private http: HttpService,
    private em: EntityManager,
    private userService: UserService,
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

  // async getUser(token: string): Promise<any> {
  //   const result = this.http
  //     .get(`${this.AUTH0_DOMAIN}userinfo`, {
  //       headers: {
  //         authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .pipe(map((response: AxiosResponse) => response.data));
  //   return result;
  // }

  // async createIdentity(data: any, token: string): Promise<void> {
  //   const ctx = getAppContextALS<AppRequestContext>();
  //   const userExist = await this.em.findOne(UserEntity, {
  //     where: { email: data.email },
  //     relations: ['authUser'],
  //   });
  //   if (userExist) {
  //     ctx.authUser = userExist.authUser;
  //   } else {
  //     const user = await this.userService.createUser(data);
  //     ctx.authUser = await this.authService.createAuthUser(
  //       user,
  //       token,
  //       data.email_verified,
  //     );
  //   }
  // }
}
