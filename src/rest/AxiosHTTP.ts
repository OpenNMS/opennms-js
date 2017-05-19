import axios from 'axios';
import {AxiosInstance} from 'axios';
import {OnmsHTTP} from '../api/OnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsServer} from '../model/OnmsServer';

export class AxiosHTTP implements OnmsHTTP {
  private _axios: AxiosInstance;
  _server: OnmsServer;
  timeout: number;

  private get axios() {
    if (!this._axios) {
      if (!this.server) {
        throw new OnmsError('You must set a server before attempting to make queries using Axios!');
      }
      this._axios = axios.create({
        baseURL: this.server.url,
        timeout: this.timeout,
        withCredentials: true,
        auth: {
          username: this.server.username,
          password: this.server.password
        }
      });
    }
    return this._axios;
  }

  public get server() {
    return this._server;
  }

  public set server(server: OnmsServer) {
    this._axios = undefined;
    this._server = server;
  }

  constructor(server?: OnmsServer, timeout = 10000) {
    this.server = server;
    this.timeout = timeout;
  }

}
