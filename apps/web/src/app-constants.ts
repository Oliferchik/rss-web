export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(?:[a-zA-Z0-9-]+)*$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?~#^()_+|\-=\\{}[\]:”;’<>,.\\/`®©£¥¢¦§«»€±]).{8,64}$/g;
export const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s.\\/0-9]*$/g;

export const LAMBDA_URL = {
  AUTHENTICATE: 'https://r4nl7hmtwyom3syrqo2nwnu2py0kmmui.lambda-url.eu-north-1.on.aws/',
  CHANNELS: 'https://cky6ibuz5zrpmeqhxixw2uogee0jcxwo.lambda-url.eu-north-1.on.aws/',
};
