import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './guards/auth.guard';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';


// prettier-ignore
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
  ],
  providers: [
   JwtAuthGuard,
   UserService,
   AuthService,
  ],
  exports: [PassportModule,HttpModule, UserService, AuthService],
  controllers: [],
})
export class AuthModule {
}
