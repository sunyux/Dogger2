import { assert } from "console";
import { addNumbersTestExample as addNumbers } from "./server";
import Minimal from "./src/minimal";
import request from "supertest";
import setupRoutes from "./src/routes";
import { doesNotMatch } from "assert";
import { Http2ServerRequest } from "http2";




const app = Minimal();

describe("Basic test suite", () => {
  it("Should add 2+3 properly = 5", () => {
    let result = addNumbers(2, 3);
    expect(result).toBe(5);
  });
});

describe("Static Routes", () => {
  let server;

  beforeAll(() => {
    setupRoutes(app);
    server = app.createServer();
  })

  it(`responds with "GET to /about" text and 200 status code`, async () => {
    let res = await request(server)
      .get("/about");
    expect(res.statusCode).toBe(200);

    //purposely use await res.text here to show that js will let you 
    // await non-promises and just wrap them in a promise lmao
    expect(await res.text).toEqual("GET to /about");
  });

  it("responds with 404 when route doesn't exist", async () => {
    let res = await request(server)
      .get("/hellos");

    expect(res.statusCode).toBe(404);
  });

  it("Handles the delete route request properly", async () => {
    let res = await request(server)
      .delete("/deleteExample");
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain("Delete");
  })

  it("Handles the PUT route request properly", () => {
    return request(server)
      .put("/putExample")
      .expect((res) => res.text.includes("Put"))
      .expect(200);
  });

  it("Handles the Patch request properly", (done) => {
    request(server)
      .patch("/patchExample")
      .expect(200, done);
  })

  it("Handles the post request properly", (done) => {
    request(server)
      .post("/postExample")
      .expect(200, done);
  })

  it("Rejects all non-matching GET requests to each endpoint", async () => {
    return Promise.all(
      verbs
        .filter((value) => { return value !== "get" })
        .map((verb) => {
          console.log(`/${verb}Example`)
          request(server)
            .get(`/${verb}Example`)
            .expect(404)
        })
    );
  });

  afterAll(async () => {
    await server.close();
  })

});

const verbs = [
  "get",
  "post",
  "patch",
  "put",
  "delete"
]
