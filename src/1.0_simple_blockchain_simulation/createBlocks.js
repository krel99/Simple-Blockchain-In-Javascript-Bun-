import { CryptoHasher } from "bun";
import { randomInt } from "crypto";
import encryptDataWithNonce from "./helpers/encrypt";
import path from "path";
import { mkdir } from "node:fs/promises";
import getWantedList from "./helpers/api-fbi";

const DIRECTORY_PATH = path.join(process.cwd(), "blockchain", "unminned");

async function createNBlocks(n) {
  await mkdir(DIRECTORY_PATH, { recursive: true });
  const previousNonces = [];

  let hash = "";

  for (let i = 0; i <= n; i++) {
    // create a nonce and make sure that the identical block hasn't been created yet
    let nonce = randomInt(89999) + 10000;
    while (previousNonces.includes(nonce)) {
      if ((previousNonces.length = 89999))
        throw new Error(`All blocks of this difficulty are already created`);
      nonce = randomInt(89999) + 10000;
    }

    // create the block
    const previousHash = hash;
    hash = CryptoHasher.hash("sha1", nonce.toString()).toString("hex");
    const secretData = await getWantedList();
    const encryptedData = await encryptDataWithNonce(nonce, secretData);

    const block = {
      hash,
      previousHash,
      encryptedData,
    };

    const blockFilePath = path.join(DIRECTORY_PATH, `${block.hash}.json`);
    await Bun.write(blockFilePath, JSON.stringify(block, null, 2));

    // save nonce to avoid duplicate blocks
    previousNonces.push(nonce);
  }
}

createNBlocks(3);
