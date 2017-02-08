# Toki-Hapi-Bridge <!-- Repo Name -->
> Allow the Toki project to be hosted on the hapiJS stack <!-- Repo Brief Description -->

<!-- Long Description -->
This is a bridge designed to facilitate using parts of the Toki project on a hapi based server.

<!-- Maintainer (Hint, probably you) -->
Lead Maintainer: [Derrick Hinkle](https://github.com/dhinklexo)

<!-- Badges Go Here -->
[![Build Status](https://travis-ci.org/xogroup/toki-hapi-bridge.svg?branch=master)](https://travis-ci.org/xogroup/toki-hapi-bridge)
[![Known Vulnerabilities](https://snyk.io/test/github/xogroup/toki-hapi-bridge/badge.svg)](https://snyk.io/test/github/xogroup/toki-hapi-bridge)
[![NSP Status](https://nodesecurity.io/orgs/xo-group/projects/4f17f141-56c4-4cb9-80a4-665c514d73cc/badge)](https://nodesecurity.io/orgs/xo-group/projects/4f17f141-56c4-4cb9-80a4-665c514d73cc)
<!-- End Badges -->
<!-- Quick Example -->
## Example
```Javascript
const bridge = require('toki-hapi-bridge');
server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 5000
});

return server.register(bridge);
```

More examples can be found in [the examples document](Example.md) and the full api in the [API documentation](API.md).

<!-- Anything Else (Sponsors, Links, Etc) -->
