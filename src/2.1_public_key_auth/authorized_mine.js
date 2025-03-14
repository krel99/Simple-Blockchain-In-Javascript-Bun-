import crypto from "crypto";
import readline from "readline";
import { mkdir } from "node:fs/promises";
import { join } from "path";

const authorizedMiners = [
  `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiQmBdtdty/6ThHRsFdiX
GSIxXRphWnnrCNv4VJNp11bNTKQ4mFRuc03M1Pbtkhs5sXx5ZeIvj0foTNQnZ7Kp
uLxSU2UcJ9lsufas/a3vmc53KDw0chgd4K6+OlY8HV+qOLkhfxItp4Bnd2rSqdSD
saOl8ve69SJP2BN8AfrQ0j4d4Sw++MAZKVjDD5RDRIHF+yX/6foc3ttjy+uHuBwi
rcAtrhWoRBIcoUZ9zYE5um8R5Zm3NV7VOHo/7HABneoyedtclal2y2l+5ZBsHW+D
OrjBwf8uRQ57sJspmwuk/DP1ddJ4PIp5+q0PV4YDaINXMz1+pANIjRoNcxr0pbB/
rQIDAQAB
-----END PUBLIC KEY-----
`,
];
const difficulty = 3;
const PATH = join("blockchain", "2.1");

async function mine(targetDifficulty, minerId) {
  for (let nonce = 0; ; nonce++) {
    const data = `BlockData${nonce}`;
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    if (hash.startsWith("0".repeat(targetDifficulty))) {
      return { nonce, hash, minerId };
    }
  }
}

async function mineOneBlock() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter your miner ID: ", (minerId) => {
      if (!authorizedMiners.includes(minerId)) {
        console.log(`Miner ${minerId} is not authorized.`);
        rl.close();
        resolve(null);
        return;
      }

      rl.question(
        "Enter the signature for this mining attempt: ",
        (signature) => {
          const dataToVerify = "MiningAttempt"; // This is generated, what would really be here?
          const isValidSignature = verifySignature(
            minerId,
            dataToVerify,
            signature,
          );

          if (!isValidSignature) {
            console.log("Invalid signature. Mining attempt rejected.");
            rl.close();
            resolve(null);
            return;
          }

          const newBlock = mine(difficulty, minerId);
          console.log(`Miner ${minerId} found a hash.`);
          rl.close();
          resolve(newBlock);
        },
      );
    });
  });
}

async function saveBlock(block) {
  await mkdir(PATH, { recursive: true });
  const fullPath = join(PATH, `block-${Date.now()}.json`);

  await Bun.write(fullPath, JSON.stringify(block, null, 2));
  console.log(`Block saved - ${filename}`);
}

function verifySignature(publicKey, data, signature) {
  const verify = crypto.createVerify("SHA256");
  verify.write(data);
  verify.end();

  return verify.verify(publicKey, signature, "base64");
}

(async () => {
  const block = await mineOneBlock();
  if (block) {
    await saveBlock(block);
  } else {
    console.log("Block was not mined or saved.");
  }
})();
