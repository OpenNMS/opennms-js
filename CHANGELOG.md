## [2.0.3-SNAPSHOT](https://github.com/OpenNMS/opennms-js/compare/v2.0.2...v2.0.3-SNAPSHOT) (2020-06-08)



## [2.0.2](https://github.com/OpenNMS/opennms-js/compare/v2.0.1...v2.0.2) (2020-04-13)


### Bug Fixes

* **rest:** fix response type handling in grafana 6.7 (HELM-232) ([874cd80](https://github.com/OpenNMS/opennms-js/commit/874cd801bc76683b41bd4dda75565e3d9a43f84f))



## [2.0.1](https://github.com/OpenNMS/opennms-js/compare/v2.0.0...v2.0.1) (2019-10-25)


### Bug Fixes

* **dao:** handle .fromData when data is undefined (JS-45) ([efe6858](https://github.com/OpenNMS/opennms-js/commit/efe6858229fd56a61bba224653f9c1e0c250aa01))
* **dao:** warn if lastEvent is missing on an alarm (JS-45) ([e4af27d](https://github.com/OpenNMS/opennms-js/commit/e4af27d2391aa20a10d47465c2fabb8d77dc451d))



# [2.0.0](https://github.com/OpenNMS/opennms-js/compare/v1.5.0...v2.0.0) (2019-09-30)


### Bug Fixes

* **api:** add new OrderBy objects to API export ([ffdadeb](https://github.com/OpenNMS/opennms-js/commit/ffdadeb))
* **api:** options mishandled arrays passed to .addParameter (JS-44) ([2905633](https://github.com/OpenNMS/opennms-js/commit/2905633))
* **api:** remove unneccesary undefinability ([578ed1c](https://github.com/OpenNMS/opennms-js/commit/578ed1c))
* **cli:** bounds-check remaining column width for table render ([54c8919](https://github.com/OpenNMS/opennms-js/commit/54c8919))
* **cli:** CLI errors should exit immediately non-0 ([943710e](https://github.com/OpenNMS/opennms-js/commit/943710e))
* **cli:** fix typo in space-cleaning regex ([de5f5cc](https://github.com/OpenNMS/opennms-js/commit/de5f5cc))
* **client:** set server when checking metadata ([6437884](https://github.com/OpenNMS/opennms-js/commit/6437884))
* **dao:** fix DAO property caching (JS-38) ([178a31d](https://github.com/OpenNMS/opennms-js/commit/178a31d))
* **filters:** make sure clauses is always initialized ([246ce4c](https://github.com/OpenNMS/opennms-js/commit/246ce4c))
* **log:** fix formatting of log output ([42e89f3](https://github.com/OpenNMS/opennms-js/commit/42e89f3))
* **rest:** assign != apply :D ([1112c7b](https://github.com/OpenNMS/opennms-js/commit/1112c7b))
* **rest:** caught errors in GrafanaHTTP should be re-thrown ([fc35b12](https://github.com/OpenNMS/opennms-js/commit/fc35b12))
* **rest:** fix auth initialization broken during refactor (JS-39) ([85200fd](https://github.com/OpenNMS/opennms-js/commit/85200fd))
* **rest:** simplify grafana HTTP config creation ([3f3089b](https://github.com/OpenNMS/opennms-js/commit/3f3089b))
* **test:** fix tslint errors ([1606bff](https://github.com/OpenNMS/opennms-js/commit/1606bff))


### Code Refactoring

* **rest:** pull up authentication into the abstract impl ([6f565bd](https://github.com/OpenNMS/opennms-js/commit/6f565bd))


### Features

* add .equals() to various metadata objects ([cf3ff5f](https://github.com/OpenNMS/opennms-js/commit/cf3ff5f))
* make common API objects immutable ([0b8407c](https://github.com/OpenNMS/opennms-js/commit/0b8407c))
* **api:** add orderBy support to filter queries (HELM-174) ([6e7edfa](https://github.com/OpenNMS/opennms-js/commit/6e7edfa))
* **api:** add support for multi-value parameters ([138f524](https://github.com/OpenNMS/opennms-js/commit/138f524))
* **build:** add dependabot auto-updater config ([b0eb941](https://github.com/OpenNMS/opennms-js/commit/b0eb941))
* **cli:** add orderBy= and order= support to `alarms` ([d67832a](https://github.com/OpenNMS/opennms-js/commit/d67832a))
* **client:** cache DAOs accessed through the Client API (JS-38) ([76c9205](https://github.com/OpenNMS/opennms-js/commit/76c9205))
* **rest:** add HTTP HEAD ([bea34a5](https://github.com/OpenNMS/opennms-js/commit/bea34a5))


### BREAKING CHANGES

* **rest:** AbstractHTTP.getServer now throws an error if a
server cannot be returned when it is called.



<a name="1.5.0"></a>
# [1.5.0](https://github.com/OpenNMS/opennms-js/compare/v1.4.0...v1.5.0) (2019-06-07)


### Bug Fixes

* **cli:** fix broken table formatting in prod cli build (JS-33) ([db50724](https://github.com/OpenNMS/opennms-js/commit/db50724))
* **security:** update handlebars, js-yaml, and marked ([f5f4ad2](https://github.com/OpenNMS/opennms-js/commit/f5f4ad2))
* **security:** upgrade to Axios 0.19.0 ([a731c60](https://github.com/OpenNMS/opennms-js/commit/a731c60))


### Features

* **drift2:** Support querying traffic for applications, conversations, and hosts
  ([9b684cf](https://github.com/OpenNMS/opennms-js/commit/9b684cf), [8afd6a2](https://github.com/OpenNMS/opennms-js/commit/8afd6a2),
  [1f0fd21](https://github.com/OpenNMS/opennms-js/commit/1f0fd21), [77b094d](https://github.com/OpenNMS/opennms-js/commit/77b094d))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/OpenNMS/opennms-js/compare/v1.3.1...v1.4.0) (2019-04-09)


### Features

* **alarms:** HZN-1492 : Add RootCause and Tags to SituationFeedback ([#35](https://github.com/OpenNMS/opennms-js/issues/35)) ([3790072](https://github.com/OpenNMS/opennms-js/commit/3790072))
* **dao:** JS-29 - add support for "isAcknowledged" on alarms ([ff1515a](https://github.com/OpenNMS/opennms-js/commit/ff1515a))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/OpenNMS/opennms-js/compare/v1.3.0...v1.3.1) (2019-03-27)


### Bug Fixes

* **build:** JS-28 - don't mangle function names ([07100ca](https://github.com/OpenNMS/opennms-js/commit/07100ca))
* **build:** JS-31 - fix all outstanding audit warnings ([ace9779](https://github.com/OpenNMS/opennms-js/commit/ace9779))
* **cli:** fix alarm cli when no alarms are returned ([75c6a9a](https://github.com/OpenNMS/opennms-js/commit/75c6a9a))


### Features

* **api:** JS-30 - reconstitute Filter/Clause/Restrictions from JSON ([891bbd1](https://github.com/OpenNMS/opennms-js/commit/891bbd1))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/OpenNMS/opennms-js/compare/v1.2.2...v1.3.0) (2018-12-07)


### Bug Fixes

* **api:** *support* flow data ([bd8c5b9](https://github.com/OpenNMS/opennms-js/commit/bd8c5b9))
* **feedback:** Serialize the enum as a string ([3c2f997](https://github.com/OpenNMS/opennms-js/commit/3c2f997))


### Features

* **alarms:** HELM-110: store managedObject* if present ([2b86722](https://github.com/OpenNMS/opennms-js/commit/2b86722))
* **alarms:** HELM-114: alarm property for whether it is a situation ([a54b627](https://github.com/OpenNMS/opennms-js/commit/a54b627))
* **api:** add flow and situation metadata APIs ([42d7a58](https://github.com/OpenNMS/opennms-js/commit/42d7a58))
* **api:** Add more test assertions for AlarmSummaryDTO ([0f45e79](https://github.com/OpenNMS/opennms-js/commit/0f45e79))
* **api:** Add test for AlarmSummary and reductionKey ([3329cf7](https://github.com/OpenNMS/opennms-js/commit/3329cf7))
* **api:** HZN-1357 expose FeedbackDAO ([d354040](https://github.com/OpenNMS/opennms-js/commit/d354040))
* **api:** HZN-1357 Pass data and set accept header ([0bf0bdd](https://github.com/OpenNMS/opennms-js/commit/0bf0bdd))
* **api:** HZN-1357 tests for uri.js ([e98cfa4](https://github.com/OpenNMS/opennms-js/commit/e98cfa4))
* **api:** HZN-1357 use AlarmId for Situation ([3d9f172](https://github.com/OpenNMS/opennms-js/commit/3d9f172))
* **api:** Initial work ([fa62503](https://github.com/OpenNMS/opennms-js/commit/fa62503))
* **api:** Move from 'impacts/causes' to 'relatedAlarms' ([3bc5b6e](https://github.com/OpenNMS/opennms-js/commit/3bc5b6e))
* **api:** OCE-REST extend Alarm and summary ([e855134](https://github.com/OpenNMS/opennms-js/commit/e855134))
* **api:** OCE-REST extend Alarm and summary ([24ca0f7](https://github.com/OpenNMS/opennms-js/commit/24ca0f7))
* **api:** OCE-REST remove inSituation attr ([d3bb9e9](https://github.com/OpenNMS/opennms-js/commit/d3bb9e9))
* **api:** OCE-REST updte tests ([abd86d1](https://github.com/OpenNMS/opennms-js/commit/abd86d1))
* **cli:** improve table rendering ([da92bdb](https://github.com/OpenNMS/opennms-js/commit/da92bdb))
* **feedback:** Expose the feedback type enum values ([500632a](https://github.com/OpenNMS/opennms-js/commit/500632a))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/OpenNMS/opennms-js/compare/v1.2.1...v1.2.2) (2018-05-17)


### Bug Fixes

* **dao:** HELM-91: fix handling non-array results ([0707ac7](https://github.com/OpenNMS/opennms-js/commit/0707ac7))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/OpenNMS/opennms-js/compare/v1.2.0...v1.2.1) (2018-04-13)


### Bug Fixes

* **rest:** fix HTTP timeout configuration to be more consistent ([c8e7162](https://github.com/OpenNMS/opennms-js/commit/c8e7162))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/OpenNMS/opennms-js/compare/v1.1.1...v1.2.0) (2018-03-30)


### Bug Fixes

* **http:** add timeout to GrafanaHTTP ([22bdd70](https://github.com/OpenNMS/opennms-js/commit/22bdd70))


### Features

* **rest:** NMS-9783: add X-Requested-With header to requests ([e803726](https://github.com/OpenNMS/opennms-js/commit/e803726))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/OpenNMS/opennms-js/compare/v1.0.3...v1.1.1) (2018-03-16)


### Features

* **dao:** Add flow support ([e37e73f](https://github.com/OpenNMS/opennms-js/commit/e37e73f))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/OpenNMS/opennms-js/compare/v1.0.2...v1.0.3) (2018-02-13)


### Bug Fixes

* **cli:** Valid example for node label searches ([2eafce8](https://github.com/OpenNMS/opennms-js/commit/2eafce8))
* **dao:** node search properties are supported in ReSTv2 ([71c3354](https://github.com/OpenNMS/opennms-js/commit/71c3354))
* **model:** OnmsParm should use the name as its urlValue ([5019a0b](https://github.com/OpenNMS/opennms-js/commit/5019a0b))


### Features

* **model:** add interface to denote serialization to a URL parameter ([b983abf](https://github.com/OpenNMS/opennms-js/commit/b983abf))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/OpenNMS/opennms-js/compare/v1.0.1...v1.0.2) (2017-09-25)


### Bug Fixes

* **rest:** allow ReSTv2 for Horizon 20.1.x ([bd1dd59](https://github.com/OpenNMS/opennms-js/commit/bd1dd59))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/OpenNMS/opennms-js/compare/v1.0.0...v1.0.1) (2017-09-13)


### Bug Fixes

* **grafana:** set the Authorization header ([d48f931](https://github.com/OpenNMS/opennms-js/commit/d48f931))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/OpenNMS/opennms-js/compare/v1.0.0-beta.1...v1.0.0) (2017-09-08)


### Bug Fixes

* **api:** add missing modules to API export ([53fad98](https://github.com/OpenNMS/opennms-js/commit/53fad98))
* **api:** add workaround for Error init + clean up docs ([6f7a4ab](https://github.com/OpenNMS/opennms-js/commit/6f7a4ab))
* **dao:** Map troubleTicketState properly (JS-24) ([86fc298](https://github.com/OpenNMS/opennms-js/commit/86fc298))
* **dao:** URL-encode FIQL values (NMS-9578) ([9a335e8](https://github.com/OpenNMS/opennms-js/commit/9a335e8))
* **rest:** Do not reset headers when headers defined ([2f360fd](https://github.com/OpenNMS/opennms-js/commit/2f360fd))
* **rest:** Do not set responseType on request ([0c2b6f4](https://github.com/OpenNMS/opennms-js/commit/0c2b6f4))
* **rest:** Use err.data.response if exists as message ([4875b9c](https://github.com/OpenNMS/opennms-js/commit/4875b9c))
* **rest:** use negative offset for dates to work around a server issue ([abdfc0b](https://github.com/OpenNMS/opennms-js/commit/abdfc0b))


### Features

* **alarms:** expose a link to the alarm details page (HELM-55) ([8795818](https://github.com/OpenNMS/opennms-js/commit/8795818))
* **api:** add metadata call to detect ticketer config support ([bf0255b](https://github.com/OpenNMS/opennms-js/commit/bf0255b))
* **api:** Include ticketer configuration. JS-17 ([2728734](https://github.com/OpenNMS/opennms-js/commit/2728734))
* **dao:** Add capability to fetch values from alarm v2 endpoint (JS-22) ([637443f](https://github.com/OpenNMS/opennms-js/commit/637443f))
* **dao:** Add more complex null value handling for v2 (JS-20) ([7817b4a](https://github.com/OpenNMS/opennms-js/commit/7817b4a))
* **dao:** add user parameter to unack (JS-19) ([90c128d](https://github.com/OpenNMS/opennms-js/commit/90c128d))
* **dao:** expose the event label and locations (HELM-13) ([3395039](https://github.com/OpenNMS/opennms-js/commit/3395039))
* **dao:** Include troubleTicketLink if defined (JS-23) ([7420218](https://github.com/OpenNMS/opennms-js/commit/7420218))
* **dao:** support dates in query parameters (JS-15) ([d9884b6](https://github.com/OpenNMS/opennms-js/commit/d9884b6))
* **internal:** add utility methods for dealing with dates ([c40450b](https://github.com/OpenNMS/opennms-js/commit/c40450b))
* **rest:** Improve OnmsError object and GrafanaHttp error handling ([72d6e32](https://github.com/OpenNMS/opennms-js/commit/72d6e32))
* **rest:** only parse requests on success (JS-13) ([aa9257d](https://github.com/OpenNMS/opennms-js/commit/aa9257d))



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/OpenNMS/opennms-js/compare/v0.1.0-alpha.3...v1.0.0-beta.1) (2017-08-07)


### Bug Fixes

* **api:** fix comparator matching ([6897389](https://github.com/OpenNMS/opennms-js/commit/6897389))
* **api:** handle Meridian properly in useJson ([740cdf1](https://github.com/OpenNMS/opennms-js/commit/740cdf1))
* **dao:** fix handling of 204s in Grafana - the data is null ([55028cb](https://github.com/OpenNMS/opennms-js/commit/55028cb))
* **js-10:** Handle single alarm (xml) result properly ([544c174](https://github.com/OpenNMS/opennms-js/commit/544c174))
* **js-12:** Make breakpoints work ([13fb9ae](https://github.com/OpenNMS/opennms-js/commit/13fb9ae))
* **log:** bump logging of missing count down to DEBUG ([00b3e1b](https://github.com/OpenNMS/opennms-js/commit/00b3e1b))
* **rest:** fix clonedeep import in the CLI ([e2e9d79](https://github.com/OpenNMS/opennms-js/commit/e2e9d79))
* **rest:** fix crash when options is undefined in getServer ([7768b48](https://github.com/OpenNMS/opennms-js/commit/7768b48))
* **rest:** make sure passed options don't leak ([9b9dee4](https://github.com/OpenNMS/opennms-js/commit/9b9dee4))
* **rest:** only set up global if it exists (eg, Node.js, not browser) ([7a1b2c3](https://github.com/OpenNMS/opennms-js/commit/7a1b2c3))
* **rest:** webpack still needs to fake global for browsers ([8f7fa5a](https://github.com/OpenNMS/opennms-js/commit/8f7fa5a))


### Features

* **alarms:** add support for manipulating journal and sticky memos ([875e268](https://github.com/OpenNMS/opennms-js/commit/875e268))
* **alarms:** implement ticket create/update/close ([93ff386](https://github.com/OpenNMS/opennms-js/commit/93ff386))
* **api:** add "ISNULL" alias to comparator ([3a243a5](https://github.com/OpenNMS/opennms-js/commit/3a243a5))
* **api:** consider 202 a successful HTTP response ([d21e5e1](https://github.com/OpenNMS/opennms-js/commit/d21e5e1))
* **api:** static method for matching a comparator ([df90751](https://github.com/OpenNMS/opennms-js/commit/df90751))
* **cli:** add --version, also a warning about passwords ([1c07be9](https://github.com/OpenNMS/opennms-js/commit/1c07be9))
* **cli:** make a cli bundle in dist/ ([02298d7](https://github.com/OpenNMS/opennms-js/commit/02298d7))
* **dao:** add alarm setTTicketId/setTTicketState ([bb429f6](https://github.com/OpenNMS/opennms-js/commit/bb429f6))
* **dao:** add ReSTv2 support to event and node DAOs ([c524493](https://github.com/OpenNMS/opennms-js/commit/c524493))
* **dao:** implement querying ReSTv2 search properties ([a588325](https://github.com/OpenNMS/opennms-js/commit/a588325))
* **dao:** Include comparators and values (JS-11) ([9ad41d2](https://github.com/OpenNMS/opennms-js/commit/9ad41d2))
* **dao:** use JSON against modern (19+) OpenNMS instead of XML ([c17db2c](https://github.com/OpenNMS/opennms-js/commit/c17db2c))
* **rest:** add POST support ([d3af9e2](https://github.com/OpenNMS/opennms-js/commit/d3af9e2))
* **rest:** return a useful OnmsResult on error ([094399c](https://github.com/OpenNMS/opennms-js/commit/094399c))



<a name="0.1.0-alpha.3"></a>
# [0.1.0-alpha.3](https://github.com/OpenNMS/opennms-js/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2017-07-21)


### Bug Fixes

* **browser:** fix error when using the dev .js file in a browser ([ee7d22a](https://github.com/OpenNMS/opennms-js/commit/ee7d22a))
* **cli:** only attempt to read the configuration file if it exists ([2339c6d](https://github.com/OpenNMS/opennms-js/commit/2339c6d))
* **dao:** handle single-entry array responses ([6c66be6](https://github.com/OpenNMS/opennms-js/commit/6c66be6))
* **rest:** fix axios include handling ([e461831](https://github.com/OpenNMS/opennms-js/commit/e461831))
* **rest:** fix handling of XML data in node ([70fd445](https://github.com/OpenNMS/opennms-js/commit/70fd445))
* **rest:** generate a node version with webpack ([58d2938](https://github.com/OpenNMS/opennms-js/commit/58d2938))
* **v2:** consider the server type when comparing the version numbers ([e2c03ee](https://github.com/OpenNMS/opennms-js/commit/e2c03ee))
* **v2:** fix handling of 204 codes ([a352ea8](https://github.com/OpenNMS/opennms-js/commit/a352ea8))
* **v2:** remove the implicit wildcards ([4940010](https://github.com/OpenNMS/opennms-js/commit/4940010))


### Features

* **alarms:** expose the sticky and journal memos ([adbcb3a](https://github.com/OpenNMS/opennms-js/commit/adbcb3a))
* **dao:** add alarm ack/unack/escalate/clear support ([f44f8d7](https://github.com/OpenNMS/opennms-js/commit/f44f8d7))
* **rest:** add PUT support ([b50d99e](https://github.com/OpenNMS/opennms-js/commit/b50d99e))
* **v2:** add support for nested restrictions with boolean operators ([09cd705](https://github.com/OpenNMS/opennms-js/commit/09cd705))
* **v2:** add support for the v2 api ([eb1b165](https://github.com/OpenNMS/opennms-js/commit/eb1b165))



<a name="0.1.0-alpha.2"></a>
# [0.1.0-alpha.2](https://github.com/OpenNMS/opennms-js/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2017-06-19)



<a name="0.1.0-alpha.1"></a>
# [0.1.0-alpha.1](https://github.com/OpenNMS/opennms-js/compare/725ed3a...v0.1.0-alpha.1) (2017-06-19)


### Bug Fixes

* **api:** add missing exports to API, clean up imports ([36f8125](https://github.com/OpenNMS/opennms-js/commit/36f8125))
* **enum:** fix handling of number indexes ([c3638a6](https://github.com/OpenNMS/opennms-js/commit/c3638a6))
* **model:** fix empty ServerMetadata initialization of version ([4e200f6](https://github.com/OpenNMS/opennms-js/commit/4e200f6))
* **moment:** fix momentjs usage ([05f3a1f](https://github.com/OpenNMS/opennms-js/commit/05f3a1f))
* **rest:** fix XML parsing result to match JSON ([073ac1f](https://github.com/OpenNMS/opennms-js/commit/073ac1f))
* **rest:** HTTP implementation get() debug includes params ([0b4b87f](https://github.com/OpenNMS/opennms-js/commit/0b4b87f))
* **server:** fix urijs import in node CLI ([98d9320](https://github.com/OpenNMS/opennms-js/commit/98d9320))
* **version:** fix VersionCompare when imported in node CLI ([3fadab3](https://github.com/OpenNMS/opennms-js/commit/3fadab3))


### Features

* **api:** add capabilities ([eddab57](https://github.com/OpenNMS/opennms-js/commit/eddab57))
* **api:** add clone() to some API objects ([7b45c11](https://github.com/OpenNMS/opennms-js/commit/7b45c11))
* **api:** add constants for server type ([725ed3a](https://github.com/OpenNMS/opennms-js/commit/725ed3a))
* **api:** add full DAO filtering support ([fe2204c](https://github.com/OpenNMS/opennms-js/commit/fe2204c))
* **api:** add logging using typescript-logging ([8e1bafe](https://github.com/OpenNMS/opennms-js/commit/8e1bafe))
* **api:** expose LogLevel and setLogLevel in the API ([9a9b512](https://github.com/OpenNMS/opennms-js/commit/9a9b512))
* **cli:** add a test CLI ([671fbe1](https://github.com/OpenNMS/opennms-js/commit/671fbe1))
* **cli:** add server info display ([93c8778](https://github.com/OpenNMS/opennms-js/commit/93c8778))
* **cli:** implement basic (hardcoded) test alarm fetch ([42b10e4](https://github.com/OpenNMS/opennms-js/commit/42b10e4))
* **cli:** update CLI to use AlarmDAO.find ([043ca70](https://github.com/OpenNMS/opennms-js/commit/043ca70))
* **client:** add a simple connect() method ([fdfb2a4](https://github.com/OpenNMS/opennms-js/commit/fdfb2a4))
* **client:** add basic server check that works on all versions ([dfd45c0](https://github.com/OpenNMS/opennms-js/commit/dfd45c0))
* **dao:** add date/number parsers for DAOs ([d1a7b0d](https://github.com/OpenNMS/opennms-js/commit/d1a7b0d))
* **dao:** add find method to DAO ([e68baa1](https://github.com/OpenNMS/opennms-js/commit/e68baa1))
* **dao:** add node sub-model support ([6b2577f](https://github.com/OpenNMS/opennms-js/commit/6b2577f))
* **dao:** add preliminary NodeDAO and models ([81f52f3](https://github.com/OpenNMS/opennms-js/commit/81f52f3))
* **dao:** add simple alarm and event DAOs ([c962fc2](https://github.com/OpenNMS/opennms-js/commit/c962fc2))
* **dao:** add utility method for getting the result count ([2c548b5](https://github.com/OpenNMS/opennms-js/commit/2c548b5))
* **enum:** add a toJSON() representation ([1d51f24](https://github.com/OpenNMS/opennms-js/commit/1d51f24))
* **internal:** add utility for parsing IP addresses ([259c16a](https://github.com/OpenNMS/opennms-js/commit/259c16a))
* **model:** add a MAC address (PhysAddr) object ([6a724e8](https://github.com/OpenNMS/opennms-js/commit/6a724e8))
* **model:** add additional properties to alarms and events ([253f23b](https://github.com/OpenNMS/opennms-js/commit/253f23b))
* **model:** add model objects for alarms, events, and more ([b8e76a3](https://github.com/OpenNMS/opennms-js/commit/b8e76a3))
* **options:** add support for parameters ([21f855c](https://github.com/OpenNMS/opennms-js/commit/21f855c))
* **rest:** add Filter to the API ([4152329](https://github.com/OpenNMS/opennms-js/commit/4152329))
* **rest:** add Grafana HTTP adapter ([f8bfed6](https://github.com/OpenNMS/opennms-js/commit/f8bfed6))
* **rest:** add response-type handling to ReST impls ([9bf2105](https://github.com/OpenNMS/opennms-js/commit/9bf2105))
* **rest:** add SuperAgent HTTP GET implementation ([71af3f9](https://github.com/OpenNMS/opennms-js/commit/71af3f9))
* **rest:** add support for transforming JSON and XML responses ([27e5578](https://github.com/OpenNMS/opennms-js/commit/27e5578))
* **rest:** allow setting the "Accept" type ([5bd300c](https://github.com/OpenNMS/opennms-js/commit/5bd300c))
* **rest:** working Axios HTTP GET implementation ([65a5a4d](https://github.com/OpenNMS/opennms-js/commit/65a5a4d))
* **result:** add an isSuccess() method ([42a8771](https://github.com/OpenNMS/opennms-js/commit/42a8771))
* **result:** track response type ([387a0cc](https://github.com/OpenNMS/opennms-js/commit/387a0cc))
* implement Client.checkServer() ([a9993d0](https://github.com/OpenNMS/opennms-js/commit/a9993d0))
* **server:** add convenience method to get all metadata ([e040e79](https://github.com/OpenNMS/opennms-js/commit/e040e79))
* **server:** add ServerMetadata.toString() for human-readable version ([b2dc667](https://github.com/OpenNMS/opennms-js/commit/b2dc667))
* **server:** add toString to OnmsServer ([cb5cf95](https://github.com/OpenNMS/opennms-js/commit/cb5cf95))
* **server:** handle absolute URLs cleanly ([5a516a2](https://github.com/OpenNMS/opennms-js/commit/5a516a2))
* **server:** support user/password in OnmsServer constructor ([453f7a5](https://github.com/OpenNMS/opennms-js/commit/453f7a5))
* **server:** use URL if host does not reselve ([614e0bc](https://github.com/OpenNMS/opennms-js/commit/614e0bc))
* **servicetype:** make a singleton map of service types ([bed6390](https://github.com/OpenNMS/opennms-js/commit/bed6390))
* **version:** add toString() for human-readable version ([01060b6](https://github.com/OpenNMS/opennms-js/commit/01060b6))



