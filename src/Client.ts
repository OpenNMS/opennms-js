import {IHasHTTP} from './api/IHasHTTP';
import {IOnmsHTTP} from './api/IOnmsHTTP';

import {OnmsError} from './api/OnmsError';
import {OnmsHTTPOptions} from './api/OnmsHTTPOptions';
import {OnmsVersion} from './api/OnmsVersion';
import {ServerTypes} from './api/ServerType';
import {TicketerConfig} from './api/TicketerConfig';

import {OnmsServer} from './api/OnmsServer';
import {ServerMetadata} from './api/ServerMetadata';

import {BaseDAO} from './dao/BaseDAO';
import {AlarmDAO} from './dao/AlarmDAO';
import {EventDAO} from './dao/EventDAO';
import {FlowDAO} from './dao/FlowDAO';
import {NodeDAO} from './dao/NodeDAO';
import {SituationFeedbackDAO} from './dao/SituationFeedbackDAO';

import {AxiosHTTP} from './rest/AxiosHTTP';
import { OnmsAuthConfig } from './api/OnmsAuthConfig';

/**
 * The OpenNMS client.  This is the primary interface to OpenNMS servers.
 * @category Rest API
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
    if (!httpImpl) {
      if (!Client.defaultHttp) {
        throw new OnmsError('No HTTP implementation is configured!');
      }
      httpImpl = new Client.defaultHttp();
    }

    const infoUrl = server.resolveURL('rest/alarms/count');

    const builder = OnmsHTTPOptions.newBuilder()
      .setTimeout(timeout)
      .setServer(server)
      .setHeader('Accept', 'text/plain');
    await httpImpl.get(infoUrl, builder.build());
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
  public static async getMetadata(server: OnmsServer, httpImpl?: IOnmsHTTP, timeout?: number): Promise<ServerMetadata> {
    if (!httpImpl) {
      if (!Client.defaultHttp) {
        throw new OnmsError('No HTTP implementation is configured!');
      }
      httpImpl = new Client.defaultHttp();
    }

    const infoUrl = server.resolveURL('rest/info');

    const builder = OnmsHTTPOptions.newBuilder()
      .setServer(server)
      .setTimeout(timeout)
      .setHeader('Accept', 'application/json');
    if (!timeout && httpImpl && httpImpl.options && httpImpl.options.timeout) {
      builder.setTimeout(httpImpl.options.timeout);
    }

    const response = await httpImpl.get(infoUrl, builder.build());
    const version = new OnmsVersion(response.data.version, response.data.displayVersion);
    let type = ServerTypes.HORIZON;
    if (response.data.packageName) {
      if (response.data.packageName.toLowerCase() === 'meridian') {
        type = ServerTypes.MERIDIAN;
      }
    }

    if (response.data.ticketerConfig) {
      const config = response.data.ticketerConfig;
      return new ServerMetadata(version, type, new TicketerConfig(config.plugin, config.enabled));
    }

    return new ServerMetadata(version, type);
  }

  /** The default OnmsHTTP implementation to be used when making requests */
  private static readonly defaultHttp = AxiosHTTP;

  /** the OnmsHTTP implementation that will be used when making requests */
  public http: IOnmsHTTP;

  /**
   * A cache of initialized DAOs, kept until server configuration changes
   * @hidden
   */
  private daos = new Map() as Map<string, BaseDAO>;

  /**
   * Construct a new OpenNMS client.
   *
   * If no `httpImpl` parameter is provided, the class in [[Client.defaultHttp]] will be used by default.
   * Unless overridden, this defaults to [[AxiosHTTP]].
   *
   * @constructor
   * @param httpImpl - The IOnmsHTTP implementation to use.
   */
  constructor(httpImpl?: IOnmsHTTP) {
    this.http = httpImpl || new Client.defaultHttp();
  }

  /**
   * Connect to an OpenNMS server.
   *
   * NOTE: This method will connect to the server using the provided
   * information, get the server metadata, and then _assign_ that
   * server to the _existing_ [[IOnmsHTTP]] implementation associated
   * with this client (or the default impl, if one has not yet been provided).
   */
  public async connect(name: string, url: string, username: string, password: string, timeout?: number) {
    const builder = OnmsServer.newBuilder()
      .setName(name)
      .setUrl(url)
      .setAuth(new OnmsAuthConfig(username, password));
    const testServer = builder.build();

    // first check the server; throws if it can't connect
    await Client.checkServer(testServer, this.http, timeout);

    // then retrieve the server metadata and update to the hydrated version of the server
    const metadata = await Client.getMetadata(testServer, this.http, timeout);
    this.http.server = builder.setMetadata(metadata).build();

    return this;
  }

  /** Get an alarm DAO for querying alarms. */
  public alarms(): AlarmDAO {
    return this.getDao('alarms', AlarmDAO) as AlarmDAO;
  }

  /** Get an event DAO for querying events. */
  public events() {
    return this.getDao('events', EventDAO) as EventDAO;
  }

  /** Get a node DAO for querying nodes. */
  public nodes() {
    return this.getDao('nodes', NodeDAO) as NodeDAO;
  }

  /** Get a flow DAO for querying flows. */
  public flows() {
    return this.getDao('flows', FlowDAO) as FlowDAO;
  }

  /** Get a situationFeedback DAO for submitting and querying correlation feedback. */
  public situationfeedback() {
    return this.getDao('situationfeedback', SituationFeedbackDAO) as SituationFeedbackDAO;
  }

  /**
   * A convenience method to validate cached DAOs and create them if they don't exist
   * @hidden
   * @param key a unique key used for caching the DAO
   * @param daoClass the DAO class to retrieve or create
   */
  private getDao(
    key: string,
    daoClass: typeof AlarmDAO | typeof EventDAO | typeof NodeDAO | typeof FlowDAO | typeof SituationFeedbackDAO,
  ) {
    const existing = this.daos.get(key);
    if (existing) {
      if (existing.server && existing.server.equals(this.http.server)) {
        return existing;
      }
    }
    const dao = new daoClass(this);
    dao.http = this.http;
    this.daos.set(key, dao);
    return dao;
  }
}
