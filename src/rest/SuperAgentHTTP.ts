import * as request from 'superagent';

import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTP} from '../api/OnmsHTTP';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../model/OnmsServer';

import {factory} from '../api/Log';

const log = factory.getLogger('rest.SuperAgentHTTP');

/**
 * Implementation of the OnmsHTTP interface using SuperAgent: https://github.com/visionmedia/superagent
 * @module SuperAgentHTTP
 * @implements OnmsHTTP
 */ /** */
export class SuperAgentHTTP extends AbstractHTTP implements OnmsHTTP {
  constructor(server?: OnmsServer, timeout = 10000) {
    super(server, timeout);
  }

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    return this.getImpl('get', url, options).then((response) => {
      if (response.body) {
        return OnmsResult.ok(response.body, undefined, response.status);
      }
      log.errorc(() => 'got non-parsed result: ' + JSON.stringify(response));
      return OnmsResult.error('unknown response type: ' + response.type, response.status);
    }).catch((err) => {
      let code;
      let message = 'Failed to get ' + url;
      if (err.response) {
        code = err.response.status;
        message = err.response.text;
      }
      return Promise.reject(OnmsResult.error(message, code));
    });
  }

  /** internal method for getting/constructing a superAgent object on-demand, based on the current server config */
  private getImpl(method: string, url: string, options?: OnmsHTTPOptions) {
    if (!this.server) {
      throw new OnmsError('You must set a server before attempting to make queries using SuperAgent!');
    }

    return request[method](url)
      .withCredentials()
      .timeout(options.timeout || super.timeout || super.options.timeout)
      .auth(options.auth.username || super.server.auth.username || super.options.auth.username,
        options.auth.password || super.server.auth.password || super.options.auth.password);
  }

}
