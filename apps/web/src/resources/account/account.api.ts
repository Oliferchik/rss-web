import { useMutation } from 'react-query';
import router from 'next/router';

import { apiService } from 'services';
import { RoutePath } from 'routes';
import { tokenUtil } from 'utils';
import { LAMBDA_URL } from 'app-constants';

export function useSignIn<T>() {
  const signIn = (data: T) => apiService.post(LAMBDA_URL.AUTHENTICATE, data);

  return useMutation(signIn, {
    onSuccess: ({ body: { token } }: any) => {
      if (token) {
        tokenUtil.setToken(token);

        router.push(RoutePath.Home);
      }
    },
  });
}

export function signOut() {
  tokenUtil.removeToken();

  router.push(RoutePath.SignIn);
}
