/// <reference path="../../typings/index.d.ts" />

// import moment from 'moment/src/moment';
import * as URI from 'urijs';
import {UUID} from '../util/UUID';

export class OnmsServer {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;

  constructor(name?:string, url?:string, username?:string, password?:string) {
    this.id = UUID.generate();
    this.name = name;
    this.url = url;
    this.username = username;
    this.password = password;
  }

  relativeUrl(segment?:string) {
    if (!this.url) {
      return undefined;
    }
    return segment ? URI(this.url).segment(segment).toString() : this.url;
  }

  get host() {
    if (!this.url) {
      return undefined;
    }
    return URI(this.url).hostname();
  }
}
