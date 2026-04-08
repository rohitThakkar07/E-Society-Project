const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

function isStrongPassword(password) {
  return STRONG_PASSWORD_REGEX.test(String(password || ""));
}

module.exports = {
  STRONG_PASSWORD_REGEX,
  STRONG_PASSWORD_MESSAGE,
  isStrongPassword,
};
