# Toki-Hapi-Bridge <!-- Repo Name -->
> Allow the Toki project to be hosted on the hapiJS stack <!-- Repo Brief Description -->

<!-- Long Description -->
This is a bridge designed to facilitate using parts of the Toki project on a hapi based server.

<!-- Maintainer (Hint, probably you) -->
Lead Maintainer: [Derrick Hinkle](https://github.com/dhinklexo)

<!-- Badges Go Here -->

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
