
/**
 * Represents an enumerated type.
 * @module OnmsEnum
 */ /** */
export class OnmsEnum<T> {
  /** the internal index/id */
  private i: T;

  /** the type/label */
  private l: string;

  /** get the index/id of this enum entry */
  get id() {
    return this.i;
  }

  /** an alias for {@link #id} */
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
    };
  }
}

/** convenience function for implementing id-based lookup in enums */
/** @hidden */
export function forId(collection: any, id: any) {
  for (const type in collection) {
    if (collection.hasOwnProperty(type)) {
      const collectionId = collection[type].id;
      if (('' + collectionId) === ('' + id)) {
        return collection[type];
      }
    }
  }
  return undefined;
}

/** convenience function for implementing label-based lookup in enums */
/** @hidden */
export function forLabel(collection: any, label: string) {
  for (const type in collection) {
    if (collection.hasOwnProperty(type)) {
      const collectionLabel = collection[type].label;
      if (collectionLabel && collectionLabel.toLowerCase() === label.toLowerCase()) {
        return collection[type];
      }
    }
  }
  return undefined;
}
