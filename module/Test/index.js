const glob = require('glob');
const TestRunner = require('./.././TestRunner');

let testRunner = new TestRunner();
testRunner.run(glob(), (err, results) => {
    console.log(arguments);
});
