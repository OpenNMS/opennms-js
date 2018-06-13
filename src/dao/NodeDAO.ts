import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Util} from '../internal/Util';

import {OnmsCategory} from '../model/OnmsCategory';
import {OnmsCollectType} from '../model/OnmsCollectType';
import {OnmsIpInterface} from '../model/OnmsIpInterface';
import {OnmsManagedType} from '../model/OnmsManagedType';
import {OnmsMonitoredService} from '../model/OnmsMonitoredService';
import {OnmsNode} from '../model/OnmsNode';
import {OnmsNodeLabelSource} from '../model/OnmsNodeLabelSource';
import {OnmsNodeType} from '../model/OnmsNodeType';
import {OnmsPrimaryType} from '../model/OnmsPrimaryType';
import {OnmsServiceType} from '../model/OnmsServiceType';
import {OnmsServiceStatusType} from '../model/OnmsServiceStatusType';
import {OnmsSnmpInterface} from '../model/OnmsSnmpInterface';
import {OnmsSnmpStatusType, SnmpStatusTypes} from '../model/OnmsSnmpStatusType';
import {PhysAddr} from '../model/PhysAddr';

import {NodeSerializer} from './serializers/NodeSerializer';
import {IpInterfaceSerializer} from './serializers/IpInterfaceSerializer';
import {SnmpInterfaceSerializer} from './serializers/SnmpInterfaceSerializer';
import {MonitoredServiceSerializer} from './serializers/MonitoredServiceSerializer';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('nodes', catDao);

/**
 * Data access for [[OnmsNode]] objects.
 * @module NodeDAO
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
    return this.getOptions().then((opts) => {
        return this.http.get(this.pathToNodesEndpoint() + '/' + id, opts).then((result) => {
            const serializer = new NodeSerializer(this.getServerMetadata());
            const node = serializer.fromJson(result.data);

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
    return this.getOptions(filter).then((opts) => {
        return this.http.get(this.pathToNodesEndpoint(), opts).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data) > 0 && data.node) {
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
            const serializer = new NodeSerializer(this.getServerMetadata());
            return data.map((nodeData) => {
              return serializer.fromJson(nodeData);
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
  public async ipInterfaces(node: number | OnmsNode, filter?: Filter): Promise<OnmsIpInterface[]> {
      if (node instanceof OnmsNode) {
          node = node.id;
      }
      return this.getOptions(filter).then((opts) => {
        return this.http.get(this.pathToNodesEndpoint() + '/' + node + '/ipinterfaces', opts).then((result) => {
            let data = result.data;

            if (this.getCount(data) > 0 && data.ipInterface) {
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
            const serializer = new IpInterfaceSerializer(this.getServerMetadata());
            return data.map((ifaceData) => {
                return serializer.fromJson(ifaceData);
            });
        });
    });
  }

  /** Given a node, get the SNMP interfaces for that node. */
  public async snmpInterfaces(node: number | OnmsNode, filter?: Filter): Promise<OnmsSnmpInterface[]> {
    return this.getOptions(filter).then((opts) => {
        if (node instanceof OnmsNode) {
            node = node.id;
        }
        return this.http.get(this.pathToNodesEndpoint() + '/' + node + '/snmpinterfaces', opts).then((result) => {
            let data = result.data;

            if (this.getCount(data) > 0 && data.snmpInterface) {
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
            const serializer = new SnmpInterfaceSerializer(this.getServerMetadata());
            return data.map((ifaceData) => {
                return serializer.fromJson(ifaceData);
            });
        });
    });
  }

  /** Given a node, get the IP interfaces for that node. */
  public async services(
    node: number | OnmsNode,
    ipInterface: string | OnmsIpInterface,
    filter?: Filter,
  ): Promise<OnmsMonitoredService[]> {

    return this.getOptions(filter).then((opts) => {
        if (node instanceof OnmsNode) {
            node = node.id;
        }
        if (ipInterface instanceof OnmsIpInterface && ipInterface.ipAddress) {
            ipInterface = ipInterface.ipAddress.address;
        }
        const url = this.pathToNodesEndpoint() + '/' + node + '/ipinterfaces/' + ipInterface + '/services';
        return this.http.get(url, opts).then((result) => {
            let data = result.data;

            if (this.getCount(data) > 0 && data.service) {
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
            const serializer = new MonitoredServiceSerializer(this.getServerMetadata());
            return data.map((ifaceData) => {
                return serializer.fromJson(ifaceData);
            });
        });
    });
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
   * Get the path to the nodes endpoint for the appropriate API version.
   * @hidden
   */
  private pathToNodesEndpoint() {
    return this.getApiVersion() === 2 ? 'api/v2/nodes' : 'rest/nodes';
  }
}
