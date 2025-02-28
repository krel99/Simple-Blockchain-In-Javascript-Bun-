import crypto from "crypto";
import readline from "readline";
import { mkdir } from "node:fs/promises";
import { join } from "path";

const authorizedMiners = ["karel", "souhail", "satoshi", "admin"];
const difficulty = 3;
const PATH = join("blockchain", "2.0");

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

      const newBlock = mine(difficulty, minerId);
      console.log(`Miner ${minerId} found a hash.`);
      rl.close();
      resolve(newBlock);
    });
  });
}

const block = await mineOneBlock();

async function saveBlock(block) {
  await mkdir(PATH, { recursive: true });
  const fullPath = join(PATH, `block-${Date.now()}.json`);

  await Bun.write(fullPath, JSON.stringify(block, null, 2));
  console.log(`Block saved - ${filename}`);
}

saveBlock(block);
