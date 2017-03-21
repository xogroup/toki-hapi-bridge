# Examples

## Hooking up the plugin

```javascript
const HapiTokiBridge = require('hapi-toki-bridge');
const Hapi = require('hapi');

const server = new Hapi.Server({});
server.plugin(HapiTokiBridge);
```

## Setting up routes inside Toki

```javascript
module.exports = (server)=>{
    server.route({
        method: 'GET',
        path: '/hello',
        handler: (request, response)=>{
            return response.send({hello: 'world'}).code(200);
        }
    });

    //shorthand for route(), showing params in urls
    server.get('/hello/{name}', (request, response)=>{
        return response.send({hello: request.params.name}).statusCode(200);
    });
};
```
