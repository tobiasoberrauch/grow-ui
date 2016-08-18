'use strict';

window.onload = function () {
  try {
    var loadSettings = JSON.parse(decodeURIComponent(window.location.search.substr(14)));

    require('vm-compatibility-layer');

    window.loadSettings = loadSettings;

    require(loadSettings.bootstrapScript);
    require('electron').ipcRenderer.send('window-command', 'window:loaded');
  } catch (error) {
    var currentWindow = require('electron').remote.getCurrentWindow();
    currentWindow.setSize(800, 600);
    currentWindow.center();
    currentWindow.show();
    currentWindow.openDevTools();

    console.error(error.stack || error);
  }
};
