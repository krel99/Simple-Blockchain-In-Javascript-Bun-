import crypto from "crypto";

export default function decryptData(nonce, data) {
  const key = nonce.toString().padEnd(32, "0").slice(0, 32);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
