'use strict';

const response = {
    code: (status)=>{
        return status;
    }
};

const reply = function(payload) {
    return response;
};

module.exports = {reply, response};
