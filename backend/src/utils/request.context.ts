import { RequestContext } from '@medibloc/nestjs-request-context';
import { AuthUserEntity } from 'src/modules/auth/entities/auth.entity';

export class AppRequestContext extends RequestContext {
  authUser: AuthUserEntity;
  rolesMap: Partial<Record<string, boolean>>;
}
