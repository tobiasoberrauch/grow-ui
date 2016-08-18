const launcher = require('browser-launcher');
const Chrome = require('chrome-remote-interface');
const TimelineTracer = require('../../src/Chrome/TimelineTracer');
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

    launch(config.url, opts, (err, ps) => {
        if (err) {
            return console.error(err);
        }

        setTimeout(() => {
            Chrome((chrome) => {
                const timelineTracer = new TimelineTracer(config);
                timelineTracer.run(chrome);
            });
        }, 1000);
    });


});
