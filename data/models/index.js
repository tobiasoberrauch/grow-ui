const loopback = require('loopback');
const boot = require('loopback-boot');
const app = loopback();

boot(app, {
    appRootDir: __dirname
});

app.use(loopback.urlNotFound());
app.use(loopback.errorHandler());

app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
});