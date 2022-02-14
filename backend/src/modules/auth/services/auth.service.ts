import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AuthUserEntity } from '../entities/auth.entity';
import { UserEntity } from '../entities/user.entity';
import { map } from 'rxjs';
import { getAppContextALS } from 'src/utils/context';
import { AppRequestContext } from 'src/utils/request.context';
import { AxiosResponse } from './../../../../node_modules/@nestjs/axios/node_modules/axios/index.d';

@Injectable()
export class AuthService {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  constructor(
    private em: EntityManager,
    private userService: UserService,
    private config: ConfigService,
    private http: HttpService,
  ) {
    this.AUTH0_AUDIENCE = this.config.get('AUTH0_AUDIENCE');
    this.AUTH0_DOMAIN = this.config.get('AUTH0_DOMAIN');
  }

  async createAuthUser(
    user: UserEntity,
    token: string,
    email_status: boolean,
  ): Promise<AuthUserEntity> {
    const authUser = new AuthUserEntity();
    authUser.user = user;
    authUser.email_verified = email_status;
    authUser.token = token;
    return await this.em.save(authUser);
  }

  async decodeToken(token: string): Promise<any> {
    const result = this.http
      .get(`${this.AUTH0_DOMAIN}userinfo`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .pipe(map((response: AxiosResponse) => response.data));
    return result;
  }

  

  async createIdentity(data: any, token: string): Promise<void> {
    const ctx = getAppContextALS<AppRequestContext>();
    const userExist = await this.userService.getTokenUser(data.email);
    if (userExist) {
      ctx.authUser = userExist.authUser;
    } else {
      const user = await this.userService.createUser(data);
      ctx.authUser = await this.createAuthUser(
        user,
        token,
        data.email_verified,
      );
    }
  }
}
