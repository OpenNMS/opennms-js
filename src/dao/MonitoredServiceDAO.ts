import { AbstractDAO } from './AbstractDAO';

import { Filter } from '../api/Filter';
import { IHasHTTP } from '../api/IHasHTTP';
import { IOnmsHTTP } from '../api/IOnmsHTTP';
import { OnmsError } from '../api/OnmsError';

import { OnmsMonitoredService } from '../model/OnmsMonitoredService';

/**
 * Data access for [[OnmsMonitoredService]] objects.
 * @category DAO
 */
export class MonitoredServiceDAO extends AbstractDAO<number, OnmsMonitoredService> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Get monitored service, given the service's ID.
   *
   * @param id - The service's ID.
   */
  public async get(id: number): Promise<OnmsMonitoredService> {
    this.assertV2();
    return this.getOptions().then((builder) => {
        return this.http.get(this.getRoot() + '/' + id, builder.build()).then((result) => {
            const node = OnmsMonitoredService.fromData(result.data);

            if (!node) {
              throw new OnmsError(`MonitoredServiceDAO.get id={id} ReST request succeeded, but did not return a valid node.`);
            }

            return node;
        });
    });
  }

  /** Search for services, given an optional filter. */
  public async find(filter?: Filter): Promise<OnmsMonitoredService[]> {
    this.assertV2();
    return this.getOptions(filter).then((builder) => {
        return this.http.get(this.getRoot(), builder.build()).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data, result.code) > 0 && data.service) {
                data = data.service;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of monitored services but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((serviceData: any) => {
                return OnmsMonitoredService.fromData(serviceData);
            });
        });
    });
  }

  /**
   * The path to the service search properties endpoint.
   */
  protected searchPropertyPath(): string {
    return this.getRoot() + '/properties';
  }

  /**
   * The root of the service ReST API.
   * @hidden
   */
  private getRoot() {
    return 'api/v2/ifservices';
  }

  /**
   * Make sure v2 is supported.
   * @hidden
   */
   private assertV2() {
    if (this.getApiVersion() < 2) {
      throw new OnmsError('The monitored service ReST API is only available on v2.');
    }
  }
}
