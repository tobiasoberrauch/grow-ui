const async = require('async');
const Profiler = require('../../src/Chrome/Profiler');

let urls = [
    'https://www.casual-fashion.com',
    'https://www.casual-fashion.com/de_de/someday/sale',
    'https://www.casual-fashion.com/de_de/opus/sale'
];
var analyser = Profiler.createAnalyser();
async.mapSeries(urls, analyser, (err, reports) => {
    console.log('reports', reports);
});