const queryString = require('querystring');
const nodeUrl = require('url');
const {BrowserWindow} = require('electron');

class OAuth2Service {
    contructor(options) {
        this.config = options;
    }

    getAccessToken(options) {
        let urlParameters = {
            response_type: 'code',
            redirect_uri: this.config.redirectUri,
            client_id: this.config.clientId
        };
        if (options.scope) {
            urlParameters.scope = options.scope;
        }
        if (options.accessType) {
            urlParameters.access_type = options.accessType;
        }
        let url = this.config.authorizationUrl + '?' + queryString.stringify(urlParams);


        return new Promise(function (resolve, reject) {
            let authWindow = new BrowserWindow({
                'use-content-size': true
            });
            authWindow.loadURL(url);
            authWindow.show();
            authWindow.on('closed', () => {
                reject(new Error('window was closed by user'));
            });


            function forward(url) {
                var url_parts = nodeUrl.parse(url, true);
                var query = url_parts.query;
                var code = query.code;
                var error = query.error;

                if (error !== undefined) {
                    reject(error);
                    authWindow.removeAllListeners('closed');
                    authWindow.close();
                } else if (code) {
                    resolve(code);
                    authWindow.removeAllListeners('closed');
                    authWindow.close();
                }
            }

            authWindow.webContents.on('will-navigate', (event, url) => {
                forward(url);
            });

            authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
                forward(newUrl);
            });
        });
    }

    refreshToken() {
        return this.tokenRequest({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            redirect_uri: config.redirectUri
        });
    }

    getAuthorizationCode() {
        opts = opts || {};

        if (!config.redirectUri) {
            config.redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
        }

        var urlParams = {
            response_type: 'code',
            redirect_uri: config.redirectUri,
            client_id: config.clientId
        };

        if (opts.scope) {
            urlParams.scope = opts.scope;
        }

        if (opts.accessType) {
            urlParams.access_type = opts.accessType;
        }

        var url = config.authorizationUrl + '?' + queryString.stringify(urlParams);

        return new Promise(function (resolve, reject) {
            const authWindow = new BrowserWindow(windowParams || {'use-content-size': true});

            authWindow.loadURL(url);
            authWindow.show();

            authWindow.on('closed', () => {
                reject(new Error('window was closed by user'));
            });

            function onCallback(url) {
                var url_parts = nodeUrl.parse(url, true);
                var query = url_parts.query;
                var code = query.code;
                var error = query.error;

                if (error !== undefined) {
                    reject(error);
                    authWindow.removeAllListeners('closed');
                    authWindow.close();
                } else if (code) {
                    resolve(code);
                    authWindow.removeAllListeners('closed');
                    authWindow.close();
                }
            }

            authWindow.webContents.on('will-navigate', (event, url) => {
                onCallback(url);
            });

            authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
                onCallback(newUrl);
            });
        });
    }

    tokenRequest() {
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        if (config.useBasicAuthorizationHeader) {
            header.Authorization = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
        } else {
            objectAssign(data, {
                client_id: config.clientId,
                client_secret: config.clientSecret
            });
        }

        return fetch(config.tokenUrl, {
            method: 'POST',
            headers: header,
            body: queryString.stringify(data)
        }).then(res => {
            return res.json();
        });
    }
}

module.exports = OAuth2Service;