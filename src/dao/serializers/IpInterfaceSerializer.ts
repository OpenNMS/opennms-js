import {AbstractSerializer} from './AbstractSerializer';

import {OnmsIpInterface} from '../../model/OnmsIpInterface';
import {OnmsManagedType} from '../../model/OnmsManagedType';
import {OnmsPrimaryType} from '../../model/OnmsPrimaryType';

import {Util} from '../../internal/Util';

export class IpInterfaceSerializer extends AbstractSerializer<OnmsIpInterface> {
  public fromJson(json): OnmsIpInterface {
    if (!json) {
      return null;
    }

    const iface = new OnmsIpInterface();
    iface.id = Util.toNumber(json.id);
    iface.hostname = json.hostName || json.hostname;
    iface.ipAddress = Util.toIPAddress(json.ipAddress);
    iface.isManaged = OnmsManagedType.forId(json.isManaged);
    iface.lastCapsdPoll = Util.toMoment(json.lastCapsdPoll);
    iface.snmpPrimary = OnmsPrimaryType.forId(json.snmpPrimary);

    if (json.snmpInterface && json.snmpInterface.id) {
      iface.snmpInterfaceId = Util.toNumber(json.snmpInterface.id);
    }

    return iface;
  }

  public toJson(model): object {
    if (!model) {
      return null;
    }
    return {};
  }

  public toXml(model): string {
    if (!model) {
      return null;
    }
    return '';
  }

}
