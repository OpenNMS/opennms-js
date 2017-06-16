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
  const idRestriction = new Restriction('id', Comparators.GE, 1);
  const filter = new Filter(idRestriction);
  // query all alarms with an ID greater than or equal to 1
  client.alarms().find(filter).then((alarms) => {
    // return all the node IDs associated with the matching alarms
    return alarms.map((alarm) => {
      return alarm.nodeId;
    }).filter((nodeId) => {
      return nodeId !== undefined;
    });
  }).then((nodeIds) => {
    // for each node ID, request the node info
    return Promise.all(nodeIds.map((nodeId) => {
      // the true argument fills in ipInterfaces and snmpInterfaces on the returned node
      return client.nodes().get(nodeId, true);
    }));
  }).then((nodes) => {
    // for each node, print how many interfaces it has
    nodes.forEach((node) => {
      console.log('node ' + node.id + ' (' + node.label + ') has '
        + node.ipInterfaces.length + ' IP interfaces');
    });
  });
});
```
