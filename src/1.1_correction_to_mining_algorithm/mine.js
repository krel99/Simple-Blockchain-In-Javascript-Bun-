import crypto from "crypto";

// during 1.0 project debate, instructor helped me understand how a more realistic mining algorithm would look like

function mine(targetDifficulty) {
  for (let nonce = 0; ; nonce++) {
    const data = `BlockData${nonce}`;
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    if (hash.startsWith("0".repeat(targetDifficulty))) {
      return { nonce, hash };
    }
  }
}

const difficulty = 3; // Number of leading zeros in the hash
const result = mine(difficulty);
console.log("Nonce:", result.nonce);
console.log("Hash:", result.hash);
