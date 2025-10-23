import { toJsonAwareReplace } from '../api/objUtils';

/**
 * Represents an enumerated type.
 * @category Internal
 */
export class OnmsEnum<T> {
  /** the internal index/id */
  private readonly i: T;

  /** the type/label */
  private readonly l: string;

  /** get the index/id of this enum entry */
  get id() {
    return this.i;
  }

  /** an alias for [[OnmsEnum.id]] */
  get index() {
    return this.i;
  }

  /** get the label of this enum entry */
  get label() {
    return this.l;
  }

  /** construct an enum object with an id and label */
  constructor(id: T, label: string) {
    this.i = id;
    this.l = label;
  }

  /** convert this enum to a string suitable for display */
  public toDisplayString() {
    return this.l.charAt(0).toUpperCase() + this.l.slice(1).toLowerCase();
  }

  /** convert this enum to a string */
  public toString() {
    return this.i;
  }

  /** convert to the JSON representation */
  public toJSON() {
    return {
      id: this.i,
      label: this.l,
      replace: this.replace
    };
  }

  public replace(pattern: RegExp | string, replaceWith: string) {
    return toJsonAwareReplace(this, pattern, replaceWith);
  }
}

/** convenience function for implementing id-based lookup in enums */
/** @hidden */
export function forId(collection: any, id?: any) {
  if (id || (!isNaN(id) && Number.parseInt(id, 10) >= 0)) {
    for (const type in collection) {
      if (collection.hasOwnProperty(type)) {
        const collectionId = collection[type].id;
        if (('' + collectionId) === ('' + id)) {
          return collection[type];
        }
      }
    }
  }
  return undefined;
}

/** convenience function for implementing label-based lookup in enums */
/** @hidden */
export function forLabel(collection: any, label?: string) {
  if (label) {
    for (const type in collection) {
      if (collection.hasOwnProperty(type)) {
        const collectionLabel = collection[type].label;
        if (collectionLabel && collectionLabel.toLowerCase() === label.toLowerCase()) {
          return collection[type];
        }
      }
    }
  }
  return undefined;
}
