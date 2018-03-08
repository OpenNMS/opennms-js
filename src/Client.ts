import * as axios from 'axios';

import {log, catRoot} from './api/Log';
import {Category} from 'typescript-logging';

import {IHasHTTP} from './api/IHasHTTP';
import {IOnmsHTTP} from './api/IOnmsHTTP';

import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsError} from './api/OnmsError';
import {OnmsResult} from './api/OnmsResult';
import {OnmsVersion} from './api/OnmsVersion';
import {ServerType, ServerTypes} from './api/ServerType';
import {TicketerConfig} from './api/TicketerConfig';

import {OnmsServer} from './api/OnmsServer';
import {ServerMetadata} from './api/ServerMetadata';

import {AlarmDAO} from './dao/AlarmDAO';
import {EventDAO} from './dao/EventDAO';
import {FlowDAO} from './dao/FlowDAO';
import {NodeDAO} from './dao/NodeDAO';

import {AxiosHTTP} from './rest/AxiosHTTP';

/** @hidden */
export const cat = new Category('client', catRoot);

/**
 * The OpenNMS client.  This is the primary interface to OpenNMS servers.
 * @module Client
 */
export class Client implements IHasHTTP {
  /**
   * Given an OnmsServer object, check that it can be connected to.
   *
   * @param server - the server to check
   * @param httpImpl - the [[IOnmsHTTP]] implementation to use
   * @param timeout - how long to wait before giving up when making ReST calls
   */
  public static async checkServer(server: OnmsServer, httpImpl?: IOnmsHTTP, timeout?: number): Promise<boolean> {
    const opts = new OnmsHTTPOptions(timeout, server.auth, server);
    if (!httpImpl) {
      if (!Client.defaultHttp) {
        throw new OnmsError('No HTTP implementation is configured!');
      }
      httpImpl = Client.defaultHttp;
    }
    opts.headers.accept = 'text/plain';

    const infoUrl = server.resolveURL('rest/alarms/count');
    log.debug('checkServer: checking URL: ' + infoUrl, cat);
    await httpImpl.get(infoUrl, opts);
    return true;
  }

  /**
   * Given an OnmsServer object, query what capabilities it has, and return the capabilities
   * associated with that server.
   *
   * @param server - the server to check
   * @param httpImpl - the [[IOnmsHTTP]] implementation to use
   * @param timeout - how long to wait before giving up when making ReST calls
   */
  public static async getMetadata(server: OnmsServer, httpImpl?: IOnmsHTTP, timeout?: number):
    Promise<ServerMetadata> {
    const opts = new OnmsHTTPOptions(timeout, server.auth, server);
    opts.headers.accept = 'application/json';
    if (!httpImpl) {
      if (!Client.defaultHttp) {
        throw new OnmsError('No default HTTP implementation is configured!');
      }
      httpImpl = Client.defaultHttp;
    }

    const infoUrl = server.resolveURL('rest/info');
    log.debug('getMetadata: checking URL: ' + infoUrl, cat);

    const response = await httpImpl.get(infoUrl, opts);
    const version = new OnmsVersion(response.data.version, response.data.displayVersion);
    const metadata = new ServerMetadata(version);
    if (response.data.packageName) {
      if (response.data.packageName.toLowerCase() === 'meridian') {
        metadata.type = ServerTypes.MERIDIAN;
      }
    }
    if (metadata.ticketer()) {
      metadata.ticketerConfig = new TicketerConfig();
      metadata.ticketerConfig.enabled = false;
      if (response.data.ticketerConfig) {
          metadata.ticketerConfig.plugin = response.data.ticketerConfig.plugin;
          metadata.ticketerConfig.enabled = response.data.ticketerConfig.enabled === true;
      }
    }
    return metadata;
  }

  /** The default OnmsHTTP implementation to be used when making requests */
  private static defaultHttp: IOnmsHTTP;

  /** the OnmsHTTP implementation that will be used when making requests */
  public http: IOnmsHTTP;

  /** The remote server to connect to */
  public server: OnmsServer;

  /**
   * Construct a new OpenNMS client.
   * @constructor
   * @param httpImpl - The OnmsHTTP implementation to use. Normally
   *        this will automatically choose the best implementation
   *        based on the environment.
   */
  constructor(httpImpl?: IOnmsHTTP) {
    if (httpImpl) {
      Client.defaultHttp = httpImpl;
    } else {
      Client.defaultHttp = new AxiosHTTP();
    }
    this.http = Client.defaultHttp;
  }

  /**
   * Connect to an OpenNMS server, check what capabilities it has, and return an [[OnmsServer]]
   * for that connection.
   */
  public async connect(name: string, url: string, username: string, password: string, timeout?: number) {
    const self = this;
    const server = new OnmsServer(name, url, username, password);

    await Client.checkServer(server, undefined, timeout);
    server.metadata = await Client.getMetadata(server, undefined, timeout);

    if (!self.http) {
      self.http = Client.defaultHttp;
    }
    if (!self.http.server) {
      self.http.server = server;
    }
    self.server = server;

    return self;
  }

  /** Get an alarm DAO for querying alarms. */
  public alarms() {
    return new AlarmDAO(this);
  }

  /** Get an event DAO for querying events. */
  public events() {
    return new EventDAO(this);
  }

  /** Get a node DAO for querying nodes. */
  public nodes() {
    return new NodeDAO(this);
  }

  /** Get a flow DAO for querying flows. */
  public flows() {
    return new FlowDAO(this);
  }
}
