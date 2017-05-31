declare const describe, beforeEach, it, expect;

import {ServerType} from '../../src/api/Constants';
import {OnmsVersion} from '../../src/api/OnmsVersion';
import {ServerMetadata} from '../../src/model/ServerMetadata';

let metadata;

const expectedResults = {
  '0.0.0': {
    newObject: ['0.0.0', undefined],
    tests: {
      serverType: ServerType.HORIZON,
      capabilities: {
        ackAlarms: false,
        graphs: false,
        outageSummaries: false,
        setLocation: false,
      }
    }
  },
  '14.0.3': {
    newObject: ['14.0.3', undefined],
    tests: {
      serverType: ServerType.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setLocation: false,
      }
    }
  },
  '15.0.0': {
    newObject: ['15.0.0', undefined],
    tests: {
      serverType: ServerType.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setLocation: false,
      }
    }
  },
  '15.0.2': {
    newObject: ['15.0.2', undefined],
    tests: {
      serverType: ServerType.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setLocation: true,
      }
    }
  },
  '16.0.0': {
    newObject: ['16.0.0', undefined],
    tests: {
      serverType: ServerType.HORIZON,
      capabilities: {
        ackAlarms: true,
        graphs: true,
        outageSummaries: true,
        setLocation: true,
      }
    }
  },
  '2015.1.0': {
    newObject: ['2015.1.0', ServerType.MERIDIAN],
    tests: {
      serverType: ServerType.MERIDIAN,
      capabilities: {
        ackAlarms: true,
        graphs: false,
        outageSummaries: true,
        setLocation: true,
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
