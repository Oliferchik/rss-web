export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(?:[a-zA-Z0-9-]+)*$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?~#^()_+|\-=\\{}[\]:”;’<>,.\\/`®©£¥¢¦§«»€±]).{8,64}$/g;
export const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s.\\/0-9]*$/g;

export const LAMBDA_URL = {
  AUTHENTICATE: 'https://s0vdhrv26f.execute-api.eu-north-1.amazonaws.com/dev/users/auth',
  RSS: 'https://s0vdhrv26f.execute-api.eu-north-1.amazonaws.com/dev/rss',
  RSS_SYNC: 'https://s0vdhrv26f.execute-api.eu-north-1.amazonaws.com/dev/rss-sync',
};
