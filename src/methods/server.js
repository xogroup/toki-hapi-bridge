'use strict';

const RequestDecorator = require('./request');
const ResponseDecorator = require('./response');
const EventEmitter = require('events');

module.exports = class Server extends EventEmitter {
    constructor(hapiServer) {
        super();
        this.internalServer = hapiServer;

        this.internalServer.on('start', ()=>{
            return this.emit('start');
        });

        this.internalServer.on('stop', ()=>{
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
            path   : path,
            method : 'GET',
            handler: handler
        });
    }

    post(path, handler) {
        return this.route({
            path   : path,
            method : 'POST',
            handler: handler
        });
    }

    put(path, handler) {
        return this.route({
            path   : path,
            method : 'PUT',
            handler: handler
        });
    }

    del(path, handler) {
        return this.route({
            path   : path,
            method : 'DELETE',
            handler: handler
        });
    }

    patch(path, handler) {
        return this.route({
            path   : path,
            method : 'PATCH',
            handler: handler
        });
    }

    proxyHandler(handler) {
        return (hapiReq, hapiReply)=>{
            const req = RequestDecorator(hapiReq);
            const res = ResponseDecorator(hapiReply);

            return handler(req, res);
        };
    }
};
