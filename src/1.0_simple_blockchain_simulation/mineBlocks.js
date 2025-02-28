import { readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mkdir } from "node:fs/promises";
import { CryptoHasher } from "bun";
import crypto from "crypto";
import decryptData from "./helpers/decrypt";

const FILE_PATH_UNMINNED = join("blockchain", "unminned");
const FILE_PATH_DECRYPTED = join("blockchain", "decrypted");
const MAX_NONCE = 99999;
const MIN_NONCE = 10000;

export default async function mineAndDecrypt() {
  await mkdir(FILE_PATH_UNMINNED, { recursive: true });
  const allBlocks = await readdir(FILE_PATH_UNMINNED);

  // order the blocks based on their position in the chain

  // const blockJson = findBlockBasedOnPreviousHash(allBlocks);
  const blocksJsonArrOrdered = identifyFirstBlockAndOrder(allBlocks);

  for (let i = 0; i < blocksJsonArrOrdered.length; i++) {
    const blockJson = blocksJsonArrOrdered[i];

    // break the hash
    let nonce = MIN_NONCE;
    for (nonce; nonce <= MAX_NONCE; nonce++) {
      const hash = CryptoHasher.hash("sha1", nonce.toString()).toString("hex");
      if (hash == blockJson.hash) {
        console.log(
          `Hash broken: block #${i} saved as ${blockJson.hash} is ${nonce}`,
        );
        break;
      }
      if (nonce === MAX_NONCE)
        throw new Error(
          `Failed to break a hash - likely not a numerical value or out of bounds`,
        );
    }

    // decrypt information
    const decryptedInformation = decryptData(nonce, blockJson.encryptedData);

    // save the mined blocks
    const minedBlock = {
      ...blockJson,
      brokenHash: nonce,
      personOfInterest: decryptedInformation.name,
      reason: decryptedInformation.description.replace(/[\r\n]/g, " "),
      aliases: decryptedInformation.aliases,
    };
    await Bun.write(
      join(FILE_PATH_DECRYPTED, `block${i}.json`),
      JSON.stringify(minedBlock, null, 2),
    );
    console.log(`Data cache of block${i} has been decrypted and saved.`);
  }
}

function identifyFirstBlockAndOrder(blocksArray) {
  let previousHash = "";
  const orderedCollector = [];
  const hashMap = new Map();
  const jsonCollector = [];

  // set the first element
  // to avoid consequetive loop and adding files again, I will create a map of hash-previousHash here
  for (let i = 0; i < blocksArray.length; ) {
    const fileData = readFileSync(
      join(FILE_PATH_UNMINNED, blocksArray[i]),
      "utf8",
    );
    const json = JSON.parse(fileData);

    // block is either found, or the hashes are mapped
    if (json.previousHash === previousHash) {
      previousHash = json.hash;
      orderedCollector.unshift(json);
      console.log("Identified a first block");
    } else {
      hashMap.set(json.previousHash, json.hash);
      jsonCollector.push(json);
      i++;
    }
  }

  // attach the remaining blocks
  for (let i = 1; i < hashMap.size; i++) {
    const nextJson = jsonCollector.find(
      (el) => el.hash === hashMap.get(previousHash),
    );
    previousHash = nextJson.hash;
    orderedCollector.push(nextJson);
    console.log(`Found block with index #${i}`);
  }

  console.log("Finished ordering blocks");
  return orderedCollector;
}

// function findBlockBasedOnPreviousHash(blocksArray, previousHash = "") {
//   for (const block of blocksArray) {
//     const fileData = readFileSync(join(FILE_PATH_UNMINNED, block), "utf8");
//     const json = JSON.parse(fileData);
//     if (json.previousHash === previousHash) {
//       return json;
//     }
//   }
// }

await mineAndDecrypt();
