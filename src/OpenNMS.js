import OnmsError from './errors/OnmsError';
import OnmsServer from './model/OnmsServer';

export default class OpenNMS {
  constructor() {
  }

  get server() {
    return this._server;
  }

  connect(s = undefined) {
    this._server = s;
    if (s instanceof OnmsServer) {
      this._server = s;
    } else if (typeof s === 'object' && s.name && s.url) {
      this._server = new OnmsServer(s.name, s.url, s.username, s.password);
    } else {
      throw new OnmsError('You must pass an OnmsServer to connect!');
    }
    return this._server;
  }

  toJSON() {
    return {
      server: this._server
    };
  }
}
