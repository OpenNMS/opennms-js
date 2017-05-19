# OpenNMS Javascript API

A client API for accessing the OpenNMS network monitoring platform.

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
