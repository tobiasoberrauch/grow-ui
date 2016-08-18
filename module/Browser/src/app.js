import yargs from 'yargs';
import Application from './Application';

const shellStartTime = Date.now();

process.on('uncaughtException', (error) => {
  if (!error) {
    error = {};
  }
  if (error.message) {
    console.error(error.message);
  }
  if (error.stack) {
    console.error(error.stack);
  }
});

let application = new Application();
application.run(() => {
  const options = yargs(process.argv.slice(1)).wrap(100);
  options.alias('t', 'test').boolean('t').describe('t', 'Run the specs and exit with error code on failures.');

  return {
    test: options.argv.test
  };
});

console.log('App load time: ' + (Date.now() - shellStartTime) + 'ms');
