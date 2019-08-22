import {IHash} from '../internal/IHash';
import {Util} from '../internal/Util';

import {IFilterProcessor} from '../api/IFilterProcessor';

import {Filter} from '../api/Filter';
import {Comparator, Comparators} from '../api/Comparator';
import {Restriction} from '../api/Restriction';
import {NestedRestriction} from '../api/NestedRestriction';
import {OnmsError} from '../api/OnmsError';
import {Operator, Operators} from '../api/Operator';
import {Clause} from '../api/Clause';
import {SearchProperty} from '../api/SearchProperty';
import {SearchPropertyTypes} from '../api/SearchPropertyType';

/**
 * Converts a [[Filter]] into ReSTv2 FIQL parameters.
 * @category Filtering API
 */
export class V2FilterProcessor implements IFilterProcessor {

  /** Constant used to represent null values in the V2 API. */
  public static NULL_VALUE = '\u0000';

  /** Constant used to represent null dates in the V2 API.
   *  This must be explicitly set as the restriction value when using
   *  either the NULL or NOTNULL comparators on date fields.
   */
  public static NULL_DATE = '1970-01-01T00:00:00.000+0000';

  /**
   * pre-encoded to avoid running `encodeURIComponent` every time we deal with a null date
   * @hidden
   */
  private static NULL_DATE_ENCODED = encodeURIComponent(V2FilterProcessor.NULL_DATE);

  /** The accessor for Properties */
  private searchProperties?: SearchProperty[];

  constructor(searchProperties?: SearchProperty[]) {
      this.searchProperties = searchProperties;
  }

  /** Given a filter, return a hash of URL parameters. */
  public getParameters(filter: Filter) {
      const ret = {} as IHash<string>;

      if (filter.limit !== undefined) {
          ret.limit = '' + filter.limit;
      }

      const search = this.toFIQL(filter.clauses);
      if (search.length > 0) {
          ret._s = search;
      }

      return ret;
  }

  /**
   * Given a comparator, convert it to a correspond comparator
   * that can be used in the FIQL expression.
   */
  private toFIQLComparator(comparator: Comparator) {
    switch (comparator) {
      case Comparators.EQ:
      case Comparators.NULL:
        return '==';
      case Comparators.NE:
      case Comparators.NOTNULL:
        return '!=';
      case Comparators.GT:
        return '=gt=';
      case Comparators.LT:
        return '=lt=';
      case Comparators.GE:
        return '=ge=';
      case Comparators.LE:
        return '=le=';
      case Comparators.LIKE:
        return '==';
      case Comparators.ILIKE:
      default:
        throw new OnmsError('Unsupported comparator type: ' + comparator);
    }
  }

  /** Return a search property by ID */
  private getProperty(id: string) {
    if (this.searchProperties) {
      return this.searchProperties.find((prop: any) => prop.id === id);
    }
    return undefined;
  }

  /** Given a restriction, compute the value to use in the FIQL expression. */
  private toFIQLValue(restriction: Restriction) {
    switch (restriction.comparator) {
      case Comparators.NULL:
      case Comparators.NOTNULL:
          return restriction.value === undefined ? V2FilterProcessor.NULL_VALUE : encodeURIComponent(restriction.value);
      default:
          if (restriction.value === 'null' || restriction.value === void 0) {
              const property = this.getProperty(restriction.attribute);
              if (property && property.type === SearchPropertyTypes.TIMESTAMP) {
                  return V2FilterProcessor.NULL_DATE_ENCODED;
              }
              return V2FilterProcessor.NULL_VALUE;
          }
          return encodeURIComponent(this.applyDateConversion(restriction.value));
    }
  }

  /** Given an operator, convert it to the corresponding FIQL operator. */
  private toFIQLOperator(operator: Operator) {
    switch (operator) {
      case Operators.AND:
        return ';';
      case Operators.OR:
        return ',';
      default:
        throw new OnmsError('Unsupported operator type: ' + operator);
    }
  }

  /** Given a list of clauses, recursively generate the FIQL query string. */
  private toFIQL(clauses: Clause[] | undefined) {
    let search = '';
    if (!clauses || clauses.length === 0) {
      return search;
    }
    for (const clause of clauses) {
      if (search.length > 0) {
        search += this.toFIQLOperator(clause.operator);
      }

      if (clause.restriction instanceof NestedRestriction) {
        search += '(' + this.toFIQL(clause.restriction.clauses) + ')';
      } else {
        const restriction = clause.restriction as Restriction;
        const comp = this.toFIQLComparator(restriction.comparator);
        const value = this.toFIQLValue(restriction);
        search += [restriction.attribute, comp, value].join('');
      }
    }
    return search;
  }

 /**
  * If the given value is a date value, it is converted to be properly parsed by the OpenNMS ReST API,
  * otherwise it is not modified.
  *
  * @param value Any value which may need conversion.
  */
  private applyDateConversion(value: any): any {
      if (Util.isDateObject(value)) {
          return Util.toDateString(value);
      }
      return value;
  }
}
