import { Route } from "./route.js";
import { Layer } from "./layer.js";

export class Router {
  constructor() {
    this.stack = [
      new Layer("*", (req, res) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end(`Cannot find ${req.url}`);
      }),
    ];
  }

  get(path, handler) {
    const route = this.route(path);
    route.get(handler);
    return this;
  }

  post(path, handler) {
    const route = this.route(path);
    route.post(handler);
    return this;
  }

  put(path, handler) {
    const route = this.route(path);
    route.put(handler);
    return this;
  }

  patch(path, handler) {
    const route = this.route(path);
    route.patch(handler);
    return this;
  }

  // Note that because Class syntax in JS ultimately transpiles to prototype properties
  // for compatibility instead of being treated as "function" functions, 
  // we actually CAN use delete() as an identifier here just fine.
  // Do you love JS yet?
  delete(path, handler) {
    const route = this.route(path);
    route.delete(handler);
    return this;
  }

  route(path) {
    const route = new Route(path);
    const layer = new Layer(path, (req, res) => route.dispatch(req, res));
    layer.route = route;
    this.stack.push(layer);

    return route;
  }

  handle(req, res) {
    const method = req.method;
    let found = false;

    this.stack.some((item, index) => {
      if (index === 0) {
        return false;
      }
      const { matched = false, params = {} } = item.match(req.pathname);
      if (matched && item.route && item.route.requestHandler(method)) {
        found = true;
        req.params = params;
        return item.requestHandler(req, res);
      }
    });

    return found ? null : this.stack[0].requestHandler(req, res);
  }
}