const rp = require('request-promise-native');
const _ = require('lodash');

module.exports = ((options) => {
    const defaultOptions = _.defaultsDeep({}, options, {
        simple: false,
        resolveWithFullResponse: true,
    });
    const http = rp.defaults(defaultOptions);
    return http;
})();
