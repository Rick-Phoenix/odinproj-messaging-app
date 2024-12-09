import { randomBytes, pbkdf2Sync } from "crypto";

function genPassword(password) {
  const salt = randomBytes(32).toString("hex");
  const genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );

  return {
    salt: salt,
    hash: genHash,
  };
}

function checkPassword(password, hash, salt) {
  const genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );
  const isValid = genHash === hash;

  return isValid;
}

export { genPassword, checkPassword };
