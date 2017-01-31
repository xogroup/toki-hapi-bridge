module.exports = class Chronos {
    constructor(server) {
        server.get('/success', this.success);
        server.put('/success', this.success);
        server.post('/success', this.success);
        server.del('/success', this.success);
        server.patch('/success', this.success);

        server.get('/success/{guid}', this.success);

        server.get('/fail', this.err);
        server.get('/fail/{guid}', this.err);
    }

    success(req, reply) {
        return reply(`${req.method} ${req.path} ${JSON.stringify(req.query)}`);
    }

    err(req, reply) {
        return reply(new Error(`${req.method} ${req.path} ${JSON.stringify(req.query)}`));
    }
};
