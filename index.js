#!/usr/bin/env node

const launcher = require('browser-launcher');

launcher(function (err, launch) {
    if (err) {
        return console.error(err);
    }
    // XDEBUG_SESSION=PHPSTORM

    let url = 'http://www.casual-fashion.dev';
    let opts = {
        browser: 'chrome',
        options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
    };
    launch(url, opts, function (err) {
        if (err) {
            return console.error(err);
        }


    });

});


import Application from "./module/Flow/src/Mvc/Application/Application";

// const REQUEST_MICROTIME = new Date().getTime();
// const APPLICATION_ENV = 'dev';
global.APPLICATION_ROOT = __dirname;
global.import = function (className) {
  let factoryClassName = global.APPLICATION_ROOT + '/src/' + className;

  let module = require(factoryClassName);
  if (module.hasOwnProperty('default')) {
    module = module.default;
  }
  return module;
};


let configuration = require('./config/application.config');
Application.init(configuration).run();
