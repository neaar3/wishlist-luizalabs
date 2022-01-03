import { UserAccount } from "../shared/costumer";

// validator from W3C - https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
export const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export async function validateEmail(email: string) {
  if(!emailValidator.test(email)) {
    throw new Error("Badly formatted email. Please, use another email.")
  }
}

export default async function validateUserData(user: UserAccount) {
  if (!user.name) {
    throw new Error("Name is required.");
  }

  if (!user.email) {
    throw new Error("Email is required.");
  }

  validateEmail(user.email);
}
