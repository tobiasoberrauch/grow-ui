const launcher = require('browser-launcher');
const Chrome = require('chrome-remote-interface');
const LayoutThrashingTracer = require('../../src/Chrome/LayoutThrashingTracer');

const config = {
    url: 'https://www.casual-fashion.com/de_de',
    directory: 'profiles/',
    fileNamePrefix: 'cf-'
};

launcher((err, launch) => {
    if (err) {
        return console.error(err);
    }

    var opts = {
        browser: 'chrome',
        options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
    };

    launch(config.url, opts, (err) => {
        if (err) {
            return console.error(err);
        }

        setTimeout(() => {
            Chrome((chrome) => {
                const tracer = new LayoutThrashingTracer(config);
                tracer.run(chrome);
            });
        }, 1000);
    });

});
