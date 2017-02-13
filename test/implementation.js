'use strict';

const expect = require('code').expect;
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

const Hapi = require('hapi');
const proxyquire = require('proxyquire').noCallThru();
const Promise = require('bluebird');
const Sinon = require('Sinon');

const HapiReply = require('./mocks/HapiReply');
const Response = require('./../lib/methods/response');

describe('Toki Hapi Bridge', () => {

    describe('Response', () => {

        let response = null;

        lab.beforeEach((done) => {

            Sinon.spy(HapiReply.response, 'code');
            Sinon.spy(HapiReply.response, 'header');
            Sinon.spy(HapiReply, 'reply');

            response = new Response(HapiReply.reply);
            done();
        });

        lab.afterEach((done) => {

            HapiReply.response.code.restore();
            HapiReply.response.header.restore();
            HapiReply.reply.restore();
            done();
        });

        it('should send a string reply successfully', (done) => {

            response.send('Some payload');
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, 'Some payload');
            done();
        });

        it('should send an object reply successfully', (done) => {

            response.send({
                foo: 'bar'
            });
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, {
                foo: 'bar'
            });
            done();
        });

        it('should send a promise reply successfully', (done) => {

            const testPromise = new Promise((resolve, reject) => {

                setTimeout(resolve, 100);
            });
            response.send(testPromise);
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, testPromise);
            done();
        });

        it('should send a reply and then a code successfully', (done) => {

            response.send('Some payload').status(418);
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, 'Some payload');
            Sinon.assert.calledOnce(HapiReply.response.code);
            Sinon.assert.calledWith(HapiReply.response.code, 418);
            done();
        });

        it('should set a code and then reply successfully', (done) => {

            response.status(418).send('Some payload');
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, 'Some payload');
            Sinon.assert.calledOnce(HapiReply.response.code);
            Sinon.assert.calledWith(HapiReply.response.code, 418);
            done();
        });

        it('should send a reply and then a header successfully', (done) => {

            response.send('Some payload').header('test', 'foobar');
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, 'Some payload');
            Sinon.assert.calledOnce(HapiReply.response.header);
            Sinon.assert.calledWith(HapiReply.response.header, 'test', 'foobar');
            done();
        });

        it('should set a header and then reply successfully', (done) => {

            response.header('test', 'foobar').send('Some payload');
            Sinon.assert.calledOnce(HapiReply.reply);
            Sinon.assert.calledWith(HapiReply.reply, 'Some payload');
            Sinon.assert.calledOnce(HapiReply.response.header);
            Sinon.assert.calledWith(HapiReply.response.header, 'test', 'foobar');
            done();
        });

    });

    describe('Server', () => {

        let server = null;
        lab.before(() => {

            const tokiStub = require('./stubs/toki');
            const bridge = proxyquire(__dirname + '/../lib/plugin', {
                'toki': tokiStub
            });

            server = new Hapi.Server();

            server.connection({
                host: 'localhost',
                port: 5000
            });

            return server.register(bridge);
        });

        it('should successfully get the success endpoint', () => {

            return server.inject({
                method: 'GET',
                url   : '/success'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success {}');
            });
        });

        it('should successfully post the success endpoint', () => {

            return server.inject({
                method: 'POST',
                url   : '/success'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('post /success {}');
            });
        });

        it('should successfully put the success endpoint', () => {

            return server.inject({
                method: 'PUT',
                url   : '/success'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('put /success {}');
            });
        });

        it('should successfully patch the success endpoint', () => {

            return server.inject({
                method: 'PATCH',
                url   : '/success'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('patch /success {}');
            });
        });

        it('should successfully delete the success endpoint', () => {

            return server.inject({
                method: 'DELETE',
                url   : '/success'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('delete /success {}');
            });
        });

        it('should successfully get the success endpoint with a param', () => {

            return server.inject({
                method: 'GET',
                url   : '/success/thisisarandomguid'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success/thisisarandomguid {}');
            });
        });

        it('should successfully get the success endpoint with a query', () => {

            return server.inject({
                method: 'GET',
                url   : '/success?foo=bar&baz=buzz'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success {"foo":"bar","baz":"buzz"}');
            });
        });

        it('should successfully get the success endpoint with a param and a query', () => {

            return server.inject({
                method: 'GET',
                url   : '/success/thisisarandomguid?foo=bar&baz=buzz'
            }).then((res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.payload).to.equal('get /success/thisisarandomguid {"foo":"bar","baz":"buzz"}');
            });
        });

        it('should unsuccessfully get the failure endpoint', () => {

            return server.inject({
                method: 'GET',
                url   : '/fail'
            }).then((res) => {

                expect(res.statusCode).to.equal(500);
            });
        });

        it('should unsuccessfully get the failure endpoint with a param', () => {

            return server.inject({
                method: 'GET',
                url   : '/fail/thisisarandomguid'
            }).then((res) => {

                expect(res.statusCode).to.equal(500);
            });
        });

        it('should unsuccessfully get the failure endpoint with a query', () => {

            return server.inject({
                method: 'GET',
                url   : '/fail?foo=bar&baz=buzz'
            }).then((res) => {

                expect(res.statusCode).to.equal(500);
            });
        });

        it('should unsuccessfully get the failure endpoint with a param and a query', () => {

            return server.inject({
                method: 'GET',
                url   : '/fail/thisisarandomguid?foo=bar&baz=buzz'
            }).then((res) => {

                expect(res.statusCode).to.equal(500);
            });
        });
    });
});
