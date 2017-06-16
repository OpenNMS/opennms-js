# How to Use OpenNMS.js

# Getting Started

```javascript
import {API, Model, Rest, DAO, Client} from 'dist/opennms.min.js';

new Client().connect('Demo', 'https://demo.opennms.org/opennms', 'demo', 'demo').then((client) => {
  // do something
});
```

# Making Queries

To make a query, OpenNMS.js provides a number of DAO APIs for accessing data through rest queries.  To do so, you first connect (as above), and then call into the appropriate DAO to query.

```javascript
import {
  Client,
  API.Comparators as Comparators,
  API.Filter as Filter,
  API.Restriction as Restriction,
} from 'dist/opennms.min.js';

new Client().connect('Demo', 'https://demo.opennms.org/opennms', 'demo', 'demo').then((client) => {
  client.alarms().find(new Filter(new Restriction('id', Comparators.EQ, 1))).then((alarms) => {
    // do something with the array of alarms
  });
});
```
