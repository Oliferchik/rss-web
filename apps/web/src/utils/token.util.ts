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

export default {
  setToken,
  removeToken,
  getToken,
};
