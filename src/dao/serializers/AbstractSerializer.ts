import {IModelSerializer} from '../IModelSerializer';

import {ServerMetadata} from '../../api/ServerMetadata';

export abstract class AbstractSerializer<T> implements IModelSerializer<T> {
  /** The server metadata to use when marshalling and unmarshalling model objects. */
  protected metadata: ServerMetadata;

  constructor(metadata: ServerMetadata) {
    this.metadata = metadata;
  }

  public abstract fromJson(json): T;

  public abstract toJson(model: T): object;

  public abstract toXml(model: T): string;
}
