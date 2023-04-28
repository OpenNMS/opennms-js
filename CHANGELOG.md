## [2.5.6-SNAPSHOT](https://github.com/OpenNMS/opennms-js/compare/v2.5.5...v2.5.6-SNAPSHOT) (2023-04-28)



## [2.5.5](https://github.com/OpenNMS/opennms-js/compare/v2.5.4...v2.5.5) (2023-03-21)



## [2.5.4](https://github.com/OpenNMS/opennms-js/compare/v2.5.3...v2.5.4) (2023-03-15)



## [2.5.3](https://github.com/OpenNMS/opennms-js/compare/v2.5.2...v2.5.3) (2023-03-15)


### Bug Fixes

* handle stricter typing in updated axios ([cfd42e3](https://github.com/OpenNMS/opennms-js/commit/cfd42e32e4fcb61a4730946fa06e926d0b30d3d5))



## [2.5.2](https://github.com/OpenNMS/opennms-js/compare/v2.5.1...v2.5.2) (2022-12-13)


### Bug Fixes

* **server:** make sure input is always just a string for hashing ([3022964](https://github.com/OpenNMS/opennms-js/commit/30229646161f26a1c3c200d3dbd4455d6ed91979))
* update axios code to match 1.x ([2378662](https://github.com/OpenNMS/opennms-js/commit/2378662f393c4a009649251d8523f297378fe7ee))



## [2.5.1](https://github.com/OpenNMS/opennms-js/compare/v2.5.0...v2.5.1) (2022-09-21)



# [2.5.0](https://github.com/OpenNMS/opennms-js/compare/v2.4.1...v2.5.0) (2022-09-06)


### Bug Fixes

* **bug:** truthy handling for enums when enums contain 0 as  index ([#400](https://github.com/OpenNMS/opennms-js/issues/400)) ([68d2f52](https://github.com/OpenNMS/opennms-js/commit/68d2f5297be236e86a8834bbc4c4dc63224e1f8e))
* **typescript:** handle new implicit unknown in catch ([cc54148](https://github.com/OpenNMS/opennms-js/commit/cc54148fbe5e018084b699b0062852a148ee8a8d))


### Reverts

* Revert "build: always merge the specific revision being tested" ([8e320cf](https://github.com/OpenNMS/opennms-js/commit/8e320cf3ab5783800f155bab60318c924b3e596a))



## [2.4.1](https://github.com/OpenNMS/opennms-js/compare/v2.4.0...v2.4.1) (2022-01-13)



# [2.4.0](https://github.com/OpenNMS/opennms-js/compare/v2.3.0...v2.4.0) (2022-01-13)


### Reverts

* Revert "build(deps): fix a number of dependencies from npm audit" ([e01de80](https://github.com/OpenNMS/opennms-js/commit/e01de80f64c92b10210fa8c522971dfb71dea3d2))



# [2.3.0](https://github.com/OpenNMS/opennms-js/compare/v2.2.0...v2.3.0) (2021-08-24)


### Features

* add SNMP interface, service, and outage support (HELM-228) ([c74b7fb](https://github.com/OpenNMS/opennms-js/commit/c74b7fbc12398b0f643e8414893042d1f3e0f0c8))



# [2.2.0](https://github.com/OpenNMS/opennms-js/compare/v2.1.1...v2.2.0) (2021-08-18)


### Bug Fixes

* **api:** better typescript hints for version compares ([31bc7bb](https://github.com/OpenNMS/opennms-js/commit/31bc7bb4f702253ef534144a5758d65952900931))


### Features

* **dao:** implement /api/v2/ipinterfaces (HELM-188) ([394afce](https://github.com/OpenNMS/opennms-js/commit/394afcea5c370f8cf0eebe14678d16dd2e2c2696))



## [2.1.1](https://github.com/OpenNMS/opennms-js/compare/v2.1.0...v2.1.1) (2021-05-03)



# [2.1.0](https://github.com/OpenNMS/opennms-js/compare/v2.0.2...v2.1.0) (2021-05-03)


### Bug Fixes

* **api:** add missing API, DAO, and Model exports ([e3a7a22](https://github.com/OpenNMS/opennms-js/commit/e3a7a221fe801cc0b8de3c86ed8f1b079281bf4f))
* **docs:** fix version for antora doc generation ([9aab3e8](https://github.com/OpenNMS/opennms-js/commit/9aab3e86b7b2171d19f7e3b9491995d688e72bf1))


### Features

* **docs:** create Antora documentation ([b58b0cf](https://github.com/OpenNMS/opennms-js/commit/b58b0cf2cd386190ee6be4a180b15c8e39045051))
* **tos:** add DSCP and ECN values ([0aa74c9](https://github.com/OpenNMS/opennms-js/commit/0aa74c95801f466bdad45901312a7ba2ed5724b4))
* **tos:** add support to filter by ToS ([89e356f](https://github.com/OpenNMS/opennms-js/commit/89e356fbd373729df78c2f9e38f4f95cd508b030))
* **tos:** fix required versions, refactor meta name ([1817dc8](https://github.com/OpenNMS/opennms-js/commit/1817dc8f2c07c9cdf3309b657677d98d178f6b9b))
* **tos:** remove ecn related code ([1e27742](https://github.com/OpenNMS/opennms-js/commit/1e277423f2be52d45bdd29fa7d40ef62668c92d2))



## [2.0.2](https://github.com/OpenNMS/opennms-js/compare/v2.0.1...v2.0.2) (2020-04-13)


### Bug Fixes

* **rest:** fix response type handling in grafana 6.7 (HELM-232) ([874cd80](https://github.com/OpenNMS/opennms-js/commit/874cd801bc76683b41bd4dda75565e3d9a43f84f))



## [2.0.1](https://github.com/OpenNMS/opennms-js/compare/v2.0.0...v2.0.1) (2019-10-25)


### Bug Fixes

* **dao:** handle .fromData when data is undefined (JS-45) ([efe6858](https://github.com/OpenNMS/opennms-js/commit/efe6858229fd56a61bba224653f9c1e0c250aa01))
* **dao:** warn if lastEvent is missing on an alarm (JS-45) ([e4af27d](https://github.com/OpenNMS/opennms-js/commit/e4af27d2391aa20a10d47465c2fabb8d77dc451d))



# [2.0.0](https://github.com/OpenNMS/opennms-js/compare/v1.5.0...v2.0.0) (2019-09-30)


### Bug Fixes

* **api:** add new OrderBy objects to API export ([ffdadeb](https://github.com/OpenNMS/opennms-js/commit/ffdadeb35dfb436820d354b673d6c1fe84966a4f))
* **api:** options mishandled arrays passed to .addParameter (JS-44) ([2905633](https://github.com/OpenNMS/opennms-js/commit/290563394c6c9f3e6413c049d98f95bd8bb3ca03))
* **api:** remove unneccesary undefinability ([578ed1c](https://github.com/OpenNMS/opennms-js/commit/578ed1c6450e1e2c2c0cbb949ae03ec0b0f5f38f))
* **cli:** bounds-check remaining column width for table render ([54c8919](https://github.com/OpenNMS/opennms-js/commit/54c8919f553b6bb353193b5c3f2f36ceae7c0ff9))
* **cli:** CLI errors should exit immediately non-0 ([943710e](https://github.com/OpenNMS/opennms-js/commit/943710ecea0b0bf2847268899613578ede400b72))
* **client:** set server when checking metadata ([6437884](https://github.com/OpenNMS/opennms-js/commit/64378846b683d49d5c58317395862e2c9b854f23))
* **cli:** fix typo in space-cleaning regex ([de5f5cc](https://github.com/OpenNMS/opennms-js/commit/de5f5cc0358c2f600e35073abed6ca42ef507510))
* **dao:** fix DAO property caching (JS-38) ([178a31d](https://github.com/OpenNMS/opennms-js/commit/178a31d1940f04bccecb39baa959ac17edae2180))
* **filters:** make sure clauses is always initialized ([246ce4c](https://github.com/OpenNMS/opennms-js/commit/246ce4c1c6cc3b8ffe6d294c72d0c80d629aa8ff))
* **log:** fix formatting of log output ([42e89f3](https://github.com/OpenNMS/opennms-js/commit/42e89f370bcc143c425bfeb1c4a562aa8f0d19bb))
* **rest:** assign != apply :D ([1112c7b](https://github.com/OpenNMS/opennms-js/commit/1112c7b708f23e58ae8b5867af4d410dea7451b0))
* **rest:** caught errors in GrafanaHTTP should be re-thrown ([fc35b12](https://github.com/OpenNMS/opennms-js/commit/fc35b122cd12736db1d96525c92ef144e8602960))
* **rest:** fix auth initialization broken during refactor (JS-39) ([85200fd](https://github.com/OpenNMS/opennms-js/commit/85200fd2e1c61a74ebc77a76dd066130a78f56f5))
* **rest:** simplify grafana HTTP config creation ([3f3089b](https://github.com/OpenNMS/opennms-js/commit/3f3089b0c47de3a67a9e2dade82f5c4815a8001e))
* **test:** fix tslint errors ([1606bff](https://github.com/OpenNMS/opennms-js/commit/1606bff8976f23056b54aa8072453ce7f7d88fa0))


### Code Refactoring

* **rest:** pull up authentication into the abstract impl ([6f565bd](https://github.com/OpenNMS/opennms-js/commit/6f565bdac2d19d790a1323fd62a9c304b3033585))


### Features

* add .equals() to various metadata objects ([cf3ff5f](https://github.com/OpenNMS/opennms-js/commit/cf3ff5ff0053ff493ee338b6c55192d1a7b6e42d))
* **api:** add orderBy support to filter queries (HELM-174) ([6e7edfa](https://github.com/OpenNMS/opennms-js/commit/6e7edfaba8872915d196526d78a043b4be947d1c))
* **api:** add support for multi-value parameters ([138f524](https://github.com/OpenNMS/opennms-js/commit/138f524b68e7d55be3239d9884841197439f1a9b))
* **build:** add dependabot auto-updater config ([b0eb941](https://github.com/OpenNMS/opennms-js/commit/b0eb94180f5a044b228de536060cbbad72342d6c))
* **cli:** add orderBy= and order= support to `alarms` ([d67832a](https://github.com/OpenNMS/opennms-js/commit/d67832a1e9843855c715d55732567114d4fa6a18))
* **client:** cache DAOs accessed through the Client API (JS-38) ([76c9205](https://github.com/OpenNMS/opennms-js/commit/76c920556da02cb9a97217b3f91b311430b583a1))
* make common API objects immutable ([0b8407c](https://github.com/OpenNMS/opennms-js/commit/0b8407cdb4f776dbf1e99f176bf571c93ac1ac23))
* **rest:** add HTTP HEAD ([bea34a5](https://github.com/OpenNMS/opennms-js/commit/bea34a583901c5f3f608e440d8e3aec51455f95a))


### BREAKING CHANGES

* **rest:** AbstractHTTP.getServer now throws an error if a
server cannot be returned when it is called.



# [1.5.0](https://github.com/OpenNMS/opennms-js/compare/v1.4.0...v1.5.0) (2019-06-07)


### Bug Fixes

* **cli:** fix broken table formatting in prod cli build (JS-33) ([db50724](https://github.com/OpenNMS/opennms-js/commit/db507241c72e41fbfcc2a27b106121fcaea65b0a))
* **security:** update handlebars, js-yaml, and marked ([f5f4ad2](https://github.com/OpenNMS/opennms-js/commit/f5f4ad2e47cf38b0fca23cdd0c674e7324c18618))
* **security:** upgrade to Axios 0.19.0 ([a731c60](https://github.com/OpenNMS/opennms-js/commit/a731c606a756766b861c85dc78696c046567f054))


### Features

* **drift2:** HZN-1559,HZN-1570,HZN-1571 ([9b684cf](https://github.com/OpenNMS/opennms-js/commit/9b684cf067cabc467d3a9626d0a501ef2c2b3cef))
* **drift2:** HZN-1559,HZN-1570,HZN-1571 ([8afd6a2](https://github.com/OpenNMS/opennms-js/commit/8afd6a2a530c4af792e28466ed72841b08b17299))
* **drift2:** HZN-1559,HZN-1570,HZN-1571 ([1f0fd21](https://github.com/OpenNMS/opennms-js/commit/1f0fd214349e656a225e0bcdcd47861c61c79453))
* **drift2:** HZN-1559,HZN-1570,HZN-1571 ([77b094d](https://github.com/OpenNMS/opennms-js/commit/77b094d16e7406a36e7f830ed9e8364327e4a4f2))



# [1.4.0](https://github.com/OpenNMS/opennms-js/compare/v1.3.1...v1.4.0) (2019-04-09)


### Features

* **alarms:** HZN-1492 : Add RootCause and Tags to SituationFeedback ([#35](https://github.com/OpenNMS/opennms-js/issues/35)) ([3790072](https://github.com/OpenNMS/opennms-js/commit/37900725f5f97fb4ff22114ea411018686c03243))
* **dao:** JS-29 - add support for "isAcknowledged" on alarms ([ff1515a](https://github.com/OpenNMS/opennms-js/commit/ff1515ab0588e2e978169f5a146e0497cbee9096))



## [1.3.1](https://github.com/OpenNMS/opennms-js/compare/v1.3.0...v1.3.1) (2019-03-27)


### Bug Fixes

* **build:** JS-28 - don't mangle function names ([07100ca](https://github.com/OpenNMS/opennms-js/commit/07100ca82cf3e3e128a42632bf1bf9c03a54faf3))
* **build:** JS-31 - fix all outstanding audit warnings ([ace9779](https://github.com/OpenNMS/opennms-js/commit/ace9779b3981e1e66abaa1cba53b7011de7674dd))
* **cli:** fix alarm cli when no alarms are returned ([75c6a9a](https://github.com/OpenNMS/opennms-js/commit/75c6a9aac1d02c757b9df5646ed23e3d9402eda4))


### Features

* **api:** JS-30 - reconstitute Filter/Clause/Restrictions from JSON ([891bbd1](https://github.com/OpenNMS/opennms-js/commit/891bbd1cb69e6accaf69f0d4eb6b135dbdd7c422))



# [1.3.0](https://github.com/OpenNMS/opennms-js/compare/v1.2.2...v1.3.0) (2018-12-07)


### Bug Fixes

* **api:** *support* flow data ([bd8c5b9](https://github.com/OpenNMS/opennms-js/commit/bd8c5b99a6bc26626be9af0c7373711e564d807d))
* **feedback:** Serialize the enum as a string ([3c2f997](https://github.com/OpenNMS/opennms-js/commit/3c2f9978f8a1023eaffde0cde6b9f81fb85601ad))


### Features

* **alarms:** HELM-110: store managedObject* if present ([2b86722](https://github.com/OpenNMS/opennms-js/commit/2b8672297bf7897231195595d941659b1efdd3b7))
* **alarms:** HELM-114: alarm property for whether it is a situation ([a54b627](https://github.com/OpenNMS/opennms-js/commit/a54b6270566c282b57c42a3f88d662a373ebe44c))
* **api:** add flow and situation metadata APIs ([42d7a58](https://github.com/OpenNMS/opennms-js/commit/42d7a58b7e785d4998fbb673c46847058e62bd8f))
* **api:** Add more test assertions for AlarmSummaryDTO ([0f45e79](https://github.com/OpenNMS/opennms-js/commit/0f45e79e7780b325bacd7f04b3b919136037e3fb))
* **api:** Add test for AlarmSummary and reductionKey ([3329cf7](https://github.com/OpenNMS/opennms-js/commit/3329cf7200184e9480325daefc88f35b1ce73901))
* **api:** HZN-1357 expose FeedbackDAO ([d354040](https://github.com/OpenNMS/opennms-js/commit/d354040a6a702e8816719ba7e4ef66a8a1ce3c7e))
* **api:** HZN-1357 Pass data and set accept header ([0bf0bdd](https://github.com/OpenNMS/opennms-js/commit/0bf0bdd200eef46d7b11fbccaa529c2018408d0a))
* **api:** HZN-1357 tests for uri.js ([e98cfa4](https://github.com/OpenNMS/opennms-js/commit/e98cfa4df8f0a66e6c0a98ee976b0df9df161668))
* **api:** HZN-1357 use AlarmId for Situation ([3d9f172](https://github.com/OpenNMS/opennms-js/commit/3d9f17200e0850948c2b54dcfc33148d82a4b05b))
* **api:** Initial work ([fa62503](https://github.com/OpenNMS/opennms-js/commit/fa6250351ad01d6f9cf6ea829b50e00a9f36c5be))
* **api:** Move from 'impacts/causes' to 'relatedAlarms' ([3bc5b6e](https://github.com/OpenNMS/opennms-js/commit/3bc5b6e18208aa458dcfc9af5949e0976ff7c0ca))
* **api:** OCE-REST extend Alarm and summary ([24ca0f7](https://github.com/OpenNMS/opennms-js/commit/24ca0f7a87963f50fb00954513af42b1ef5af53e))
* **api:** OCE-REST extend Alarm and summary ([e855134](https://github.com/OpenNMS/opennms-js/commit/e855134736566af92a1665c815ef3d1a072ecf1a))
* **api:** OCE-REST remove inSituation attr ([d3bb9e9](https://github.com/OpenNMS/opennms-js/commit/d3bb9e94165ab2f5860031a15acff6280d833780))
* **api:** OCE-REST updte tests ([abd86d1](https://github.com/OpenNMS/opennms-js/commit/abd86d199a18c8cc6942aef67aac9605743de695))
* **cli:** improve table rendering ([da92bdb](https://github.com/OpenNMS/opennms-js/commit/da92bdb09fe1f33160f8fead5669fe7024aa420a))
* **feedback:** Expose the feedback type enum values ([500632a](https://github.com/OpenNMS/opennms-js/commit/500632a4e5efcdb6fcefca27df0afc6ac3d676d4))



## [1.2.2](https://github.com/OpenNMS/opennms-js/compare/v1.2.1...v1.2.2) (2018-05-17)


### Bug Fixes

* **dao:** HELM-91: fix handling non-array results ([0707ac7](https://github.com/OpenNMS/opennms-js/commit/0707ac78bb68a47f33693cf81776bdaa5b90fb1c))



## [1.2.1](https://github.com/OpenNMS/opennms-js/compare/v1.2.0...v1.2.1) (2018-04-13)


### Bug Fixes

* **rest:** fix HTTP timeout configuration to be more consistent ([c8e7162](https://github.com/OpenNMS/opennms-js/commit/c8e71628e7d9c76559d2cec1efe369fe726db130))



# [1.2.0](https://github.com/OpenNMS/opennms-js/compare/v1.1.1...v1.2.0) (2018-03-30)


### Bug Fixes

* **http:** add timeout to GrafanaHTTP ([22bdd70](https://github.com/OpenNMS/opennms-js/commit/22bdd70e1780af02a5f969636c0f4bbcb123d21f))


### Features

* **rest:** NMS-9783: add X-Requested-With header to requests ([e803726](https://github.com/OpenNMS/opennms-js/commit/e80372616c08422e5f6c805c12de31366af455b3))



## [1.1.1](https://github.com/OpenNMS/opennms-js/compare/v1.1.0...v1.1.1) (2018-03-16)



## [1.0.3](https://github.com/OpenNMS/opennms-js/compare/v1.0.2...v1.0.3) (2018-02-13)



## [1.0.2](https://github.com/OpenNMS/opennms-js/compare/v1.0.1...v1.0.2) (2017-09-25)



## [1.0.1](https://github.com/OpenNMS/opennms-js/compare/v1.0.0...v1.0.1) (2017-09-13)



# [1.0.0](https://github.com/OpenNMS/opennms-js/compare/v1.0.0-beta.1...v1.0.0) (2017-09-08)


### Features

* **cli:** add --version, also a warning about passwords ([1c07be9](https://github.com/OpenNMS/opennms-js/commit/1c07be9e541253af7717240825f73a7586f30e12))



# [0.1.0-alpha.3](https://github.com/OpenNMS/opennms-js/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2017-07-21)



# [1.1.0](https://github.com/OpenNMS/opennms-js/compare/v1.0.3...v1.1.0) (2018-03-16)


### Features

* **dao:** Add flow support ([e37e73f](https://github.com/OpenNMS/opennms-js/commit/e37e73f5cb90386eb7b5f5530494866d8fccd87f))



## [1.0.3](https://github.com/OpenNMS/opennms-js/compare/v1.0.2...v1.0.3) (2018-02-13)


### Bug Fixes

* **cli:** Valid example for node label searches ([2eafce8](https://github.com/OpenNMS/opennms-js/commit/2eafce8bf89cdbb32787ade5a797caa40adcddd9))
* **dao:** node search properties are supported in ReSTv2 ([71c3354](https://github.com/OpenNMS/opennms-js/commit/71c33545c52e24e4178af8c9bea60f385d93cf88))


### Features

* **model:** add interface to denote serialization to a URL parameter ([b983abf](https://github.com/OpenNMS/opennms-js/commit/b983abfdc7e55bf8c67d0da3964a6ffcf0803b2d))



## [1.0.2](https://github.com/OpenNMS/opennms-js/compare/v1.0.1...v1.0.2) (2017-09-25)


### Bug Fixes

* **rest:** allow ReSTv2 for Horizon 20.1.x ([bd1dd59](https://github.com/OpenNMS/opennms-js/commit/bd1dd59e3712473c019c9b5ccdf3b3f4d652d967))



## [1.0.1](https://github.com/OpenNMS/opennms-js/compare/v1.0.0...v1.0.1) (2017-09-13)


### Bug Fixes

* **grafana:** set the Authorization header ([d48f931](https://github.com/OpenNMS/opennms-js/commit/d48f931b3fe8c8bf76f2f4caeb1776926f24df86))



# [1.0.0](https://github.com/OpenNMS/opennms-js/compare/v1.0.0-beta.1...v1.0.0) (2017-09-08)


### Bug Fixes

* **api:** add missing modules to API export ([53fad98](https://github.com/OpenNMS/opennms-js/commit/53fad980a5aa3cb2c9151dc1610a8a76dfee732d))
* **api:** add workaround for Error init + clean up docs ([6f7a4ab](https://github.com/OpenNMS/opennms-js/commit/6f7a4aba2195d6298becddd3b09137e285e8b938))
* **api:** fix comparator matching ([6897389](https://github.com/OpenNMS/opennms-js/commit/6897389b6107019101e172f64c243c3bbbc844c6))
* **api:** handle Meridian properly in useJson ([740cdf1](https://github.com/OpenNMS/opennms-js/commit/740cdf1ea78149c6e668938bbb75010c582e6b39))
* **dao:** fix handling of 204s in Grafana - the data is null ([55028cb](https://github.com/OpenNMS/opennms-js/commit/55028cba0ab6fd879540933fd2436815bcf5a6dd))
* **dao:** Map troubleTicketState properly (JS-24) ([86fc298](https://github.com/OpenNMS/opennms-js/commit/86fc2986e7ea8a6b581e7a1ebb6908107670cabc))
* **dao:** URL-encode FIQL values (NMS-9578) ([9a335e8](https://github.com/OpenNMS/opennms-js/commit/9a335e892ffad6bff7ee2aff522dd8e2de2e5185))
* **js-10:** Handle single alarm (xml) result properly ([544c174](https://github.com/OpenNMS/opennms-js/commit/544c17406a47de63272accfd5972d691d07815e9))
* **js-12:** Make breakpoints work ([13fb9ae](https://github.com/OpenNMS/opennms-js/commit/13fb9ae9769b2cfd0a28b8c068f516b782086a9a))
* **log:** bump logging of missing count down to DEBUG ([00b3e1b](https://github.com/OpenNMS/opennms-js/commit/00b3e1b2bc938b3da3e5be6659527f972f2cfd96))
* **rest:** Do not reset headers when headers defined ([2f360fd](https://github.com/OpenNMS/opennms-js/commit/2f360fd7a48d8abf8259eacbe6aa8181cb6419e4))
* **rest:** Do not set responseType on request ([0c2b6f4](https://github.com/OpenNMS/opennms-js/commit/0c2b6f401721e4dfdb9d44fe46bbd7bdd5d38b53))
* **rest:** fix clonedeep import in the CLI ([e2e9d79](https://github.com/OpenNMS/opennms-js/commit/e2e9d79a645626fd994c1dccc13253e0db1531be))
* **rest:** fix crash when options is undefined in getServer ([7768b48](https://github.com/OpenNMS/opennms-js/commit/7768b4804e5ac6e79ac7605f79304f473c709c3c))
* **rest:** make sure passed options don't leak ([9b9dee4](https://github.com/OpenNMS/opennms-js/commit/9b9dee4677c956faff6f0f38d59de07f0d8077b5))
* **rest:** only set up global if it exists (eg, Node.js, not browser) ([7a1b2c3](https://github.com/OpenNMS/opennms-js/commit/7a1b2c37172016fad666cb68339c59b228cec19d))
* **rest:** Use err.data.response if exists as message ([4875b9c](https://github.com/OpenNMS/opennms-js/commit/4875b9c3d9e4dbd20c95831937fff85d6946a663))
* **rest:** use negative offset for dates to work around a server issue ([abdfc0b](https://github.com/OpenNMS/opennms-js/commit/abdfc0bc264f0f1f4a86815c52f9e6e894f7b1e2))
* **rest:** webpack still needs to fake global for browsers ([8f7fa5a](https://github.com/OpenNMS/opennms-js/commit/8f7fa5aaea7a69aac5f03ed0913616e38d324aba))


### Features

* **alarms:** add support for manipulating journal and sticky memos ([875e268](https://github.com/OpenNMS/opennms-js/commit/875e2689c69a3b4eb397021ca07adc4baf50d024))
* **alarms:** expose a link to the alarm details page (HELM-55) ([8795818](https://github.com/OpenNMS/opennms-js/commit/8795818d639dd83f4e2e2de5d800c0c4220be395))
* **alarms:** implement ticket create/update/close ([93ff386](https://github.com/OpenNMS/opennms-js/commit/93ff386a986f029c08e88d682064177df6e8d99c))
* **api:** add "ISNULL" alias to comparator ([3a243a5](https://github.com/OpenNMS/opennms-js/commit/3a243a54021f20db015bb1d7c11936c54d4ba976))
* **api:** add metadata call to detect ticketer config support ([bf0255b](https://github.com/OpenNMS/opennms-js/commit/bf0255babb434d83734b7176214cc2fd2288d664))
* **api:** consider 202 a successful HTTP response ([d21e5e1](https://github.com/OpenNMS/opennms-js/commit/d21e5e1b98c913a9fce05ebc730c31b57d6ee80a))
* **api:** Include ticketer configuration. JS-17 ([2728734](https://github.com/OpenNMS/opennms-js/commit/272873415e3977caac9599a38cc465c137fbd94b))
* **api:** static method for matching a comparator ([df90751](https://github.com/OpenNMS/opennms-js/commit/df907513bbf57fbcd02aaca05e786a260b3e7540))
* **cli:** add --version, also a warning about passwords ([cd425cb](https://github.com/OpenNMS/opennms-js/commit/cd425cbb2e1acbed86587de9869fb24e164cb4ec))
* **cli:** add --version, also a warning about passwords ([1c07be9](https://github.com/OpenNMS/opennms-js/commit/1c07be9e541253af7717240825f73a7586f30e12))
* **cli:** make a cli bundle in dist/ ([02298d7](https://github.com/OpenNMS/opennms-js/commit/02298d7f87ba626b8291edceead9a2ed2b6dfc07))
* **dao:** add alarm setTTicketId/setTTicketState ([bb429f6](https://github.com/OpenNMS/opennms-js/commit/bb429f6bfb1d7a4a26a5a864d1d97be6914cb277))
* **dao:** Add capability to fetch values from alarm v2 endpoint (JS-22) ([637443f](https://github.com/OpenNMS/opennms-js/commit/637443f7f53db15d2bbe8a997e59e5caac317094))
* **dao:** Add more complex null value handling for v2 (JS-20) ([7817b4a](https://github.com/OpenNMS/opennms-js/commit/7817b4a5579f92ab72368fbcc5c108ff11d16420))
* **dao:** add ReSTv2 support to event and node DAOs ([c524493](https://github.com/OpenNMS/opennms-js/commit/c52449388083f74ebc3c7547baf4203d7b0da9da))
* **dao:** add user parameter to unack (JS-19) ([90c128d](https://github.com/OpenNMS/opennms-js/commit/90c128d7c5eeda912c434aed4f2c387c90e52b22))
* **dao:** expose the event label and locations (HELM-13) ([3395039](https://github.com/OpenNMS/opennms-js/commit/3395039e9c5f81c399bee90acb304ac2a82e3dc3))
* **dao:** implement querying ReSTv2 search properties ([a588325](https://github.com/OpenNMS/opennms-js/commit/a588325934087bbca48a4561893942ad96c8513c))
* **dao:** Include comparators and values (JS-11) ([9ad41d2](https://github.com/OpenNMS/opennms-js/commit/9ad41d2009643988613c591c2167e01dd4eb639b))
* **dao:** Include troubleTicketLink if defined (JS-23) ([7420218](https://github.com/OpenNMS/opennms-js/commit/74202182ef61832c1bc723dcb194d3355ca92409))
* **dao:** support dates in query parameters (JS-15) ([d9884b6](https://github.com/OpenNMS/opennms-js/commit/d9884b6fa0f39ac783a48f2a0cebb6e7ea3b9d84))
* **dao:** use JSON against modern (19+) OpenNMS instead of XML ([c17db2c](https://github.com/OpenNMS/opennms-js/commit/c17db2c5e4d183c8870108f4602d85617f07fa6d))
* **internal:** add utility methods for dealing with dates ([c40450b](https://github.com/OpenNMS/opennms-js/commit/c40450b148ad0fe1f93b7333022a1b415aed5910))
* **rest:** add POST support ([d3af9e2](https://github.com/OpenNMS/opennms-js/commit/d3af9e209916f40d148cc78a3e637ad5ca43f1b0))
* **rest:** Improve OnmsError object and GrafanaHttp error handling ([72d6e32](https://github.com/OpenNMS/opennms-js/commit/72d6e32153e2518b61b407e79ab056d901c4a364))
* **rest:** only parse requests on success (JS-13) ([aa9257d](https://github.com/OpenNMS/opennms-js/commit/aa9257d7a2a2b9b618b0f27bdbb4f4d08cea8381))
* **rest:** return a useful OnmsResult on error ([094399c](https://github.com/OpenNMS/opennms-js/commit/094399c22a77a04b94bba464359bc184bb6d1de8))



# [0.1.0-alpha.3](https://github.com/OpenNMS/opennms-js/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2017-07-21)


### Bug Fixes

* **browser:** fix error when using the dev .js file in a browser ([ee7d22a](https://github.com/OpenNMS/opennms-js/commit/ee7d22a578f69adf820b26b654819cdad1e26e66))
* **cli:** only attempt to read the configuration file if it exists ([2339c6d](https://github.com/OpenNMS/opennms-js/commit/2339c6d9118d8782ceb371206a84ef2d1efc49d5))
* **dao:** handle single-entry array responses ([6c66be6](https://github.com/OpenNMS/opennms-js/commit/6c66be644edc2db36d4468bb382af2004b507c9b))
* **rest:** fix axios include handling ([e461831](https://github.com/OpenNMS/opennms-js/commit/e4618316dac0ec7c3293928919c5203d645441ee))
* **rest:** fix handling of XML data in node ([70fd445](https://github.com/OpenNMS/opennms-js/commit/70fd445e5a23f81c21bdb6d6291460ef2aac03ec))
* **rest:** generate a node version with webpack ([58d2938](https://github.com/OpenNMS/opennms-js/commit/58d2938eb1fb19b7f465a09c456e6fcf08ced157))
* **v2:** consider the server type when comparing the version numbers ([e2c03ee](https://github.com/OpenNMS/opennms-js/commit/e2c03eefd14f174e4c7721a627712b42726b5d07))
* **v2:** fix handling of 204 codes ([a352ea8](https://github.com/OpenNMS/opennms-js/commit/a352ea8a096abf83562555c3eb14cb2565be4090))
* **v2:** remove the implicit wildcards ([4940010](https://github.com/OpenNMS/opennms-js/commit/49400106290806b844ac6d0c2b9f279c3a4cf9f7))


### Features

* **alarms:** expose the sticky and journal memos ([adbcb3a](https://github.com/OpenNMS/opennms-js/commit/adbcb3af7e5c205193686202edde3ba1dd7ba515))
* **dao:** add alarm ack/unack/escalate/clear support ([f44f8d7](https://github.com/OpenNMS/opennms-js/commit/f44f8d7ceac84d81966ccc62960b560ab9b85017))
* **rest:** add PUT support ([b50d99e](https://github.com/OpenNMS/opennms-js/commit/b50d99e10fcbe09f7daa9b13be5d55ac359ee418))
* **v2:** add support for nested restrictions with boolean operators ([09cd705](https://github.com/OpenNMS/opennms-js/commit/09cd705a82a4d78f70073c6214ec047d477dbc05))
* **v2:** add support for the v2 api ([eb1b165](https://github.com/OpenNMS/opennms-js/commit/eb1b1658f35ade8195097c79f097dc1de34caa1c))



# [0.1.0-alpha.2](https://github.com/OpenNMS/opennms-js/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2017-06-19)



# [0.1.0-alpha.1](https://github.com/OpenNMS/opennms-js/compare/725ed3ad8c4347c7d2328ab6eeca1480c837362a...v0.1.0-alpha.1) (2017-06-19)


### Bug Fixes

* **api:** add missing exports to API, clean up imports ([36f8125](https://github.com/OpenNMS/opennms-js/commit/36f81252ec9885691a01f64e3a4df36911a6183f))
* **enum:** fix handling of number indexes ([c3638a6](https://github.com/OpenNMS/opennms-js/commit/c3638a63fae8517f835190b75c69be558365f5bb))
* **model:** fix empty ServerMetadata initialization of version ([4e200f6](https://github.com/OpenNMS/opennms-js/commit/4e200f6d2ded2ebc5d08b6a41ced4ca40bfc7ab6))
* **moment:** fix momentjs usage ([05f3a1f](https://github.com/OpenNMS/opennms-js/commit/05f3a1ff84966efb6163ebb9fd854a97097d3430))
* **rest:** fix XML parsing result to match JSON ([073ac1f](https://github.com/OpenNMS/opennms-js/commit/073ac1f4d4aff52688bde79bf42a4886b4f81371))
* **rest:** HTTP implementation get() debug includes params ([0b4b87f](https://github.com/OpenNMS/opennms-js/commit/0b4b87f0cdeffd03974d34ecb5fb1152bc576b4d))
* **server:** fix urijs import in node CLI ([98d9320](https://github.com/OpenNMS/opennms-js/commit/98d9320e2f32db2cb8328c0d8ef6dc7aa2e31bee))
* **version:** fix VersionCompare when imported in node CLI ([3fadab3](https://github.com/OpenNMS/opennms-js/commit/3fadab34d3a2ce737317aadb1df3a080db4a0fae))


### Features

* **api:** add capabilities ([eddab57](https://github.com/OpenNMS/opennms-js/commit/eddab57e0c696c9907048de45005c8d225a2b663))
* **api:** add clone() to some API objects ([7b45c11](https://github.com/OpenNMS/opennms-js/commit/7b45c114e6ed78e126e9a06ae80b17a520148a42))
* **api:** add constants for server type ([725ed3a](https://github.com/OpenNMS/opennms-js/commit/725ed3ad8c4347c7d2328ab6eeca1480c837362a))
* **api:** add full DAO filtering support ([fe2204c](https://github.com/OpenNMS/opennms-js/commit/fe2204c9021e197fdca3981bfbf25aac9c5d2993))
* **api:** add logging using typescript-logging ([8e1bafe](https://github.com/OpenNMS/opennms-js/commit/8e1bafef1ffc34a394047c4b59a270c541fdc3ee))
* **api:** expose LogLevel and setLogLevel in the API ([9a9b512](https://github.com/OpenNMS/opennms-js/commit/9a9b512d100b50c389cacc3a12cca03319196fcf))
* **cli:** add a test CLI ([671fbe1](https://github.com/OpenNMS/opennms-js/commit/671fbe1fad21c34ce7e8946a281bf737462598db))
* **cli:** add server info display ([93c8778](https://github.com/OpenNMS/opennms-js/commit/93c8778ab7269b1879225c7711b4f1513a6dc8be))
* **client:** add a simple connect() method ([fdfb2a4](https://github.com/OpenNMS/opennms-js/commit/fdfb2a4704ed2edc0ce9480d2c13c67c28f7998c))
* **client:** add basic server check that works on all versions ([dfd45c0](https://github.com/OpenNMS/opennms-js/commit/dfd45c09eab60b61df67149d29fce4d7e226bf21))
* **cli:** implement basic (hardcoded) test alarm fetch ([42b10e4](https://github.com/OpenNMS/opennms-js/commit/42b10e44f8fc89dd43ed0413f698faba76c648c4))
* **cli:** update CLI to use AlarmDAO.find ([043ca70](https://github.com/OpenNMS/opennms-js/commit/043ca70b1423301b188a34585a0a5644d22b218b))
* **dao:** add date/number parsers for DAOs ([d1a7b0d](https://github.com/OpenNMS/opennms-js/commit/d1a7b0de149c8bb89a4743d9f984cf74b95c3309))
* **dao:** add find method to DAO ([e68baa1](https://github.com/OpenNMS/opennms-js/commit/e68baa196803f1ffc925a8b522e83c5b89e74c55))
* **dao:** add node sub-model support ([6b2577f](https://github.com/OpenNMS/opennms-js/commit/6b2577f1ed862b3f5601e96f6ad72bd849134981))
* **dao:** add preliminary NodeDAO and models ([81f52f3](https://github.com/OpenNMS/opennms-js/commit/81f52f32da77e6ef97eb3457b721f3a24e0b850b))
* **dao:** add simple alarm and event DAOs ([c962fc2](https://github.com/OpenNMS/opennms-js/commit/c962fc2370fdd815670fea7fd1db38b932ffd731))
* **dao:** add utility method for getting the result count ([2c548b5](https://github.com/OpenNMS/opennms-js/commit/2c548b597a8e8a50b31f781d8dd552d196e1a65a))
* **enum:** add a toJSON() representation ([1d51f24](https://github.com/OpenNMS/opennms-js/commit/1d51f240157b901a5f917859868cbc41d07eac5c))
* implement Client.checkServer() ([a9993d0](https://github.com/OpenNMS/opennms-js/commit/a9993d0666e07304189428f94bf89bc69540020a))
* **internal:** add utility for parsing IP addresses ([259c16a](https://github.com/OpenNMS/opennms-js/commit/259c16af30153baa3c572d1243bce9c22072decd))
* **model:** add a MAC address (PhysAddr) object ([6a724e8](https://github.com/OpenNMS/opennms-js/commit/6a724e8f1dd57f923f9f8c46a9c3bf2ee5f67ec9))
* **model:** add additional properties to alarms and events ([253f23b](https://github.com/OpenNMS/opennms-js/commit/253f23b885af99ecd2dcacded8290bc4efc888ea))
* **model:** add model objects for alarms, events, and more ([b8e76a3](https://github.com/OpenNMS/opennms-js/commit/b8e76a35d892221f3b9e2372a1c5ed1420c814e0))
* **options:** add support for parameters ([21f855c](https://github.com/OpenNMS/opennms-js/commit/21f855cb89d2a712ce13a5c624cd2523df78b80a))
* **rest:** add Filter to the API ([4152329](https://github.com/OpenNMS/opennms-js/commit/4152329f4e9482ff2f6bdabf80e693abd2faf366))
* **rest:** add Grafana HTTP adapter ([f8bfed6](https://github.com/OpenNMS/opennms-js/commit/f8bfed6aa02c0b74900d59472bede73392f3490d))
* **rest:** add response-type handling to ReST impls ([9bf2105](https://github.com/OpenNMS/opennms-js/commit/9bf21054c39171608ec55250f98f4e2b28126a11))
* **rest:** add SuperAgent HTTP GET implementation ([71af3f9](https://github.com/OpenNMS/opennms-js/commit/71af3f9dd990118974265a62898fbd24c960ea35))
* **rest:** add support for transforming JSON and XML responses ([27e5578](https://github.com/OpenNMS/opennms-js/commit/27e5578006b7877ad1ea26c07435e0c0c9a8f60e))
* **rest:** allow setting the "Accept" type ([5bd300c](https://github.com/OpenNMS/opennms-js/commit/5bd300ca538131845ee4e881c61c8e3d97b9d055))
* **rest:** working Axios HTTP GET implementation ([65a5a4d](https://github.com/OpenNMS/opennms-js/commit/65a5a4d458e52233fa59c39570071c6eddfd749c))
* **result:** add an isSuccess() method ([42a8771](https://github.com/OpenNMS/opennms-js/commit/42a8771a92b7fb4c8a3028cd3bfa2ec452498cbf))
* **result:** track response type ([387a0cc](https://github.com/OpenNMS/opennms-js/commit/387a0cc8597ecb80cfe1de53271555f9332d6c57))
* **server:** add convenience method to get all metadata ([e040e79](https://github.com/OpenNMS/opennms-js/commit/e040e79f9525be563b17b3834956075d2ee1318c))
* **server:** add ServerMetadata.toString() for human-readable version ([b2dc667](https://github.com/OpenNMS/opennms-js/commit/b2dc667ad8df952c05f29a823f9619699e6f504c))
* **server:** add toString to OnmsServer ([cb5cf95](https://github.com/OpenNMS/opennms-js/commit/cb5cf951d8ec4cfb26b0e8d865b265d41cc8327f))
* **server:** handle absolute URLs cleanly ([5a516a2](https://github.com/OpenNMS/opennms-js/commit/5a516a259b0ab2cac0cc1ab45690d5a9a2ddc944))
* **server:** support user/password in OnmsServer constructor ([453f7a5](https://github.com/OpenNMS/opennms-js/commit/453f7a5e2a8cc0879638b84656d67e75724f2a1c))
* **server:** use URL if host does not reselve ([614e0bc](https://github.com/OpenNMS/opennms-js/commit/614e0bc81f8998c304c257f524bc1bdb8c661c44))
* **servicetype:** make a singleton map of service types ([bed6390](https://github.com/OpenNMS/opennms-js/commit/bed6390c594357092d4570c9b8ee09aade32174e))
* **version:** add toString() for human-readable version ([01060b6](https://github.com/OpenNMS/opennms-js/commit/01060b697b78480e8ca92e6a7e78d7065a8cb4c7))



