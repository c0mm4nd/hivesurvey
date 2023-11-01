import "dotenv/config";
import { kv } from "@vercel/kv";
import * as fs from "fs/promises";

// export all key values from vercel KV store
kv.keys("*").then(async (keys) => {
  console.log(keys);
  let survies = {};
  for (const key of keys) {
    const value = await kv.get(key);
    survies[key] = value;
  }

  await fs.writeFile("survies.json", JSON.stringify(survies));
});
