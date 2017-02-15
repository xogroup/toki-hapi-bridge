'use strict';

const RequestDecorator = require('./request');
const ResponseDecorator = require('./response');
const EventEmitter = require('events');

module.exports = class Server extends EventEmitter {
    constructor(hapiServer) {

        super();
        this.internalServer = hapiServer;

        this.internalServer.on('start', () => {

            return this.emit('start');
        });

        this.internalServer.on('stop', () => {

            return this.emit('stop');
        });
    }

    route(config) {

        return this.internalServer.route({
            path   : config.path,
            method : config.method,
            handler: this.proxyHandler(config.handler)
        });
    }

    get(path, handler) {

        return this.route({
            path,
            method : 'GET',
            handler
        });
    }

    post(path, handler) {

        return this.route({
            path,
            method : 'POST',
            handler
        });
    }

    put(path, handler) {

        return this.route({
            path,
            method : 'PUT',
            handler
        });
    }

    delete(path, handler) {

        return this.route({
            path,
            method : 'DELETE',
            handler
        });
    }

    patch(path, handler) {

        return this.route({
            path,
            method : 'PATCH',
            handler
        });
    }

    proxyHandler(handler) {

        return (hapiReq, hapiReply) => {

            const req = RequestDecorator(hapiReq);
            const res = new ResponseDecorator(hapiReply);

            return handler(req, res);
        };
    }
};
