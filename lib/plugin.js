'use strict';
const Server = require('./methods/server');
const Toki = require('toki');

const register = function (hapiServer, options, next) {

    const server = new Server({
        router: hapiServer
    });
    new Toki(server);
    return next();
};

register.attributes = {
    pkg: require('./../package.json')
};

module.exports = register;
