import crypto from "crypto";

/**
 * @param nonce representation of nonce integer or integer - "10000" | 10000
 * @param data JSON to be encrypted
 * @returns encrypted row of data
 */
export default async function encryptDataWithNonce(nonce, data) {
  const secretData = JSON.stringify(data);
  const key = nonce.toString().padEnd(32, "0").slice(0, 32);

  // Initialization Vector (IV) for AES encryption (should be random but fixed length)
  const iv = crypto.randomBytes(16);

  // Create cipher with AES-256-CBC
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Encrypt the secret data
  let encryptedData = cipher.update(secretData, "utf8", "hex");
  encryptedData += cipher.final("hex");

  return encryptedData;
}
