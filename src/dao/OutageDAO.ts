import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import { OnmsOutage } from '../model/OnmsOutage';

/**
 * Data access for [[OnmsOutage]] objects.
 * @category DAO
 */
export class OutageDAO extends AbstractDAO<number, OnmsOutage> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Get an outage, given the outage's ID.
   *
   * @param id - The outage's ID.
   */
  public async get(id: number): Promise<OnmsOutage> {
    this.assertV2();
    return this.getOptions().then((builder) => {
        return this.http.get(this.getRoot() + '/' + id, builder.build()).then((result) => {
            const node = OnmsOutage.fromData(result.data);

            if (!node) {
              throw new OnmsError(`OutageDAO.get id={id} ReST request succeeded, but did not return a valid node.`);
            }

            return node;
        });
    });
  }

  /** Search for outages, given an optional filter. */
  public async find(filter?: Filter): Promise<OnmsOutage[]> {
    this.assertV2();
    return this.getOptions(filter).then((builder) => {
        return this.http.get(this.getRoot(), builder.build()).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data, result.code) > 0 && data.outage) {
                data = data.outage;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of outages but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((outageData: any) => {
                return OnmsOutage.fromData(outageData);
            });
        });
    });
  }

  /**
   * The path to the interface search properties endpoint.
   */
  protected searchPropertyPath(): string {
    return this.getRoot() + '/properties';
  }

  /**
   * The root of the outage ReST API.
   * @hidden
   */
  private getRoot() {
    return 'api/v2/outages';
  }

  /**
   * Make sure v2 is supported.
   * @hidden
   */
   private assertV2() {
    if (this.getApiVersion() < 2) {
      throw new OnmsError('The outage ReST API is only available on v2.');
    }
  }
}
