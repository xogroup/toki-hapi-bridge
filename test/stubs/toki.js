'use strict';

module.exports = class Toki {
    constructor(config) {

        const server = config.router;
        server.get('/success', this.success);
        server.put('/success', this.success);
        server.post('/success', this.success);
        server.delete('/success', this.success);
        server.patch('/success', this.success);

        server.get('/success/{guid}', this.success);

        server.get('/fail', this.err);
        server.get('/fail/{guid}', this.err);
    }

    success(req, res) {

        return res.send(`${req.method} ${req.path} ${JSON.stringify(req.query)}`);
    }

    err(req, res) {

        return res.send(new Error(`${req.method} ${req.path} ${JSON.stringify(req.query)}`));
    }
};
