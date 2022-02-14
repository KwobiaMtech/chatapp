import { RequestContext } from '@medibloc/nestjs-request-context';

export function getAppContextALS<T>(): T {
  return RequestContext.get<T>();
}
