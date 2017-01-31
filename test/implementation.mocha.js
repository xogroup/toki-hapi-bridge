'use strict';

const Xoth = require('xo-test-helper');
const xoth = new Xoth();

const hapiResponse = require('./mocks/hapiResponse');
const Response = require('./../src/methods/response');
const Promise = require('bluebird');

describe('Chronos Bridge Hapi ', function() {
    describe.only('Response', function() {
        let hapiResponseSpy;
        let response = null;

        beforeEach(()=>{
            hapiResponseSpy = xoth.sinon.spy(hapiResponse, 'code');
            hapiResponseSpy = xoth.sinon.spy(hapiResponseSpy);

            response = new Response(hapiResponseSpy);
        });

        afterEach(()=>{
            hapiResponse.code.restore();
            hapiResponseSpy.restore();
        });

        it('should send a string reply successfully', ()=>{
            response.send('Some payload');
            hapiResponseSpy.should.of.been.calledOnce.and.calledWith('Some payload');
        });

        it('should send an object reply successfully', ()=>{
            response.send({foo: 'bar'});
            hapiResponseSpy.should.of.been.calledOnce.and.calledWith({foo: 'bar'});
        });

        it('should send a promise reply successfully', ()=>{
            let testPromise = new Promise((resolve, reject)=>{
                setTimeout(resolve, 100);
            });
            response.send(testPromise);
            hapiResponseSpy.should.of.been.calledOnce.and.calledWith(testPromise);
        });

        it('should send a reply and then a code successfully', ()=>{
            response.send('Some payload').code(418);
            hapiResponseSpy.should.of.been.calledOnce.and.calledWith('Some payload');
            hapiResponse.code.should.of.been.calledOnce.and.calledWith(418);
        });

    });

    describe('Server', function() {
        let server = null;
        before(()=>{
            const bridge = xoth.proxyquire(__dirname + '/../src/plugin', __dirname + '/stubs');

            server = new xoth.server({
                pluginPath : __dirname + '/../',
                stubsPath  : __dirname + '/stubs',
                useStubs   : true, // this defaults to false
                optionsPath: __dirname + '/mocks/options',
                port       : 5000
            });

            return server.hapi.register(bridge);
        });

        it('should successfully get the success endpoint', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('get /success {}');
            });
        });

        it('should successfully post the success endpoint', ()=>{
            return server.inject({
                method: 'POST',
                url   : '/success'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('post /success {}');
            });
        });

        it('should successfully put the success endpoint', ()=>{
            return server.inject({
                method: 'PUT',
                url   : '/success'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('put /success {}');
            });
        });

        it('should successfully patch the success endpoint', ()=>{
            return server.inject({
                method: 'PATCH',
                url   : '/success'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('patch /success {}');
            });
        });

        it('should successfully delete the success endpoint', ()=>{
            return server.inject({
                method: 'DELETE',
                url   : '/success'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('delete /success {}');
            });
        });

        it('should successfully get the success endpoint with a param', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success/thisisarandomguid'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('get /success/thisisarandomguid {}');
            });
        });

        it('should successfully get the success endpoint with a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success?foo=bar&baz=buzz'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('get /success {"foo":"bar","baz":"buzz"}');
            });
        });

        it('should successfully get the success endpoint with a param and a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success/thisisarandomguid?foo=bar&baz=buzz'
            }).then((res)=>{
                res.statusCode.should.equal(200);
                res.payload.should.equal('get /success/thisisarandomguid {"foo":"bar","baz":"buzz"}');
            });
        });

        it('should unsuccessfully get the failure endpoint', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail'
            }).then((res)=>{
                res.statusCode.should.equal(500);
            });
        });

        it('should unsuccessfully get the failure endpoint with a param', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail/thisisarandomguid'
            }).then((res)=>{
                res.statusCode.should.equal(500);
            });
        });

        it('should unsuccessfully get the failure endpoint with a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail?foo=bar&baz=buzz'
            }).then((res)=>{
                res.statusCode.should.equal(500);
            });
        });

        it('should unsuccessfully get the failure endpoint with a param and a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail/thisisarandomguid?foo=bar&baz=buzz'
            }).then((res)=>{
                res.statusCode.should.equal(500);
            });
        });
    });
});
