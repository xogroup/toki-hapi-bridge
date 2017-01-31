'use strict';
const Server = require('./methods/server');
const Chronos = require('chronos');

const register = function(hapiServer, options, next) {
    const server = new Server(hapiServer);
    const chronos = new Chronos(server);
    return next();
};

register.attributes = {
    pkg: require('./../package.json')
};

module.exports = register;
