declare const describe, beforeEach, it, expect;

import {OnmsHTTPOptions, OnmsHTTPOptionsBuilder} from '../../src/api/OnmsHTTPOptions';

let options: OnmsHTTPOptionsBuilder;

describe('OnmsHTTPOptionsBuilder', () => {
  beforeEach(() => {
    options = OnmsHTTPOptions.newBuilder();
  });

  describe('Parameters', () => {
    describe('Parameters.addParameter', () => {
      it('it should store a simple string parameter as a string', () => {
        options.addParameter('foo', 'bar');
        expect(options.build().parameters).toMatchObject({
          foo: 'bar'
        });
      });
      it('it should store a simple number parameter as a string', () => {
        options.addParameter('foo', 3);
        expect(options.build().parameters).toMatchObject({
          foo: '3'
        });
      });
      it('it should store a simple boolean parameter as a string', () => {
        options.addParameter('foo', true);
        expect(options.build().parameters).toMatchObject({
          foo: 'true'
        });
      });
      it('it should store an array as an array', () => {
        options.addParameter('foo', ['bar', 'baz']);
        expect(options.build().parameters).toMatchObject({
          foo: ['bar', 'baz']
        });
      });
      it('it should store multiple parameters as an array', () => {
        options.addParameter('foo', 'bar');
        options.addParameter('foo', 'baz');
        expect(options.build().parameters).toMatchObject({
          foo: ['bar', 'baz']
        });
      });
    });
  });
});
