# API Reference <!-- This title stays the same probably -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [API Reference](#api-reference)
  - [Server](#server)
    - [Route](#route)
      - [Methods](#methods)
      - [Path](#path)
      - [Handler](#handler)
    - [get/post/put/del/patch](#getpostputdelpatch)
    - [Events](#events)
  - [Request](#request)
  - [Response](#response)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Requiring the server returns back a function ready to be inserted into Hapi's `.plugin()` method.

The bridge plugin will instantiate a Toki Core and provide it a server object for hooking up routes.

## Server

### Route

```javascript
route({
        method: 'GET',
        path: '/my/url/here',
        handler: (request, response) => {...}
    });
```

#### Methods

    + `GET`
    + `POST`
    + `PUT`
    + `DEL`
    + `PATCH`

#### Path

    Any string. Parameterization is allowed.

#### Handler

    A function which accepts a Request and a Response object

### get/post/put/del/patch

These are convenience methods for the route() function above.

```javascript
get('/my/path', (request, response) => {...})
```

### Events

The server object inherits from EventEmitter and emits the following events:

+ start - When the server is started
+ stop - When the server is stopped

## Request

Request is a decorated version of the Node http-server request object. It will always have the following:

+ `request.query` - a parsed query object
+ `request.params` - an object of any params from paths
+ `request.path` - the current path
+ `request.method` - the method which called this request
+ `request.headers` - an object containing all headers


## Response

Response is an object which allows you to send data back to the client as well as set status codes, headers and return errors.

+ `response.send(payload)` where payload is a string, an object or a promise. If payload is an instance of error, it'll be sent to response.error().
+ `response.error(error)` where payload is an instance of error will send back a default status code as well as show the error.
+ `response.code(status)` where status is a number will send back that statusCode. It can be called before or after send().
+ `response.header(name, value)` will set the named header to the new value. It can be called before or after send().
