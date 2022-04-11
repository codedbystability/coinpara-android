import { validateEmail } from "./string-helper";

export function checkNumberIsValid(phone, countryCode) {
  // const validPhoneNumber = isValidNumber(phone, countryCode);
  // if (!validPhoneNumber) {
  //   return false;
  // }
  return true;
}


export function checkEmailIsValid(email) {
  const validEmail = validateEmail(email);
  if (!validEmail) {
    return false;
  }
  return true;
}



