declare const describe, beforeEach, it, expect;

import {ServerTypes} from '../../src/api/ServerType';
import {ServerMetadata} from '../../src/api/ServerMetadata';

const expectedResults = {
  '0.0.0': {
    newObject: { version: '0.0.0', type: undefined },
    tests: {
      capabilities: {
        ackAlarms: false,
        apiVersion: 1,
        graphs: false,
        outageSummaries: false,
        setNodeLocation: false,
      },
      serverType: ServerTypes.HORIZON,
    },
  },
  '14.0.3': {
    newObject: { version: '14.0.3', type: undefined },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 1,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: false,
      },
      serverType: ServerTypes.HORIZON,
    },
  },
  '15.0.0': {
    newObject: { version: '15.0.0', type: undefined },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 1,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: false,
      },
      serverType: ServerTypes.HORIZON,
    },
  },
  '15.0.2': {
    newObject: { version: '15.0.2', type: undefined },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 1,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: true,
      },
      serverType: ServerTypes.HORIZON,
    },
  },
  '16.0.0': {
    newObject: { version: '16.0.0', type: undefined },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 1,
        graphs: true,
        outageSummaries: true,
        setNodeLocation: true,
      },
      serverType: ServerTypes.HORIZON,
    },
  },
  '2015.1.0': {
    newObject: { version: '2015.1.0', type: ServerTypes.MERIDIAN },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 1,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: true,
      },
      serverType: ServerTypes.MERIDIAN,
    },
  },
  '2016.1.5': {
    newObject: { version: '2016.1.5', type: ServerTypes.MERIDIAN },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 1,
        graphs: true,
        outageSummaries: true,
        setNodeLocation: true,
      },
      serverType: ServerTypes.MERIDIAN,
    },
  },
  '21.0.0': {
    newObject: { version: '21.0.0', type: undefined },
    tests: {
      capabilities: {
        ackAlarms: true,
        apiVersion: 2,
        graphs: true,
        outageSummaries: true,
        setNodeLocation: true,
      },
      serverType: ServerTypes.HORIZON,
    },
  },
};

for (const [ver, suite] of Object.entries(expectedResults)) {
  const typeString = (suite.newObject.type === undefined ? 'undefined' : suite.newObject.type.toString());
  const expectedTypeString = (suite.tests.serverType === undefined ? 'undefined' : suite.tests.serverType.toString());

  let metadata;

  describe('new ServerMetadata("' + suite.newObject.version + '", ' + typeString + ')', () => {
    beforeEach(() => {
      metadata = new ServerMetadata(suite.newObject.version, suite.newObject.type);
    });

    it('it should have a version of "' + ver + '"', () => {
      expect(metadata.version.eq(ver)).toBe(true);
    });
    it('it should be considered a ' + expectedTypeString + ' server', () => {
      expect(metadata.type).toEqual(suite.tests.serverType);
    });
    describe('capabilities', () => {
      for (const [cap, match] of Object.entries(suite.tests.capabilities)) {
        it((match ? 'has' : 'no') + ' ' + cap, () => expect(metadata[cap]()).toBe(match));
      }
    });
  });
}
