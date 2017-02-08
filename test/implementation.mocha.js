'use strict';

const expect = require('code').expect;
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Hapi = require('hapi');
const proxyquire = require('proxyquire').noCallThru();
const Promise = require('bluebird');
const sinon = require('sinon');

const hapiReply = require('./mocks/hapiReply');
const Response = require('./../lib/methods/response');

lab.describe('Toki Hapi Bridge', function() {
    lab.describe('Response', function() {
        let response = null;

        lab.beforeEach((done)=>{
            sinon.spy(hapiReply.response, 'code');
            sinon.spy(hapiReply.response, 'header');
            sinon.spy(hapiReply, 'reply');

            response = new Response(hapiReply.reply);
            done();
        });

        lab.afterEach((done)=>{
            hapiReply.response.code.restore();
            hapiReply.response.header.restore();
            hapiReply.reply.restore();
            done();
        });

        lab.test('should send a string reply successfully', (done)=>{
            response.send('Some payload');
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, 'Some payload');
            done();
        });

        lab.test('should send an object reply successfully', (done)=>{
            response.send({foo: 'bar'});
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, {foo: 'bar'});
            done();
        });

        lab.test('should send a promise reply successfully', (done)=>{
            let testPromise = new Promise((resolve, reject)=>{
                setTimeout(resolve, 100);
            });
            response.send(testPromise);
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, testPromise);
            done();
        });

        lab.test('should send a reply and then a code successfully', (done)=>{
            response.send('Some payload').status(418);
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, 'Some payload');
            sinon.assert.calledOnce(hapiReply.response.code);
            sinon.assert.calledWith(hapiReply.response.code, 418);
            done();
        });

        lab.test('should set a code and then reply successfully', (done)=>{
            response.status(418).send('Some payload');
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, 'Some payload');
            sinon.assert.calledOnce(hapiReply.response.code);
            sinon.assert.calledWith(hapiReply.response.code, 418);
            done();
        });

        lab.test('should send a reply and then a header successfully', (done)=>{
            response.send('Some payload').header('test', 'foobar');
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, 'Some payload');
            sinon.assert.calledOnce(hapiReply.response.header);
            sinon.assert.calledWith(hapiReply.response.header, 'test', 'foobar');
            done();
        });

        lab.test('should set a header and then reply successfully', (done)=>{
            response.header('test', 'foobar').send('Some payload');
            sinon.assert.calledOnce(hapiReply.reply);
            sinon.assert.calledWith(hapiReply.reply, 'Some payload');
            sinon.assert.calledOnce(hapiReply.response.header);
            sinon.assert.calledWith(hapiReply.response.header, 'test', 'foobar');
            done();
        });

    });

    lab.describe('Server', function() {
        let server = null;
        lab.before(()=>{
            const tokiStub = require('./stubs/toki');
            const bridge = proxyquire(__dirname + '/../lib/plugin', {'toki': tokiStub});

            server = new Hapi.Server();

            server.connection({
                host: 'localhost',
                port: 5000
            });

            return server.register(bridge);
        });

        lab.test('should successfully get the success endpoint', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success {}');
            });
        });

        lab.test('should successfully post the success endpoint', ()=>{
            return server.inject({
                method: 'POST',
                url   : '/success'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('post /success {}');
            });
        });

        lab.test('should successfully put the success endpoint', ()=>{
            return server.inject({
                method: 'PUT',
                url   : '/success'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('put /success {}');
            });
        });

        lab.test('should successfully patch the success endpoint', ()=>{
            return server.inject({
                method: 'PATCH',
                url   : '/success'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('patch /success {}');
            });
        });

        lab.test('should successfully delete the success endpoint', ()=>{
            return server.inject({
                method: 'DELETE',
                url   : '/success'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('delete /success {}');
            });
        });

        lab.test('should successfully get the success endpoint with a param', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success/thisisarandomguid'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success/thisisarandomguid {}');
            });
        });

        lab.test('should successfully get the success endpoint with a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success?foo=bar&baz=buzz'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success {"foo":"bar","baz":"buzz"}');
            });
        });

        lab.test('should successfully get the success endpoint with a param and a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/success/thisisarandomguid?foo=bar&baz=buzz'
            }).then((res)=>{
                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success/thisisarandomguid {"foo":"bar","baz":"buzz"}');
            });
        });

        lab.test('should unsuccessfully get the failure endpoint', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail'
            }).then((res)=>{
                expect(res.statusCode).to.equal(500);
            });
        });

        lab.test('should unsuccessfully get the failure endpoint with a param', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail/thisisarandomguid'
            }).then((res)=>{
                expect(res.statusCode).to.equal(500);
            });
        });

        lab.test('should unsuccessfully get the failure endpoint with a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail?foo=bar&baz=buzz'
            }).then((res)=>{
                expect(res.statusCode).to.equal(500);
            });
        });

        lab.test('should unsuccessfully get the failure endpoint with a param and a query', ()=>{
            return server.inject({
                method: 'GET',
                url   : '/fail/thisisarandomguid?foo=bar&baz=buzz'
            }).then((res)=>{
                expect(res.statusCode).to.equal(500);
            });
        });
    });
});
