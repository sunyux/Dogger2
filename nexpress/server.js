import cors from "cors";
import path from "path";
import fs, { appendFileSync } from "fs";
import { isAsyncFunction } from "util/types";
import { assert } from "console";
import minimal from "./src/minimal";
import setupRoutes from "./src/routes";

async function main() {

  // Don't interfere with Jest/supertest!
  if (process.env.NODE_ENV !== 'test') {
    const app = minimal();
    setupRoutes(app);
    // now we need to await our listen!
    const server = await app.listen(9000, () => {
      console.log("Server is running");
    });
  }
}


export function addNumbersTestExample(a, b) {
  return a + b;
}

main();