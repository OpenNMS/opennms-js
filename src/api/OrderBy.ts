// tslint:disable:max-classes-per-file

import {forLabel, OnmsEnum} from '../internal/OnmsEnum';

/**
 * Represents a sort order.
 * @category Filtering API
 */
export class Order extends OnmsEnum<string> {
  /** Given a label ('ASC', 'DESC'), return the corresponding order. */
  public static forLabel(label: string) {
    return forLabel(Orders, label);
  }

  /** Whether this order matches the given order string. */
  public matches(label: string) {
    return (label.toLowerCase() === this.label.toLowerCase());
  }
}

const Orders = {
  ASC: new Order('ASC', 'ASC'),
  DESC: new Order('DESC', 'DESC'),
};
const frozen = Object.freeze(Orders);
export {frozen as Orders};

/**
 * Column ordering.
 * @category Filtering API
 */
export class OrderBy {
  /** given an OrderBy JSON structure, return an OrderBy object */
  public static fromJson(orderBy: any): OrderBy|undefined {
    if (orderBy && orderBy.attribute) {
      return new OrderBy(orderBy.attribute, Order.forLabel(orderBy.order.label));
    }
    return undefined;
  }

  /** the attribute to order by */
  public readonly attribute: string;

  /** the order to sort */
  public readonly order: Order;

  public constructor(attribute: string, order?: Order) {
    this.attribute = attribute;
    this.order = order || Orders.ASC;
  }
}
