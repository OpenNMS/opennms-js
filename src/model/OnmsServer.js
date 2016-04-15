// import moment from 'moment/src/moment';
import URI from 'urijs';
import uuid from 'uuid';

export default class OnmsServer {
  constructor(name, url, username, password) {
    this.id = uuid.v1();
    this.name = name;
    this.url = url;
    this.username = username;
    this.password = password;
  }

  relativeUrl(segment) {
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
