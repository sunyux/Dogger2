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

async function getStaticFile(res, filePath) {
  return fs.readFile(
    path.resolve(filePathPrefix, filePath), "utf8")
    .catch((err) => {
      return res.status(500).send(`Server Error Occurred! ${err}`);
    }).then((file) => {
      res.status(200).send(file);
    });
}

export default function setupRoutes(app) {

  app.use(cors());

  app.get("/about", (req, res) => {
    res.status(200).send("about:GET");
  });

  app.get("/", async (req, res) => {
    return getStaticFile(res, "index.html");
  });

  app.post("/postExample", (req, res) => getStaticFile(res, "post.html"));

  app.put("/putExample", (req, res) =>
    getStaticFile(res, "put.html"));

  app.patch("/patchExample", (req, res) => {
    return getStaticFile(res, "patch.html");
  });

  app.delete("/deleteExample", (req, res) => {
    return getStaticFile(res, "delete.html");
  });

  app.use((req, res, next) => {
    return res.status(404).json({
      message: "This page doesn't exist!",
    });
  });
}