'use strict';

const reply = function(payload) {
    return {
        code: reply.code
    };
};

reply.code = function(status) {
    return status;
}

module.exports = reply;
