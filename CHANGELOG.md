<a name="0.0.1"></a>
## 0.0.1 (2017-06-07)


### Bug Fixes

* **model:** fix empty ServerMetadata initialization of version ([4e200f6](https://github.com/OpenNMS/opennms-js/commit/4e200f6))
* **server:** fix urijs import in node CLI ([98d9320](https://github.com/OpenNMS/opennms-js/commit/98d9320))
* **version:** fix VersionCompare when imported in node CLI ([3fadab3](https://github.com/OpenNMS/opennms-js/commit/3fadab3))


### Features

* **api:** add capabilities ([eddab57](https://github.com/OpenNMS/opennms-js/commit/eddab57))
* **api:** add clone() to some API objects ([7b45c11](https://github.com/OpenNMS/opennms-js/commit/7b45c11))
* **api:** add constants for server type ([725ed3a](https://github.com/OpenNMS/opennms-js/commit/725ed3a))
* **api:** add logging using typescript-logging ([8e1bafe](https://github.com/OpenNMS/opennms-js/commit/8e1bafe))
* **cli:** add a test CLI ([671fbe1](https://github.com/OpenNMS/opennms-js/commit/671fbe1))
* **cli:** add server info display ([93c8778](https://github.com/OpenNMS/opennms-js/commit/93c8778))
* **cli:** implement basic (hardcoded) test alarm fetch ([42b10e4](https://github.com/OpenNMS/opennms-js/commit/42b10e4))
* **cli:** update CLI to use AlarmDAO.find ([043ca70](https://github.com/OpenNMS/opennms-js/commit/043ca70))
* **client:** add a simple connect() method ([fdfb2a4](https://github.com/OpenNMS/opennms-js/commit/fdfb2a4))
* **client:** add basic server check that works on all versions ([dfd45c0](https://github.com/OpenNMS/opennms-js/commit/dfd45c0))
* **dao:** add find method to DAO ([e68baa1](https://github.com/OpenNMS/opennms-js/commit/e68baa1))
* **dao:** add simple alarm and event DAOs ([c962fc2](https://github.com/OpenNMS/opennms-js/commit/c962fc2))
* **enum:** add a toJSON() representation ([1d51f24](https://github.com/OpenNMS/opennms-js/commit/1d51f24))
* **internal:** add utility for parsing IP addresses ([259c16a](https://github.com/OpenNMS/opennms-js/commit/259c16a))
* **model:** add additional properties to alarms and events ([253f23b](https://github.com/OpenNMS/opennms-js/commit/253f23b))
* **model:** add model objects for alarms, events, and more ([b8e76a3](https://github.com/OpenNMS/opennms-js/commit/b8e76a3))
* **rest:** add response-type handling to ReST impls ([9bf2105](https://github.com/OpenNMS/opennms-js/commit/9bf2105))
* **rest:** add SuperAgent HTTP GET implementation ([71af3f9](https://github.com/OpenNMS/opennms-js/commit/71af3f9))
* **rest:** add support for transforming JSON and XML responses ([27e5578](https://github.com/OpenNMS/opennms-js/commit/27e5578))
* **rest:** allow setting the "Accept" type ([5bd300c](https://github.com/OpenNMS/opennms-js/commit/5bd300c))
* implement Client.checkServer() ([a9993d0](https://github.com/OpenNMS/opennms-js/commit/a9993d0))
* **rest:** working Axios HTTP GET implementation ([65a5a4d](https://github.com/OpenNMS/opennms-js/commit/65a5a4d))
* **result:** track response type ([387a0cc](https://github.com/OpenNMS/opennms-js/commit/387a0cc))
* **server:** add convenience method to get all metadata ([e040e79](https://github.com/OpenNMS/opennms-js/commit/e040e79))
* **server:** add ServerMetadata.toString() for human-readable version ([b2dc667](https://github.com/OpenNMS/opennms-js/commit/b2dc667))
* **server:** handle absolute URLs cleanly ([5a516a2](https://github.com/OpenNMS/opennms-js/commit/5a516a2))
* **server:** support user/password in OnmsServer constructor ([453f7a5](https://github.com/OpenNMS/opennms-js/commit/453f7a5))
* **servicetype:** make a singleton map of service types ([bed6390](https://github.com/OpenNMS/opennms-js/commit/bed6390))
* **version:** add toString() for human-readable version ([01060b6](https://github.com/OpenNMS/opennms-js/commit/01060b6))



