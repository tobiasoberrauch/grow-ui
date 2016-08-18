const path = require('path');
const electron = require('electron');
const app = electron.app;

app.commandLine.appendSwitch('remote-debugging-port', '8315');
app.commandLine.appendArgument('enable-logging');
//app.disableHardwareAcceleration();

app.on('ready', function () {

  const appRoot = path.join(__dirname, '..', '..', '..');
  require('electron-compile').init(appRoot, './app');
});
