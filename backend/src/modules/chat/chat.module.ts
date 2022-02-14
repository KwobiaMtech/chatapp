import { HttpModule, HttpService } from '@nestjs/axios';
import { UserService } from './../auth/services/user.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ConnectedUserService } from './services/connected-user.service';
import { ChatGateway } from './socket/chat-gateway.socket';
import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { MessageEntity } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConnectedUserEntity, MessageEntity]),
    HttpModule,
  ],
  providers: [ChatGateway, ConnectedUserService, AuthService, UserService],
  exports: [ChatGateway],
  controllers: [],
})
export class ChatModule {}
