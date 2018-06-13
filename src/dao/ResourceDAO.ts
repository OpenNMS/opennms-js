import {AbstractDAO} from './AbstractDAO';

import {Filter} from '../api/Filter';
import {IHasHTTP} from '../api/IHasHTTP';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';

import {Util} from '../internal/Util';

import {OnmsResource} from '../model/OnmsResource';

import {ResourceSerializer} from './serializers/ResourceSerializer';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/** @hidden */
const cat = new Category('resources', catDao);

/**
 * Data access for [[OnmsResource]] objects.
 * @module ResourceDAO
 */
export class ResourceDAO extends AbstractDAO<string, OnmsResource> {
  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Retrieve a resource given its ID.
   *
   * @param id The resource ID.
   */
  public async get(id: string, depth?: number): Promise<OnmsResource> {
    return this.getOptions().then((opts) => {
      if (depth) {
        opts.parameters.depth = String(depth);
      }
      return this.http.get('rest/resources/' + id, opts).then((result) => {
        const serializer = new ResourceSerializer(this.getServerMetadata());
        return serializer.fromJson(result.data);
      });
    });
  }

  /**
   * Retrieve a node resource and its children, given the node's ID.
   *
   * @param nodeId The node's ID.
   */
  public async getNode(nodeId: number|string, depth?: number): Promise<OnmsResource> {
    return this.getOptions().then((opts) => {
      if (depth) {
        opts.parameters.depth = String(depth);
      }
      return this.http.get('rest/resources/fornode/' + nodeId, opts).then((result) => {
        const serializer = new ResourceSerializer(this.getServerMetadata());
        return serializer.fromJson(result.data);
      });
    });
  }

  /**
   * Get all resources.  NOTE: potentially very slow!
   * It is strongly recommended that you retrieve resources by ID or node instead.
   *
   * @param filter Ignored. The resources API does not support filtering for the resource list query.
   */
  public async find(filter?: Filter): Promise<OnmsResource[]> {
    if (filter) {
      log.warn('Unable to filter resources. All resources will be returned.', cat);
    }
    return this.getOptions().then((opts) => {
        return this.http.get('rest/resources', opts).then((result) => {
            let data = result.data;

            if (data !== null && this.getCount(data) > 0 && data.resource) {
                data = data.resource;
            } else {
                data = [];
            }

            if (!Array.isArray(data)) {
                if (data.id) {
                    data = [data];
                } else {
                    throw new OnmsError('Expected an array of resources but got "' + (typeof data) + '" instead.');
                }
            }
            const serializer = new ResourceSerializer(this.getServerMetadata());
            return data.map((resourceData) => {
              return serializer.fromJson(resourceData);
            });
        });
    });
  }

  /**
   * The path to the resource search properties endpoint.
   */
  protected searchPropertyPath(): string {
    throw new OnmsError('Search properties are not supported for resources.');
  }
}
