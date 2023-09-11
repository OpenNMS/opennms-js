/* eslint-disable max-classes-per-file */

import {forLabel, OnmsEnum} from '../internal/OnmsEnum';
import {log} from './Log';

/**
 * Represents a sort order.
 * @category Filtering
 */
export class Order extends OnmsEnum<string> {
  /** Given a label ('ASC', 'DESC'), return the corresponding order. */
  public static forLabel(label: string) {
    return forLabel(Orders, label);
  }

  /** given an order spec (`order=DESC`), return an [[Order]] object */
  public static fromString(order: string): Order|undefined {
    const chunks = order.split(/\s*=\s*/);
    if (chunks.length !== 2 || chunks[0].toLowerCase() !== 'order') {
      log.warn('Order.fromString(' + order + '): invalid format. expected: "order=DESC|ASC" or "order DESC|ASC"');
      return undefined;
    }
    return Order.forLabel(chunks[1]);
  }

  /** Whether this order matches the given order string. */
  public matches(label: string) {
    return (label.toLowerCase() === this.label.toLowerCase());
  }
}

/**
 * Constant references to all OrderBy types.
 * @category Filtering
 */
export const Orders = {
  ASC: new Order('ASC', 'ASC'),
  DESC: new Order('DESC', 'DESC'),
};
Object.freeze(Orders);

/**
 * Column ordering.
 * @category Filtering
 */
export class OrderBy {
  /** given an OrderBy JSON structure, return an [[OrderBy]] object */
  public static fromJson(orderBy: any): OrderBy|undefined {
    if (orderBy && orderBy.attribute) {
      return new OrderBy(orderBy.attribute, Order.forLabel(orderBy.order.label));
    }
    return undefined;
  }

  /** given an orderBy spec (`orderBy=attribute`), return an [[OrderBy]] object */
  public static fromString(order: string): OrderBy|undefined {
    const chunks = order.split(/\s*=\s*/);
    if (chunks.length !== 2 || chunks[0].toLowerCase() !== 'orderby') {
      log.warn('OrderBy.fromString(' + order + '): invalid format. expected: "orderBy=foo" or "orderBy foo"');
      return undefined;
    }
    return new OrderBy(chunks[1]);
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
