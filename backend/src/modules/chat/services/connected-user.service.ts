import { IConnectedUser } from './../interfaces/iconnected-user';
import { IUser } from './../interfaces/iuser';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedUserEntity } from '../entities/connected-user.entity';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: IConnectedUser): Promise<ConnectedUserEntity> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: IUser): Promise<ConnectedUserEntity[]> {
    return this.connectedUserRepository.find({ user });
  }

  async findUser(user: IUser): Promise<ConnectedUserEntity> {
    return this.connectedUserRepository.findOne({ user });
  }
  async all(): Promise<ConnectedUserEntity[]> {
    return this.connectedUserRepository.find({ relations: ['user'] });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
}
