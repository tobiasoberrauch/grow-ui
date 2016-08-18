/* global process, require, module */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var request = require('request');
var methods = require('./Api');


function serializeObjectToUri(obj) {
    return Object.keys(obj).map(function (key) {
        return key + '=' + encodeURIComponent(obj[key]);
    }).join('&');
}

var Api = function (config) {
    this._protocol = config.protocol || 'http'; // or https
    this._auth = (config.basicAuth) ? config.basicAuth.username + ':' + config.basicAuth.password + '@' : '';
    this._host = config.host || 'localhost';
    this._port = config.port || '12900';
    this._uri = this._protocol + '://' + this._auth + this._host + ':' + this._port;
};

Object.keys(methods).forEach(function (methodName) {
    var method = methods[methodName];

    Api.prototype[methodName] = function (parameters, path, callback) {

        if (arguments.length === 1) {
            callback = parameters;
        }
        if (arguments.length === 2) {
            callback = path;
        }

        var computedPath = '/api' + method.path;
        if (typeof parameters === 'object') {
            computedPath = computedPath.replace(/{([^}]*)}/g, function (s, p) {
                return parameters[p];
            });
        }
        var requestUri = this._uri + computedPath;
        if (method.method === 'GET' && parameters) {
            let uri = serializeObjectToUri(parameters);
            requestUri += '?' + uri;
        }
        var options = {
            url: requestUri,
            method: method.method,
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: (method.method !== 'GET' && parameters) ? parameters : null,
            rejectUnauthorized: false
        };

        request(options, function (error, response, body) {
            if (error) {
                return callback([error, body]);
            }

            try {
                callback(null, JSON.parse(body));
            }
            catch (err) {
                callback(['Bad response', err, requestUri]);
            }
        });
    };

});

var connect = function (config) {
    return new Api(config);
};

connect.connect = connect;
connect.Api = Api;

module.exports = connect;