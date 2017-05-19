/// <reference path="../../typings/index.d.ts" />

import axios from 'axios';
import {AxiosInstance} from 'axios';
import {OnmsServer} from '../model/OnmsServer';

export class OnmsHTTP {
	private _axios: AxiosInstance;
  constructor(server:OnmsServer, timeout:number = 10000) {
    this._axios = axios.create({
      baseURL: server.url,
      timeout: timeout
    });
  }

}
