'use strict';

const Boom = require('boom');
const UnsupportedTypeError = require('./../errors/unsupportedType');

class Response {
    constructor(hapiReply) {
        this.internalReply = hapiReply;
    }
    send(payload) {
        //payload can be an object, a promise, a string, or an error
        if (payload instanceof Error || (typeof payload === 'number' && payload >= 400) ) {
            return this.error(payload);
        }

        if (payload instanceof Promise || typeof payload === 'string' || typeof payload === 'object') {
            this.hapiResponseObj = this.internalReply(payload);

            if (this.futureCode) {
                this.hapiResponseObj.code(this.futureCode);
            }
            console.log('response', this);
            return this;
        }

        return new UnsupportedTypeError(`${typeof payload} is not supported`);
    }
    end(payload) {
        //accepts any payload that send accepts
        if (payload) {
            this.send(payload);
        }

        return this.internalReply.continue();
    }
    status(code) {
        //takes any numerical code
        if (typeof code !== 'number') {
            return new UnsupportedTypeError(`${typeof payload} is not a valid status code`);
        }

        if (this.hapiResponseObj) {
            this.hapiResponseObj.code(code);
            return this;
        }

        this.futureCode = code;
        return this;
    }
    error(payload) {
        //takes either an error, a Boom object, or a status code
        //payload can be an object, a promise, a string, or an error
        if (payload instanceof Error || (typeof payload === 'number' && payload >= 400) ) {
            this.hapiResponseObj = this.internalReply(payload);
            if (this.futureCode) {
                this.hapiResponseObj.code(this.futureCode);
            }

            return this;
        }

        return new UnsupportedTypeError(`${typeof payload} is not supported`);
    }
}

module.exports = function(hapiReply) {
    return new Response(hapiReply);
};
