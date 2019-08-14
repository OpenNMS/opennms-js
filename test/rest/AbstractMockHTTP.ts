/** @hidden */
declare const Promise, require;

/** @hidden */
// tslint:disable-next-line
const URI = require('urijs');

import {AbstractHTTP} from '../../src/rest/AbstractHTTP';

import {OnmsHTTPOptions} from '../../src/api/OnmsHTTPOptions';
import {OnmsResult} from '../../src/api/OnmsResult';

/** Simplify making versioned mock HTTP classes. */
export abstract class AbstractMockHTTP extends AbstractHTTP {
  /** HTTP GET */
  public get(u: string, options?: OnmsHTTPOptions) {
    const url = this.getUrl(u, options);

    const ret = this.onGet(url, options);
    if (ret) {
      return Promise.resolve(ret);
    }

    throw new Error(this.constructor.name + ': Not yet implemented: GET ' + url);
  }

  /** HTTP PUT */
  public put(u: string, options?: OnmsHTTPOptions) {
    const url = this.getUrl(u, options);

    const ret = this.onPut(url, options);
    if (ret) {
      return Promise.resolve(ret);
    }

    throw new Error(this.constructor.name + ': Not yet implemented: PUT ' + url);
  }

  /** HTTP POST */
  public post(u: string, options?: OnmsHTTPOptions) {
    const url = this.getUrl(u, options);

    const ret = this.onPost(url, options);
    if (ret) {
      return Promise.resolve(ret);
    }

    throw new Error(this.constructor.name + ': Not yet implemented: POST ' + url);
  }

  /** HTTP HEAD */
  public head(u: string, options?: OnmsHTTPOptions) {
    const url = this.getUrl(u, options);

    const ret = this.onHead(url, options);
    if (ret) {
      return Promise.resolve(ret);
    }

    throw new Error(this.constructor.name + ': Not yet implemented: HEAD ' + url);
  }

  /** HTTP DELETE */
  public httpDelete(u: string, options?: OnmsHTTPOptions) {
    const url = this.getUrl(u, options);

    const ret = this.onDelete(url, options);
    if (ret) {
      return Promise.resolve(ret);
    }

    throw new Error(this.constructor.name + ': Not yet implemented: DELETE ' + url);
  }

  /** Creates a URL (including parameters) for pattern matching */
  protected getUrl(url: string, options?: OnmsHTTPOptions) {
    const urlObj = new URI(url);
    if (options && options.parameters) {
      urlObj.search(options.parameters);
    }
    return urlObj.toString();
  }

  /** Create an "OK" [[OnmsResponse]] with a type of 'application/json' and the contents of the path provided */
  protected okJsonFile(path: string) {
    return OnmsResult.ok(require(path), undefined, undefined, 'application/json');
  }

  /** Create an "OK" [[OnmsResponse]] with a type of 'application/json' and the return value provided */
  protected okJson(ret: any) {
    return OnmsResult.ok(ret, undefined, undefined, 'application/json');
  }

  /** Override in mock implementations to process GETs */
  protected onGet(url: string, options?: OnmsHTTPOptions): OnmsResult<any> | undefined {
    return undefined;
  }

  /** Override in mock implementations to process PUTs */
  protected onPut(url: string, options?: OnmsHTTPOptions): OnmsResult<any> | undefined {
    return undefined;
  }

  /** Override in mock implementations to process POSTs */
  protected onPost(url: string, options?: OnmsHTTPOptions): OnmsResult<any> | undefined {
    return undefined;
  }

  /** Override in mock implementations to process HEADs */
  protected onHead(url: string, options?: OnmsHTTPOptions): OnmsResult<any> | undefined {
    return undefined;
  }

  /** Override in mock implementations to process DELETEs */
  protected onDelete(url: string, options?: OnmsHTTPOptions): OnmsResult<any> | undefined {
    return undefined;
  }
}
