import { useMutation } from 'react-query';
import router from 'next/router';

import { apiService } from 'services';

import { RoutePath } from 'routes';

const KEY_NAME = 'token';

export function useSignIn<T>() {
  const signIn = (data: T) => apiService.post('', data);

  return useMutation(signIn, {
    onSuccess: ({ message }) => {
      localStorage.setItem(KEY_NAME, message);

      router.push(RoutePath.Home);
    },
  });
}

export function signOut() {
  localStorage.removeItem(KEY_NAME);

  router.push(RoutePath.SignIn);
}

export function getToken() {
  const token = localStorage.getItem(KEY_NAME);

  return token || '';
}
