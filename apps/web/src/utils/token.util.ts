import jwt from 'jsonwebtoken';
import router from 'next/router';

import { RoutePath } from 'routes';

const TOKEN_KEY = 'token';

function setToken(message: string) {
  localStorage.setItem(TOKEN_KEY, message);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);

  return token || '';
}

const getInfo = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const decodedToken = jwt.decode(token);

  if (decodedToken?.exp) {
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > expirationTime) {
      console.log('Token has expired');

      removeToken();

      return router.push(RoutePath.SignIn);
    }
  }

  return decodedToken;
};

export default {
  setToken,
  removeToken,
  getToken,
  getInfo,
};
