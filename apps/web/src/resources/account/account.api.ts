import router from 'next/router';

import { RoutePath } from 'routes';
import { tokenUtil } from 'utils';

export function signOut() {
  tokenUtil.removeToken();

  router.push(RoutePath.SignIn);
}
