
/**
 * Represents an enumerated type.
 * @module OnmsEnum
 */ /** */
export class OnmsEnum {
  /** the internal index/id */
  private i: number;

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
  constructor(id: number, label: string) {
    this.i = id;
    this.l = label;
    Object.freeze(this);
  }

  /** convert to the JSON representation */
  public toJSON() {
    return {
      id: this.i,
      label: this.l,
    };
  }
}
