import {AbstractSerializer} from './AbstractSerializer';

import {OnmsMonitoredService} from '../../model/OnmsMonitoredService';
import {OnmsServiceType} from '../../model/OnmsServiceType';
import {OnmsServiceStatusType} from '../../model/OnmsServiceStatusType';

import {Util} from '../../internal/Util';

export class MonitoredServiceSerializer extends AbstractSerializer<OnmsMonitoredService> {
  public fromJson(json): OnmsMonitoredService {
    if (!json) {
      return null;
    }

    const service = new OnmsMonitoredService();

    service.id = Util.toNumber(json.id);
    service.lastFail = Util.toMoment(json.lastFail);
    service.lastGood = Util.toMoment(json.lastGood);

    if (json.serviceType) {
      service.type = OnmsServiceType.for(json.serviceType.id, json.serviceType.name);
    }
    if (json.status) {
      service.status = OnmsServiceStatusType.forId(json.status);
    }

    return service;
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
