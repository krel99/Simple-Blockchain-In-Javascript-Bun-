import crypto from "crypto";
import readline from "readline";

const authorizedMiners = ["karel", "souhail", "satoshi", "admin"];

function mine(targetDifficulty) {
  for (let nonce = 0; ; nonce++) {
    const data = `BlockData${nonce}`;
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    if (hash.startsWith("0".repeat(targetDifficulty))) {
      return { nonce, hash };
    }
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your miner ID: ", (minerId) => {
  const difficulty = 3;

  if (!authorizedMiners.includes(minerId)) {
    console.log(`Miner ${minerId} is not authorized.`);
    rl.close();
    return;
  }

  console.log(`Miner ${minerId} found a hash:`, mine(minerId, difficulty));

  rl.close();
});
