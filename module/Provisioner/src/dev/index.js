const fs = require('fs');
const path = require('path');

function sendCommandToAppWindow(name, data) {
  if (data instanceof Error) {
    console.error(data);
    data = data.toString();
  }
  process.send({
    event: name,
    data: data
  });
}

function init() {
  let generators = fs.readFileSync(path.join(__dirname, 'generators.json'), 'utf8');
  sendCommandToAppWindow('generator:installed-generators', JSON.parse(generators));
}

function run(generatorName, cwd) {
  if (!generatorName) {
    return sendCommandToAppWindow('generator:error', new Error('You must provide a generator name'));
  }

  if (!fs.existsSync(cwd)) {
    return sendCommandToAppWindow('generator:error', new Error('The given path does not exist or is not a directory'));
  }

  process.chdir(cwd);
}

let api = {
  'generator:init': init,
  'generator:run': run
};

process.on('message', function (message) {
  console.log('Dev-Process', message);

  var action = api[message.action];
  if (action) {
    action.apply(null, message.args);
  } else {
    console.warn('No action "%s" in api found', message.action);
  }
});
