# How to Use OpenNMS.js

# Getting Started

If you are using TypeScript, you can import the API directly:

```javascript
import {API, Model, Rest, DAO, Client} from 'opennms/src/API';

new Client().connect('Demo', 'https://demo.opennms.org/opennms', 'demo', 'demo').then((client) => {
  // do something
});
```

# Making Queries

To make a query, OpenNMS.js provides a number of DAO APIs for accessing data through ReST.
To do so, you first connect (like above), and then call into the appropriate DAO to query.
Here's an example in Node.js:

```javascript
const opennms = require('./dist/opennms.node');

const Client = opennms.Client;
const Comparators = opennms.API.Comparators;
const Filter = opennms.API.Filter;
const Restriction = opennms.API.Restriction;

new Client().connect('Demo', 'https://demo.opennms.org/opennms', 'demo', 'demo').then((client) => {
  const filter = new Filter()
    .withOrRestriction(new Restriction('id', Comparators.GE, 1));
  // query all alarms with an ID greater than or equal to 1
  return client.alarms().find(filter).then((alarms) => {
    console.log('got ' + alarms.length + ' alarms.');
    // return all the (unique) node IDs associated with the matching alarms
    const allNodeIds = alarms.map((alarm) => {
      return alarm.nodeId;
    }).filter((nodeId) => {
      return nodeId !== undefined;
    });
    return allNodeIds.filter((v,i,a)=>allNodeIds.indexOf(v)===i);
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
    return true;
  });
}).catch((err) => {
  console.log('error:',err);
  console.log(err.stack);
  throw err;
});
```
