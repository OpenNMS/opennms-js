import * as axios from 'axios';

import {OnmsHTTP} from './api/OnmsHTTP';
import {OnmsError} from './api/OnmsError';
import {OnmsServer} from './model/OnmsServer';
import {AxiosHTTP} from './rest/AxiosHTTP';

export { OnmsServer as OnmsServer };

class OnmsAuth {
  username: string;
  password: string;

  constructor(u: string, p: string) {
    this.username = u;
    this.password = p;
  }
}

class Options {
  timeout = 10000;
  auth: OnmsAuth;

  constructor(t?: number, a?: OnmsAuth) {
    if (t !== undefined) {
      this.timeout = t;
    }
    if (a !== undefined) {
      this.auth = a;
    }
  }
}

export class OpenNMS {
  private http: OnmsHTTP;
  private server: OnmsServer;

  constructor(httpImpl?: OnmsHTTP) {
    if (httpImpl) {
      this.http = httpImpl;
    } else {
      this.http = new AxiosHTTP();
    }
  }

  public setServer(server: string, name: string, username: string, password: string) {
      this.server = new OnmsServer(name, server, username, password);
  }

  /**
   * @ngdoc method
   * @description Connect to an OpenNMS URL, query what capabilities it has, and create a server object
   */
  public static newServer(name: string, url: string, username: string, password: string, timeout?: number) {
    const opts = new Options(timeout);
    if (username && password) {
      opts.auth = new OnmsAuth(username, password);
    }
    return new OnmsServer(name, url, username, password);
  }
}