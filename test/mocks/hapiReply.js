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

module.exports = {
    reply,
    response
};
