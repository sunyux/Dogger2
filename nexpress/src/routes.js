import cors from "cors";
import { promises as fs } from "fs";
import path from "path";

function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

const filePathPrefix = areWeTestingWithJest()
  // Jest
  ? path.resolve(__dirname, "..", "public")
  // Not Jest
  : path.resolve(__dirname, "..", "..", "public");

async function serveStaticFile(res, filePath) {

  return fs.readFile(path.resolve(filePathPrefix, filePath))
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(`Server Error Occurred! ${err}`);
    })
}

export default function setupRoutes(app) {

  app.use(cors());

  app.get("/about", (req, res) => {
    res.status(200).send("GET to /about");
  });

  app.get("/", async (req, res) => {
    // interestingly, you do not need to return this due to async
    // executing internally by node
    // which will cause the res.send() to happen
    serveStaticFile(res, "index.html");
  });

  app.post("/postExample", (req, res) => {
    // But you can if you like!
    return serveStaticFile(res, "post.html");
  })

  app.put("/putExample", (req, res) => {
    return serveStaticFile(res, "put.html");
  })

  app.patch("/patchExample", (req, res) => {
    return serveStaticFile(res, "patch.html");
  })

  app.delete("/deleteExample", (req, res) => {
    return serveStaticFile(res, "delete.html");
  })
}