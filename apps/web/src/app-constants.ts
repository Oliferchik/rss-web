export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(?:[a-zA-Z0-9-]+)*$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?~#^()_+|\-=\\{}[\]:”;’<>,.\\/`®©£¥¢¦§«»€±]).{8,64}$/g;
export const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s.\\/0-9]*$/g;

const GATE_WAY_ID = '3l7j73rtq5';
export const API_URL = `https://${GATE_WAY_ID}.execute-api.eu-north-1.amazonaws.com/dev`;
