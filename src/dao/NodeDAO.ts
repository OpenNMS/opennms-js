import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {OnmsIpInterface} from '../model/OnmsIpInterface';
import {OnmsMonitoredService} from '../model/OnmsMonitoredService';
import {OnmsNode} from '../model/OnmsNode';
import {OnmsSnmpInterface} from '../model/OnmsSnmpInterface';

/**
 * Data access for [[OnmsNode]] objects.
 * @category DAO
 */
export class NodeDAO extends AbstractDAO<number, OnmsNode> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Get an node, given the node's ID.
   *
   * @param id - The node's ID.
   * @param recurse - Optionally fetch all sub-model objects. (ipInterface, etc.)
   */
  public async get(id: number, recurse = false): Promise<OnmsNode> {
    return this.getOptions().then((builder) => {
        return this.http.get(this.pathToNodesEndpoint() + '/' + id, builder.build()).then((result) => {
            const node = this.fromData(result.data);

            if (!node) {
              throw new OnmsError(`NodeDAO.get id={id} ReST request succeeded, but did not return a valid node.`);
            }

            if (recurse) {
                return this.fetch(node);
            } else {
                return node;
            }
        });
    });
  }

  /** Search for nodes, given an optional filter. */
  public async find(filter?: Filter): Promise<OnmsNode[]> {
    return this.getOptions(filter).then((builder) => {
        return this.http.get(this.pathToNodesEndpoint(), builder.build()).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data, result.code) > 0 && data.node) {
                data = data.node;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of nodes but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((nodeData: any) => {
                return this.fromData(nodeData);
            });
        });
    });
  }

  /** Given a node, fetch all the sub-model objects for that node. (ipInterfaces, snmpInterfaces, etc.) */
  public async fetch(node: OnmsNode): Promise<OnmsNode> {
    return this.snmpInterfaces(node).then((si) => {
      node.snmpInterfaces = si;
      si.forEach((iface) => {
        iface.node = node;
      });
      return this.ipInterfaces(node).then((ifaces) => {
        node.ipInterfaces = ifaces;
        ifaces.forEach((iface) => {
          iface.node = node;
        });
        return Promise.all(ifaces.map((iface) => {
          return this.services(node, iface).then((services) => {
            iface.services = services;
            services.forEach((service) => {
              service.node = node;
              service.ipInterface = iface;
            });
          });
        })).then(() => {
          return node;
        });
      });
    });
  }

  /** Given a node, get the IP interfaces for that node. */
  public async ipInterfaces(passedNode: number | OnmsNode, filter?: Filter): Promise<OnmsIpInterface[]> {
      let node: string;
      if (passedNode instanceof OnmsNode) {
          node = String(passedNode.id);
      } else {
        node = String(passedNode);
      }
      return this.getOptions(filter).then((builder) => {
        return this.http.get(
            this.pathToNodesEndpoint() + '/' + node + '/ipinterfaces',
            builder.build(),
        ).then((result) => {
            let data = result.data;

            if (this.getCount(data, result.code) > 0 && data.ipInterface) {
                data = data.ipInterface;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.nodeId) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of IP interfaces but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((ifaceData: any) => {
                return this.fromIpInterfaceData(ifaceData);
            });
        });
    });
  }

  /** Given a node, get the SNMP interfaces for that node. */
  public async snmpInterfaces(passedNode: number | OnmsNode, filter?: Filter): Promise<OnmsSnmpInterface[]> {
    const node = String(this.getNodeId(passedNode));
    return this.getOptions(filter).then((builder) => {
        return this.http.get(
            this.pathToNodesEndpoint() + '/' + node + '/snmpinterfaces',
            builder.build(),
        ).then((result) => {
            let data = result.data;

            if (this.getCount(data, result.code) > 0 && data.snmpInterface) {
                data = data.snmpInterface;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.ifName) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of SNMP interfaces but got "'
                        + (typeof data) + '" instead.');
                }
            }
            return data.map((ifaceData: any) => {
                return this.fromSnmpData(ifaceData);
            });
        });
    });
  }

  /** Given a node, get the IP interfaces for that node. */
  public async services(
    passedNode: number | OnmsNode,
    ipInterface: string | OnmsIpInterface,
    filter?: Filter,
  ): Promise<OnmsMonitoredService[]> {
    const node = String(this.getNodeId(passedNode));

    return this.getOptions(filter).then((builder) => {
        if (ipInterface instanceof OnmsIpInterface && ipInterface.ipAddress) {
            ipInterface = ipInterface.ipAddress.address;
        }
        const url = this.pathToNodesEndpoint() + '/' + node + '/ipinterfaces/' + ipInterface + '/services';
        return this.http.get(url, builder.build()).then((result) => {
            let data = result.data;

            if (this.getCount(data, result.code) > 0 && data.service) {
                data = data.service;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.lastGood) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of services but got "' + (typeof data) + '" instead.');
                }
            }
            return data.map((ifaceData: any) => {
                return this.fromServiceData(ifaceData);
            });
        });
    });
  }

  /**
   * Create a node object from a JSON object.
   * @hidden
   */
  public fromData(data: any) {
    return OnmsNode.fromData(data);
  }

  /**
   * create an IP interface object from a JSON object
   * @hidden
   */
  public fromIpInterfaceData(data: any): OnmsIpInterface {
    return OnmsIpInterface.fromData(data);
  }

  /**
   * create an SNMP interface object from a JSON object
   * @hidden
   */
  public fromSnmpData(data: any): OnmsSnmpInterface {
    return OnmsSnmpInterface.fromData(data);
  }

  /**
   * create a monitored service object from a JSON object
   * @hidden
   */
  public fromServiceData(data: any): OnmsMonitoredService {
    return OnmsMonitoredService.fromData(data);
  }

  /**
   * The path to the node search properties endpoint.
   */
  protected searchPropertyPath(): string {
    if (this.getApiVersion() < 2) {
      throw new OnmsError('Search properties are not supported in Node ReSTv1.');
    }
    return this.pathToNodesEndpoint() + '/properties';
  }

  /**
   * Get the node's ID
   * @param node the node
   */
  private getNodeId(node: number | OnmsNode): number | undefined {
    if (node instanceof OnmsNode) {
      return node.id;
    }
    return node;
  }

  /**
   * Get the path to the nodes endpoint for the appropriate API version.
   * @hidden
   */
  private pathToNodesEndpoint() {
    return this.getApiVersion() === 2 ? 'api/v2/nodes' : 'rest/nodes';
  }
}
