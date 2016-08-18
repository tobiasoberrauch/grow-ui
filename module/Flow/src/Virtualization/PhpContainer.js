let Container = require('./Container');
let dockerRun = require('docker-run');

// docker run --rm --name=php-cli -v $(pwd):/www matriphe/alpine-php:cli php

class PhpContainer extends Container
{
    constructor(containerRunner) {
        super();

        this.containerRunner = containerRunner;
        this.image = 'matriphe/alpine-php';
        this.name = 'php-cli';
    }
    
    run(path) {
        let child = dockerRun(this.image, {
            name: this.name,
            volumes: {
                '/www': path
            },
            remove: true
        });

        console.log(child);

        process.stdin.setRawMode(true);
        process.stdin.pipe(child.stdin);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);


        child.on('close', () => {
            console.log('close');
        });
        child.on('exit', code => {
            console.log('exit', code);
        });
        child.on('spawn', id => {
            console.log('spawn', id);
        });
        child.on('start', () => {
            console.log('start');
        });
        child.on('error', err => {
            console.log('error', err);
        });
    }
}


module.exports = PhpContainer;