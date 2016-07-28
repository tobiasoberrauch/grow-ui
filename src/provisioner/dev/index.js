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

let api = {
  'generator:init': init
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
