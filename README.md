# Simple Javascript Blockchain

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/createBlocks
bun run src/mineBlocks
```
Then, see the folder with Blocks

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Shortcuts Taken

- in real blockchain, a hashed value isn't determined in advance, the miner will simply look for any value that - if hashed - meets certain criteria such as starting with nonce number of leading zeroes
- encryption key in this script is nonce; and it is used to encrypt the data; given its length, it needs to be padded as the encryption algorithm expects certain length of key
