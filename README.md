# OpenNMS Javascript API [![CircleCI](https://circleci.com/gh/OpenNMS/opennms-js.svg?style=svg)](https://circleci.com/gh/OpenNMS/opennms-js)

A client API for accessing the OpenNMS network monitoring platform.

# Using the OpenNMS.js APIs In Your Code

Information on getting started and how to use the API is in the [HOWTO document](https://github.com/OpenNMS/opennms-js/blob/master/HOWTO.md).

The complete API list is available at [docs.opennms.org](http://docs.opennms.org/opennms-js/branches/master/opennms-js/opennms-js.html).

# Using the OpenNMS.js Command Line

1. install [Node.js](https://nodejs.org/en/download/)
2. run `sudo npm install -g opennms`
3. run `opennms --help` for a list of possible commands

# Changes

The CHANGELOG will be updated as releases occur, and should always be accessible [here](https://github.com/OpenNMS/opennms-js/blob/master/CHANGELOG.md).

# Development

To build this project, first install yarn:

`npm install -g yarn`

Then run yarn to fetch all dependencies:

`yarn`

Then you can run yarn to build or test the project:

* `yarn dist` - run tests and lint, and build the complete tree in `dist/`
* `yarn dev` - build a development version of the API in `dist/opennms.js` and `dist/opennms.node.js`
* `yarn build` - build the development and production versions of the API in `dist/`
* `yarn docs` - build the docs in `dist/docs/`
* `yarn watch` - continuously build the development version in `dist/opennms.js`
* `yarn test` - run the tests
* `yarn watch-test` - continuously run the tests
* `yarn cli -- <arguments>` - run the CLI test tool (try `--help` for options)

# Reporting Bugs or Feature Requests

OpenNMS.js issues are tracked in the OpenNMS issue tracker: https://issues.opennms.org/browse/JS

# Debugging Tests

On MAC OS X with WebStorm v2017.2 debugging tests may not work.
See https://github.com/facebook/jest/issues/1652 for more details.
The described solution there is to add `--env jest-environment-node-debug` as argument to the runtime configuration.
