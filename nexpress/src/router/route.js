import { HTTPVerbs } from "../lib/helpers";
import { Layer } from "./layer";

export class Route {

  constructor(path) {
    this.path = path;
    // pile of layers
    this.stack = [];
    this.methods = {};
  }

  get(handler) {
    const layer = new Layer("/", handler);
    // NEW - notice we're now using a pseudo-enum to avoid typo bugs
    layer.method = HTTPVerbs.GET;

    this.methods[HTTPVerbs.GET] = true;
    this.stack.push(layer);
    return this;
  }

  post(handler) {
    const layer = new Layer("/", handler);
    layer.method = HTTPVerbs.POST;

    this.methods[HTTPVerbs.POST] = true;
    this.stack.push(layer);
    return this;
  }

  put(handler) {
    const layer = new Layer("/", handler);
    layer.method = HTTPVerbs.PUT;

    this.methods[HTTPVerbs.PUT] = true;
    this.stack.push(layer);
    return this;
  }

  patch(handler) {
    const layer = new Layer("/", handler);
    layer.method = HTTPVerbs.PATCH;

    this.methods[HTTPVerbs.PATCH] = true;
    this.stack.push(layer);
    return this;
  }

  delete(handler) {
    const layer = new Layer("/", handler);
    layer.method = HTTPVerbs.DELETE;

    this.methods[HTTPVerbs.DELETE] = true;
    this.stack.push(layer);
    return this;
  }

  requestHandler(method) {
    const name = method.toLowerCase();
    return Boolean(this.methods[name]);
  }


  dispatch(req, res) {
    const method = req.method.toLowerCase();

    this.stack.forEach((item) => {
      if (method === item.method) {
        item.requestHandler(req, res);
      }
    });
  }
}