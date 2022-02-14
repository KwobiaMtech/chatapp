import { Injectable } from '@nestjs/common';
import { createSecureServer } from 'http2';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private em: EntityManager) {}

  async createUser(data: any): Promise<UserEntity> {
    const user = new UserEntity();
    user.first_name = data.given_name;
    user.last_name = data.family_name;
    user.username = data.nickname;
    user.email = data.email;
    user.picture = data.picture;
    return (await this.em.save(user)) as UserEntity;
  }

  async getTokenUser(email: string): Promise<any> {
    const user = await this.em.findOne(UserEntity, {
      where: { email: email },
      relations: ['authUser'],
    });
    console.log('user', user);
    return user;
  }
}
