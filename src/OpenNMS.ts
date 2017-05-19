import * as axios from 'axios';

import {OnmsHTTP} from './api/OnmsHTTP';
import {OnmsError} from './errors/OnmsError';
import {OnmsServer} from './model/OnmsServer';

class OnmsAuth {
  username: string;
  password: string;

  constructor(u:string, p:string) {
    this.username = u;
    this.password = p;
  }
}

class Options {
  timeout = 10000;
  auth: OnmsAuth;
  withCredentials: boolean;

  constructor(wc = true, t?: number, a?: OnmsAuth) {
    this.withCredentials = wc;
    if (t !== undefined) {
      this.timeout = t;
    }
    if (a !== undefined) {
      this.auth = a;
    }
  }
}

function testUrl(url: string, username: string, password: string, timeout?: number) {
  let options = new Options(true, timeout);

  if (username && password) {
    options.auth = new OnmsAuth(username, password);
  }

  /*
  var requests = [
    axios.get('/alarms/count'),
    axios.get('/rest/alarms/count'),
    axios.get('/opennms/rest/alarms/count')
  ];
  axios.all(requests);
  */
}

export class OpenNMS {
  private _server: OnmsServer;

  constructor() {
  }

  get server() {
    return this._server;
  }

  /**
   * @ngdoc method
   * @description Connect to an OpenNMS server
   */
  connect(s?: OnmsServer) {
    this._server = s;
    return this._server;
  }

  toJSON() {
    return {
      server: this._server
    };
  }
}