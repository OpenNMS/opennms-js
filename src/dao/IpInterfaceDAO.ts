import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import { OnmsIpInterface } from '../model/OnmsIpInterface';

/**
 * Data access for [[OnmsIpInterface]] objects.
 * @category DAO
 */
export class IpInterfaceDAO extends AbstractDAO<number, OnmsIpInterface> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Get an IP interface, given the interface's ID.
   *
   * @param id - The interface's ID.
   */
  public async get(id: number): Promise<OnmsIpInterface> {
    this.assertV2();
    return this.getOptions().then((builder) => {
        return this.http.get(this.getRoot() + '/' + id, builder.build()).then((result) => {
            const node = OnmsIpInterface.fromData(result.data);

            if (!node) {
              throw new OnmsError(`IpInterfaceDAO.get id={id} ReST request succeeded, but did not return a valid node.`);
            }

            return node;
        });
    });
  }

  /** Search for IP interfaces, given an optional filter. */
  public async find(filter?: Filter): Promise<OnmsIpInterface[]> {
    this.assertV2();
    return this.getOptions(filter).then((builder) => {
        return this.http.get(this.getRoot(), builder.build()).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data, result.code) > 0 && data.ipInterface) {
                data = data.ipInterface;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of IP interfaces but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((ifaceData: any) => {
                return OnmsIpInterface.fromData(ifaceData);
            });
        });
    });
  }

  /**
   * The path to the node search properties endpoint.
   */
  protected searchPropertyPath(): string {
    return this.getRoot() + '/properties';
  }

  /**
   * The root of the IpInterfaces ReST API.
   * @hidden
   */
  private getRoot() {
    return 'api/v2/ipinterfaces';
  }

  /**
   * Make sure v2 is supported.
   * @hidden
   */
   private assertV2() {
    if (this.getApiVersion() < 2) {
      throw new OnmsError('The IP interface ReST API is only available on v2.');
    }
  }
}
