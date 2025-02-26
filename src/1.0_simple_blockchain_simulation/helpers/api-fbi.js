import { fetch } from "bun";
import { randomInt } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FILE_PATH = "./data/wanted-response.json";
const API_URL = "https://api.fbi.gov/wanted/v1/list";

export default async function getWantedList() {
  try {
    const response = await fetch(`${API_URL}?page=${randomInt(20) + 1}`);
    const data = await response.json();
    const simplifiedData = data.items.map((person) => ({
      name: person.title,
      description: person.description,
      aliases: person.aliases || [],
    }));
    return simplifiedData[randomInt(simplifiedData.length - 1)];
  } catch (error) {
    console.error(
      "Error fetching FBI data, attempting to load from file:",
      error,
    );

    try {
      const fileData = readFileSync(FILE_PATH, "utf8");
      const simplifiedData = JSON.parse(fileData);
      return simplifiedData[randomInt(simplifiedData.length - 1)];
    } catch (fileError) {
      throw new Error(
        "Error reading from backup file... --- Are you running this from the root?",
      );
    }
  }
}
