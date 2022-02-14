import { ItemsController } from './main/controllers/items.controller';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, ChatModule],
  providers: [],
  exports: [],
  controllers: [ItemsController],
})
export class MainModule {}
