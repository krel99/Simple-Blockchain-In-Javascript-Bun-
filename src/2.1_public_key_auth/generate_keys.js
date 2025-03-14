import crypto from "crypto";
import readline from "readline";
import { mkdir } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { join } from "path";

// mentor noted we should use keys for signing operations instead of name inputs
// this is a simplified way to generate those; they need to be added manually to authorized_mine.js

const PATH = join("blockchain", "2.1");

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

await Bun.write(join(PATH, `miner_private.pem`), privateKey);
await Bun.write(join(PATH, `miner_public.pem`), publicKey);

console.log("Private Key saved to miner_private.pem");
console.log("Public Key saved to miner_public.pem");
