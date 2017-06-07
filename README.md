# OpenNMS Javascript API [![CircleCI](https://circleci.com/gh/OpenNMS/opennms-js.svg?style=svg)](https://circleci.com/gh/OpenNMS/opennms-js)

A client API for accessing the OpenNMS network monitoring platform.

# Getting Started

```javascript
import {API, Model, Rest, DAO, Client} from 'dist/opennms.min.js';

const opennms = new Client();
opennms.connect('Demo', 'https://demo.opennms.org/opennms', 'demo', 'demo').then((server) => {
  // we have a valid connection with an OnmsServer object, do something with it
});
```

# API Documentation

The API documentation is currently available at [docs.opennms.org](http://docs.opennms.org/opennms-js/branches/master/opennms-js/opennms-js.html).

# Changes

The CHANGELOG will be updated as releases occur, and should always be accessible [here](https://github.com/OpenNMS/opennms-js/blob/master/CHANGELOG.md).

# Development

To build this project, first install yarn:

`npm install -g yarn`

Then run yarn to fetch all dependencies:

`yarn`

Then you can run yarn to build or test the project:

* `yarn dev` - build a development version of the API in `dist/opennms.js`
* `yarn build` - build a production version of the API in `dist/opennms.min.js`
* `yarn watch` - continuously build the development version in `dist/opennms.js`
* `yarn test` - run the tests
* `yarn watch-test` - continuously run the tests
* `yarn cli -- <arguments>` - run the CLI test tool (try `--help` for options)
