import crypto from "crypto";

const SECRET = "REST-API-SECRET-123";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  const auth = crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
  return auth;
};
