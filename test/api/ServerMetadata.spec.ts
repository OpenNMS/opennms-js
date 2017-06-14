declare const describe, beforeEach, it, expect;

import {ServerType, ServerTypes} from '../../src/api/ServerType';
import {OnmsVersion} from '../../src/api/OnmsVersion';
import {ServerMetadata} from '../../src/api/ServerMetadata';

let metadata;

const expectedResults = {
  '0.0.0': {
    newObject: ['0.0.0', undefined],
    tests: {
      serverType: ServerTypes.HORIZON,
      capabilities: {
        ackAlarms: false,
        graphs: false,
        outageSummaries: false,
        setNodeLocation: false,
      }
    }
  },
  '14.0.3': {
    newObject: ['14.0.3', undefined],
    tests: {
      serverType: ServerTypes.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: false,
      }
    }
  },
  '15.0.0': {
    newObject: ['15.0.0', undefined],
    tests: {
      serverType: ServerTypes.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: false,
      }
    }
  },
  '15.0.2': {
    newObject: ['15.0.2', undefined],
    tests: {
      serverType: ServerTypes.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: true,
      }
    }
  },
  '16.0.0': {
    newObject: ['16.0.0', undefined],
    tests: {
      serverType: ServerTypes.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: true,
        outageSummaries: true,
        setNodeLocation: true,
      }
    }
  },
  '2015.1.0': {
    newObject: ['2015.1.0', ServerTypes.MERIDIAN],
    tests: {
      serverType: ServerTypes.MERIDIAN,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setNodeLocation: true,
      }
    }
  },
};

//console.log(JSON.stringify(expectedResults, undefined, 5));

for (let ver in expectedResults) {
  let suite = expectedResults[ver];

  let typeString = (suite.newObject[1] === undefined? 'undefined' : suite.newObject[1].toString());
  let expectedTypeString = (suite.tests.serverType === undefined? 'undefined' : suite.tests.serverType.toString());

  describe('new ServerMetadata("' + suite.newObject[0] + '", ' + typeString + ')', () => {
    beforeEach(() => {
      metadata = new ServerMetadata(suite.newObject[0], suite.newObject[1]);
    });

    it('it should have a version of "' + ver + '"', () => {
      expect(metadata.version.eq(ver)).toBe(true);
    });
    it('it should be considered a ' + expectedTypeString + ' server', () => {
      expect(metadata.type).toEqual(suite.tests.serverType);
    });
    describe('capabilities', () => {
      for (let cap in suite.tests.capabilities) {
        let match = suite.tests.capabilities[cap];
        it((match? 'has':'no') + ' ' + cap, () => expect(metadata[cap]()).toBe(match));
      }
    });
  });
}
