'use strict';
const Server = require('./methods/server');
const Toki = require('toki');

const register = function (hapiServer, options, next) {

    const server = new Server(hapiServer);
    new Toki({
        router: server
    });
    return next();
};

register.attributes = {
    pkg: require('./../package.json')
};

module.exports = register;
