import * as request from 'superagent';

import {log, catRest} from '../api/Log';
import {Category} from 'typescript-logging';

import {IOnmsHTTP} from '../api/IOnmsHTTP';

import {AbstractHTTP} from './AbstractHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';
import {OnmsResult} from '../api/OnmsResult';
import {OnmsServer} from '../api/OnmsServer';

/** @hidden */
const catAgent = new Category('super-agent', catRest);

/**
 * Implementation of the OnmsHTTP interface using SuperAgent: https://github.com/visionmedia/superagent
 * @module SuperAgentHTTP
 * @implements IOnmsHTTP
 */ /** */
export class SuperAgentHTTP extends AbstractHTTP implements IOnmsHTTP {
  constructor(server?: OnmsServer, timeout = 10000) {
    super(server, timeout);
  }

  /** make an HTTP get call -- this should be overridden by the implementation */
  public get(url: string, options?: OnmsHTTPOptions) {
    return this.getImpl('get', url, options).then((response) => {
      if (response.body) {
        return OnmsResult.ok(response.body, undefined, response.status, response.type);
      }
      log.errorc(() => 'got non-parsed result: ' + JSON.stringify(response), undefined, catAgent);
      throw new Error('Unknown response type: ' + response.type + ' (status: ' + response.status + ')');
    });
  }

  /** internal method for getting/constructing a superAgent object on-demand, based on the current server config */
  private getImpl(method: string, url: string, options?: OnmsHTTPOptions) {
    if (!this.server) {
      throw new OnmsError('You must set a server before attempting to make queries using SuperAgent!');
    }

    const realUrl = this.server.resolveURL(url);
    const allOptions = this.getOptions(options);

    const urlObj = new URI(realUrl);
    urlObj.search(options.parameters);
    log.debug('getting ' + urlObj.toString(), catAgent);

    return request[method](realUrl)
      .withCredentials()
      .timeout(allOptions.timeout)
      .set('Accept', allOptions.accept)
      .auth(allOptions.auth.username, allOptions.auth.password)
      .query(allOptions.parameters);
  }

}
