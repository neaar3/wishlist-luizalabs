require("dotenv").config();

const usernameAdmin = process.env.USERNAME_ADMIN as string;
const passwordAdmin = process.env.PASSWORD_ADMIN as string;
const secret = process.env.SECRET as string;

export { usernameAdmin, passwordAdmin, secret };