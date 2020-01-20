import BaseMiddleware from '#/middleware/base';

export default class Controls extends BaseMiddleware {
  constructor() {
    this.mappings = {};
    this.state = {};
  }
}
