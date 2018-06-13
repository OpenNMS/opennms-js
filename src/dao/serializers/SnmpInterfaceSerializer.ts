import {AbstractSerializer} from './AbstractSerializer';

import {OnmsSnmpInterface} from '../../model/OnmsSnmpInterface';
import {OnmsSnmpStatusType} from '../../model/OnmsSnmpStatusType';
import {OnmsCollectType} from '../../model/OnmsCollectType';
import {PhysAddr} from '../../model/PhysAddr';

import {Util} from '../../internal/Util';

export class SnmpInterfaceSerializer extends AbstractSerializer<OnmsSnmpInterface> {
  public fromJson(json): OnmsSnmpInterface {
    if (!json) {
      return null;
    }

    const iface = new OnmsSnmpInterface();

    iface.id = Util.toNumber(json.id);
    iface.ifIndex = Util.toNumber(json.ifIndex);
    iface.ifDescr = json.ifDescr;
    iface.ifType = Util.toNumber(json.ifType);
    iface.ifName = json.ifName;
    iface.ifSpeed = Util.toNumber(json.ifSpeed);
    iface.ifAdminStatus = OnmsSnmpStatusType.forId(Util.toNumber(json.ifAdminStatus));
    iface.ifOperStatus = OnmsSnmpStatusType.forId(Util.toNumber(json.ifOperStatus));
    iface.ifAlias = json.ifAlias;
    iface.lastCapsdPoll = Util.toMoment(json.lastCapsdPoll);
    iface.collect = OnmsCollectType.forId(json.collectFlag);
    iface.poll = json.poll;
    iface.lastSnmpPoll = Util.toMoment(json.lastSnmpPoll);

    if (json.physAddr) {
      iface.physAddr = new PhysAddr(json.physAddr);
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
