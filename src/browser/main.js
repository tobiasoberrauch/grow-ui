const path = require('path');
const electron = require('electron');
const app = electron.app;

app.on('ready', function () {

  const appRoot = path.join(__dirname, '..', '..');
  console.log('appRoot', appRoot);
  require('electron-compile').init(appRoot, './app');
});
