declare const await, describe, beforeEach, it, expect, jest;

import {log,catRoot,setLogLevel} from '../../src/api/Log';
import {LogLevel} from 'typescript-logging';

setLogLevel(LogLevel.Debug, catRoot);

import {IFilterProcessor} from '../../src/api/IFilterProcessor';

import {OnmsError} from '../../src/api/OnmsError';
import {Comparator, Comparators} from '../../src/api/Comparator';
import {Filter} from '../../src/api/Filter';
import {Restriction} from '../../src/api/Restriction';

import {OnmsAlarm} from '../../src/model/OnmsAlarm';
import {OnmsSeverity, Severities} from '../../src/model/OnmsSeverity';

import {V2FilterProcessor} from '../../src/dao/V2FilterProcessor';

describe('V2FilterProcessor', () => {

  function toSearch(filter: Filter) {
    return new V2FilterProcessor().getParameters(filter).search;
  }

  it('default alarm filter', () => {
    const filter = new Filter<OnmsAlarm>();
    const proc = new V2FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(1);
    expect(params.limit).toEqual('1000');
  });
  it('alarm filter with no parameters', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.limit = undefined;
    const proc = new V2FilterProcessor();
    const params = proc.getParameters(filter);
    expect(Object.keys(params).length).toEqual(0);
  });
  it('alarm filter: id=notnull', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    expect(toSearch(filter)).toEqual('id!=\u0000');
  });
  it('alarm filter: id=notnull, ackTime=null', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    filter.restrictions.push(new Restriction('ackTime', Comparators.NULL, V2FilterProcessor.NULL_DATE));
    expect(toSearch(filter)).toEqual('id!=\u0000;ackTime==1970-01-01T00:00:00.000+0000');
  });
  it('alarm filter: id=notnull, severity="MINOR"', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('id', Comparators.NOTNULL));
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, 'MINOR'));
    expect(toSearch(filter)).toEqual('id!=\u0000;severity==MINOR');
  });
  it('alarm filter: severity=OnmsSeverity.MINOR, id!=0', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, Severities.MINOR));
    filter.restrictions.push(new Restriction('id', Comparators.NE, 0));
    expect(toSearch(filter)).toEqual('severity==5;id!=0');
  });
  it('alarm filter: severity=OnmsSeverity.MINOR, id!=0', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, Severities.MINOR));
    filter.restrictions.push(new Restriction('id', Comparators.NE, 0));
    expect(toSearch(filter)).toEqual('severity==5;id!=0');
  });
  it('alarm filter: severity=OnmsSeverity.MINOR, id!=0', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('severity', Comparators.EQ, Severities.MINOR));
    filter.restrictions.push(new Restriction('id', Comparators.NE, 0));
    expect(toSearch(filter)).toEqual('severity==5;id!=0');
  });
  it('alarm filter: uei like somethingWentWrong', () => {
    const filter = new Filter<OnmsAlarm>();
    filter.restrictions.push(new Restriction('uei', Comparators.LIKE, 'somethingWentWrong'));
    expect(toSearch(filter)).toEqual('uei==*somethingWentWrong*');
  });

});
