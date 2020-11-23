# OpenNMS Javascript API [![CircleCI](https://circleci.com/gh/OpenNMS/opennms-js.svg?style=svg)](https://circleci.com/gh/OpenNMS/opennms-js)

A client API for accessing the OpenNMS network monitoring platform.

## Using the OpenNMS.js APIs In Your Code

Information on getting started and how to use the API is in the [OpenNMS Documentation](https://docs.opennms.com/).

The complete API list is available at [opennms.github.io](https://opennms.github.io/opennms-js/).

## Using the OpenNMS.js Command Line

1. install [Node.js](https://nodejs.org/en/download/)
2. run `npm install -g opennms`
3. run `opennms --help` for a list of available commands

## Changes and Versioning

The CHANGELOG should always contain the complete list of changes between versions, and should always be accessible [here](https://github.com/OpenNMS/opennms-js/blob/main/CHANGELOG.md).

OpenNMS.js follows [semantic versioning](https://semver.org/).

### Release Notes

#### 2.0.2

Another small release with dependency and documentation updates and a switch (back) to npm rather than yarn.

#### 2.0.1

This is a small release with some dependency updates and a fix for handling of ReST data that is missing a response.

#### 2.0.0

OpenNMS.js 2.0 adds a few new APIs, contains a ton of refactoring and build system updates, and has a few small breaking changes.

##### Notable Changes

* updated CLI libraries to fix/improve table output
* better, faster build system to improve generated code
* improved handling of authentication in HTTP implementations
* support for `HEAD` requests has been added to the HTTP implementations
* a number of metadata objects (notably `OnmsServer`) support `.equals()` for comparison now
* property caching on v2 API calls is fixed when interacting with multiple servers/DAOs
* filter API now supports `orderBy` and `order` (and the `alarms` CLI list command supports it)
* HTTP parameters in `OnmsHTTPOptions` can now have multiple values -- for example a parameter with value `[ 1, 2 ]` will serialize to `&foo=1&foo=2`

##### Breaking Changes

* The `api/Log` module now only exports a single, simplified `log` object; `typescript-logging` was overly complicated and not really adding much in the way of value.  Use `.setDebug()`, `.setQuiet()`, and `.setSilent()` to change the logging level instead.
* A number of the TypeScript APIs have been clarified to be explicitly nullable (and/or `undefined`-able) to make strict null- and type-checking validation pass.
* `PropertiesCache` and its associated interface, `ISearchPropertyAccessor` are gone.  This only affects you if you have implemented custom DAOs, which is very unlikely.  :)
* The previously deprecated `timeout` property in `AbstractHTTP` (and sub-classes) has been removed.  Access the `AbstractHTTP.options.timeout` property directly.
* The `Client` no longer keeps a separate copy of the server object.  Instead you should access the `http.server` sub-property directly.
* A number of API objects are now immutable/read-only to reduce side-effects: `OnmsAuthConfig`, `OnmsEnum`, `OnmsError`, `OnmsHTTPOptions`, `OnmsResult`, `OnmsServer`, `Operator`, `SearchPropertyType`, `ServerMetadata`, `TicketerConfig`.
  The `OnmsHTTPOptions` and `OnmsServer` objects now have builders (use `.newBuilder()` to create) rather than constructors with a bunch of arguments.
* The `id` property on `OnmsServer` is no longer generated, it is computed based on the contents of the server object and should be repeatably equal if the contents are equal.

#### 1.5

This release includes support for some additional flow queries, as well as a few security updates and a fix for CLI formatting.

#### 1.4

This is a small feature release with a few changes targeted primarily to Helm (adding root cause and tags to the situation feedback API support, and support for `isAcknowledged` queries on alarms).

#### 1.3

This release contains a number of new features and a few bug fixes, including support for correlation alarms and feedback, and additional metadata for Helm 3.

#### 1.2

This is a small release which adds support for a default timeout in `GrafanaHTTP`, as well as adding `X-Requested-With` headers to requests ([NMS-9783](https://issues.opennms.org/browse/NMS-9783)).

#### 1.1

This release adds support for telemetry (Netflow) APIs which will be introduced in OpenNMS 22.x.
It also includes a number of build optimizations and updates since 1.0.

#### 1.0

The initial official release of OpenNMS.js.

OpenNMS.js currently supports a subset of the OpenNMS ReST API:

* query alarms, events, and nodes (including complex queries against OpenNMS Horizon 21+ and Meridian 2017+)
* acknowledge, escalate, and clear alarms
* create, update, and close trouble tickets against an alarm
* create, update, and delete alarm sticky memos
* create, update, and delete alarm journal memos

