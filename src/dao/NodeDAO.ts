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
import {OnmsSnmpStatusType} from '../model/OnmsSnmpStatusType';
import {PhysAddr} from '../model/PhysAddr';

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
            const node = this.fromData(result.data);

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
      return this.getOptions(filter).then((opts) => {
        return this.http.get(this.pathToNodesEndpoint() + '/' + node + '/ipinterfaces', opts).then((result) => {
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
    return this.getOptions(filter).then((opts) => {
        return this.http.get(this.pathToNodesEndpoint() + '/' + node + '/snmpinterfaces', opts).then((result) => {
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

    return this.getOptions(filter).then((opts) => {
        if (ipInterface instanceof OnmsIpInterface && ipInterface.ipAddress) {
            ipInterface = ipInterface.ipAddress.address;
        }
        const url = this.pathToNodesEndpoint() + '/' + node + '/ipinterfaces/' + ipInterface + '/services';
        return this.http.get(url, opts).then((result) => {
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
  public fromData(data: any): OnmsNode {
    const node = new OnmsNode();

    node.id = this.toNumber(data.id);
    node.label = data.label;
    node.location = data.location;
    node.foreignSource = data.foreignSource || undefined;
    node.foreignId = data.foreignId || undefined;
    node.sysContact = data.sysContact;
    node.sysDescription = data.sysDescription;
    node.sysLocation = data.sysLocation;
    node.sysName = data.sysName;
    node.sysObjectId = data.sysObjectId;

    if (data.labelSource) {
      node.labelSource = OnmsNodeLabelSource.forId(data.labelSource);
    }
    if (data.createTime) {
      node.createTime = this.toDate(data.createTime);
    }
    if (data.lastCapsdPoll) {
      node.lastCapsdPoll = this.toDate(data.lastCapsdPoll);
    }
    if (data.type) {
      node.type = OnmsNodeType.forId(data.type);
    }

    node.categories = [];
    if (data.categories) {
      node.categories = data.categories.map((c: any) => {
        return OnmsCategory.for(c.id, c.name);
      });
    }

    for (const key in data.assetRecord) {
      if (data.assetRecord.hasOwnProperty(key)
        && data.assetRecord[key] !== null
        && data.assetRecord[key] !== undefined) {
        node.assets[key] = data.assetRecord[key];
      }
    }

    return node;
  }

  /**
   * create an IP interface object from a JSON object
   * @hidden
   */
  public fromIpInterfaceData(data: any): OnmsIpInterface {
    const iface = new OnmsIpInterface();

    iface.id = this.toNumber(data.id);
    iface.hostname = data.hostName || data.hostname;
    iface.ipAddress = Util.toIPAddress(data.ipAddress);
    iface.isManaged = OnmsManagedType.forId(data.isManaged);
    iface.lastCapsdPoll = this.toDate(data.lastCapsdPoll);
    iface.snmpPrimary = OnmsPrimaryType.forId(data.snmpPrimary);

    if (data.snmpInterface && data.snmpInterface.id) {
      iface.snmpInterfaceId = this.toNumber(data.snmpInterface.id);
    }

    return iface;
  }

  /**
   * create an SNMP interface object from a JSON object
   * @hidden
   */
  public fromSnmpData(data: any): OnmsSnmpInterface {
    const iface = new OnmsSnmpInterface();

    iface.id = this.toNumber(data.id);
    iface.ifIndex = this.toNumber(data.ifIndex);
    iface.ifDescr = data.ifDescr;
    iface.ifType = this.toNumber(data.ifType);
    iface.ifName = data.ifName;
    iface.ifSpeed = this.toNumber(data.ifSpeed);
    iface.ifAdminStatus = OnmsSnmpStatusType.forId(this.toNumber(data.ifAdminStatus));
    iface.ifOperStatus = OnmsSnmpStatusType.forId(this.toNumber(data.ifOperStatus));
    iface.ifAlias = data.ifAlias;
    iface.lastCapsdPoll = this.toDate(data.lastCapsdPoll);
    iface.collect = OnmsCollectType.forId(data.collectFlag);
    iface.poll = data.poll;
    iface.lastSnmpPoll = this.toDate(data.lastSnmpPoll);

    if (data.physAddr) {
      iface.physAddr = new PhysAddr(data.physAddr);
    }

    return iface;
  }

  /**
   * create a monitored service object from a JSON object
   * @hidden
   */
  public fromServiceData(data: any): OnmsMonitoredService {
    const service = new OnmsMonitoredService();

    service.id = this.toNumber(data.id);
    service.lastFail = this.toDate(data.lastFail);
    service.lastGood = this.toDate(data.lastGood);

    if (data.serviceType) {
      service.type = OnmsServiceType.for(data.serviceType.id, data.serviceType.name);
    }
    if (data.status) {
      service.status = OnmsServiceStatusType.forId(data.status);
    }

    return service;
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
