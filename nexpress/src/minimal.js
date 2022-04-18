import fs from "fs";
import { path as nodePath } from "path";
import http from "http";
import request from "./request";
import response from "./response";
import { checkMiddlewareInputs, matchPath } from "./lib/helpers";
import { Router } from "./router/router";
import util from "util";

export default function Minimal() {
  let middlewares = [];

  const router = new Router();

  function use(...args) {
    const { path, handler } = checkMiddlewareInputs(args);

    middlewares.push({
      path,
      handler,
    });
  }

  function get(...args) {
    const { path, handler } = checkMiddlewareInputs(args);
    return router.get(path, handler);
  }

  function post(...args) {
    const { path, handler } = checkMiddlewareInputs(args);
    return router.post(path, handler);
  }

  function put(...args) {
    const { path, handler } = checkMiddlewareInputs(args);
    return router.put(path, handler);
  }

  function patch(...args) {
    const { path, handler } = checkMiddlewareInputs(args);
    return router.patch(path, handler);
  }

  function findNext(req, res) {
    let current = -1;
    const next = () => {
      current += 1;
      const middleware = middlewares[current];

      const { matched = false, params = {} } = middleware
        ? matchPath(middleware.path, req.pathname)
        : {};

      if (matched) {
        req.params = params;
        middleware.handler(req, res, next);
      } else if (current <= middlewares.length) {
        // Note this IS recursing!
        next();
      } else {
        req.handler(req, res);
      }
    };
    return next;
  }

  function handle(req, res, callback) {
    req.handler = callback;
    //iterate middelwares and handle
    const next = findNext(req, res);
    next();
  }

  // just directly split the server from listen
  function createServer() {
    return http
      .createServer((req, res) => {
        // turn node's request/response objects into express versions
        request(req);
        response(res);

        //process middleware
        handle(req, res, () => router.handle(req, res));
      });
  }

  function listen(port, callback) {
    let server = createServer(port);
    const asyncListen = util.promisify(server.listen.bind(server));
    return asyncListen({ port });
  }

  let minimal = {
    use,
    get,
    post,
    put,
    patch,
    createServer,
    listen,
  };

  /* DELETE IS A RESERVED WORD!
    Both our TS compiler and the Javascript spec specify you cannot use 'delete'
    but nonetheless, express does it, and thus we must as well!  How do we, though?
    Stack Overflow to the rescue!  If we google "Javascript delete reserved word cannot be used here"
    it leads us to this SO result: 
    https://stackoverflow.com/questions/29172349/typescript-unable-to-create-a-delete-function-outside-of-a-class
    Nested inside of this is a variety of potential solutions, so we're going to use
    the one that abuses JS as much as JS abuses us.
    Functions cannot be named 'delete', but "properties" can.  Are they basically
    the same thing?  Yep!  Thanks, ancient JS, for letting us run amuk in 
    your language.
  */
  minimal.delete = (...args) => {
    const { path, handler } = checkMiddlewareInputs(args);
    return router.delete(path, handler);
  }

  return minimal;

}

