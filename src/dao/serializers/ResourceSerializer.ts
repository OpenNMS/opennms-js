import {AbstractSerializer} from './AbstractSerializer';

import {OnmsResource} from '../../model/OnmsResource';
import {RrdGraphAttribute} from '../../model/RrdGraphAttribute';

import {Util} from '../../internal/Util';

import {log, catDao} from '../../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('resource-serializer', catDao);

export class ResourceSerializer extends AbstractSerializer<OnmsResource> {
  public fromJson(json): OnmsResource {
    if (!json) {
      return null;
    }

    const resource = new OnmsResource();
    resource.id = json.id;
    resource.label = json.label;
    resource.name = json.name;
    resource.typeLabel = json.typeLabel;
    resource.link = json.link;
    resource.parentId = json.parentId;

    // TODO: handle the XML version
    if (json.children) {
      let children = json.children;
      if (children.resource && children.resource.length >= 0) {
        children = children.resource;
      }
      if (children && children.length > 0) {
        resource.children = children.map((child) => this.fromJson(child));
      } else if (children && children.length === 0) {
        // don't bother creating an empty 'children' attribute
      } else {
        log.debug('no match for child object: ' + JSON.stringify(children), cat);
      }
    }

    if (json.stringPropertyAttributes) {
      resource.stringPropertyAttributes = Object.assign(json.stringPropertyAttributes);
    }
    if (json.externalValueAttributes) {
      resource.externalValueAttributes = Object.assign(json.externalValueAttributes);
    }
    if (json.rrdGraphAttributes && json.rrdGraphAttributes.length > 0) {
      resource.rrdGraphAttributes = json.rrdGraphAttributes.map((attr) => attr as RrdGraphAttribute);
    }

    return resource;
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
