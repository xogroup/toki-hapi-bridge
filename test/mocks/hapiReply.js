'use strict';

const response = {
    code: (status) => {

        return status;
    },
    header: (header) => {

        return header;
    }
};

const reply = function (payload) {

    return response;
};

reply.continue = function () {

    return true;
};

module.exports = {
    reply,
    response
};
