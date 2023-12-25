export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(?:[a-zA-Z0-9-]+)*$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?~#^()_+|\-=\\{}[\]:”;’<>,.\\/`®©£¥¢¦§«»€±]).{8,64}$/g;
export const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s.\\/0-9]*$/g;

export const LAMBDA_URL = {
  AUTHENTICATE: 'https://7zuuzlwzpb5d7zwvi53ibsydri0dognj.lambda-url.eu-north-1.on.aws/',
  CHANNELS: 'https://nxzvbsnn7hstnvrz7pow4lzx7m0gqcch.lambda-url.eu-north-1.on.aws/',
};
