'use strict';

const Xoth = require('xo-test-helper');
const xoth = new Xoth();

describe('Chronos Bridge Hapi ', function() {
    before(function() {
        const bridge = xoth.proxyquire(__dirname + '/../src/implementation', __dirname + '/stubs');

        const server = new xoth.server({
            stubsPath  : __dirname + '/stubs',
            useStubs   : true, // this defaults to false
            optionsPath: __dirname + '/mocks/options',
            port       : 5000
        });

        return server.hapi.register(bridge);
    });

    it('should successfully call the success endpoint', ()=>{
        return server.inject({
            method: 'GET',
            url   : '/success'
        }).then((res)=>{
            res.statusCode.should.equal(200);
        });
    });
});
