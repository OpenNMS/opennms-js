import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import { OnmsSnmpInterface } from '../model/OnmsSnmpInterface';
/**
 * Data access for [[OnmsSnmpInterface]] objects.
 * @category DAO
 */
export class SnmpInterfaceDAO extends AbstractDAO<number, OnmsSnmpInterface> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Get an SNMP interface, given the interface's ID.
   *
   * @param id - The interface's ID.
   */
  public async get(id: number): Promise<OnmsSnmpInterface> {
    this.assertV2();
    return this.getOptions().then((builder) => {
        return this.http.get(this.getRoot() + '/' + id, builder.build()).then((result) => {
            const node = OnmsSnmpInterface.fromData(result.data);

            if (!node) {
              throw new OnmsError(`SnmpInterfaceDAO.get id={id} ReST request succeeded, but did not return a valid node.`);
            }

            return node;
        });
    });
  }

  /** Search for SNMP interfaces, given an optional filter. */
  public async find(filter?: Filter): Promise<OnmsSnmpInterface[]> {
    this.assertV2();
    return this.getOptions(filter).then((builder) => {
        return this.http.get(this.getRoot(), builder.build()).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data, result.code) > 0 && data.snmpInterface) {
                data = data.snmpInterface;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of SNMP interfaces but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((ifaceData: any) => {
                return OnmsSnmpInterface.fromData(ifaceData);
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
   * The root of the SnmpInterfaces ReST API.
   * @hidden
   */
  private getRoot() {
    return 'api/v2/snmpinterfaces';
  }

  /**
   * Make sure v2 is supported.
   * @hidden
   */
   private assertV2() {
    if (this.getApiVersion() < 2) {
      throw new OnmsError('The SNMP interface ReST API is only available on v2.');
    }
  }
}
