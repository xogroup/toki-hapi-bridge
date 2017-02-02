#chronos-shim-hapi
This is a bridge designed to facilitate using Chronos on a hapi based server.

## Download

```bash
npm install --save chronos-shim-hapi
```

## Usage
```Javascript
const bridge = require('chronos-shim-hapi');
server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 5000
});

return server.register(bridge);
```

## Contracts

### Server
We expose the following generic routing method:
```javascript
route({
        method: 'GET',
        path: '/my/url/here',
        handler: (request, response) => {...}
    })
```

For convenience, we offer these shorthand calls:
```
get(path, handler)
post(path, handler)
put(path, handler)
del(path, handler)
patch(path, handler)
```

Path supports params (`/mypath/{guid}/etc` will save the value in the spot of 'guid' to `request.params.guid`).

### Request

Request is a decorated version of the Node http-server request object. It will always have the following:
`request.query` - a parsed query object
`request.params` - an object of any params from paths
`request.path` - the current path
`request.method` - the method which called this request
`request.headers` - an object containing all headers

### Response

Response is an object which allows you to send data back to the client as well as set status codes, headers and return errors.

`response.send(payload)` where payload is a string, an object or a promise. If payload is an instance of error, it'll be sent to response.error().
`response.error(error)` where payload is an instance of error will send back a default status code as well as show the error.
`response.code(status)` where status is a number will send back that statusCode. It can be called before or after send().
`response.header(name, value)` will set the named header to the new value. It can be called before or after send().


## Development Usage

### Install Dependencies
Install the dependencies for this project.
```Text
make clean
```

Install the dependencies based on package.json.
```Text
make install
```

### Test Project
Run tests inside your container (This should be uses)
```Text
make run
```

Run mocha test locally.
```Text
make test
```

Both methods create ca coverage report after executing

### Debug Project
Run tests in debug mode.  Allows interactive debug.
```Text
make debug-test
```

Run tests in debug mode inside of Docker.  Allows interactive debug with container port 5858 opened.
 ```Text
 make run-debug test
 ```
