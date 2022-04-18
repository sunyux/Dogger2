import { assert } from "console";
import { addNumbersTestExample as addNumbers } from "./server";
import Minimal from "./src/minimal";
import request from "supertest";
import setupRoutes from "./src/routes";
import { doesNotMatch } from "assert";
import { Http2ServerRequest } from "http2";

// CLASS WALKTHRU STEPS
// Find supertest via explaining everyone probably had trouble figuring out jest
// so we google 'express jest', look for dev.to post that mentions supertest
// google supertest and show in docs You may pass an http.Server, or a Function to request()
// we probably don't have whatever function it wants, but we DO have an http server
// which means in minimal, we need to split createServer from Listen() -- this was the trick


// write basic test
// let it error because we still have const server = app.listen inside of server.js which is what we're testing
// lets move those to a routes file instead
////////////////// PROBABLY OLD
// it's still blowing up with app.address is not a function so we google
// https://stackoverflow.com/questions/33986863/mocha-api-testing-getting-typeerror-app-address-is-not-a-function
// now we need to split them apart so we do
////////////////// END PROBABLY OLD
// lets see if we can figure out how to debug these?
// https://stackoverflow.com/questions/46641872/node-jest-config-paths-must-be-specified
// add to launch.json
// now we have error with multiple tests, saying port already in use
// lets see if we use a debugger on our tests, we can figure it out (launch.json)
// hmm listen() on minimal is getting called somehow, why?
// oh well we imported addNumbersTextExample which RUNS EVERYTHING IN THE FILE
// https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
// lets wrap our server.js to avoid it during tests
// or we could just remove the export, but we want to pack it into a main function for await (server.js)
// MIGHT HAVE PATHS BLOW UP IF SO HERE IS SOLUTION
// now we get jest working fine, but running the server itself doesn't!
// we're back to the problem between /dist and non-dist
// so we make an areWeTestingWithJest() function, again found from google
// lets add some more tests for things
// move on to pormises/async/await tutorial with remaining time
// https://www.freecodecamp.org/news/learn-promise-async-await-in-20-minutes/


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