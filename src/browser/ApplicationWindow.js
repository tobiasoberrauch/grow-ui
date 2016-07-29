const electron = require('electron');
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const path = require('path');
const url = require('url');
const EventEmitter = require('events').EventEmitter;
const fork = require('child_process').fork;
const _ = require('underscore-plus');
const killChildProcess = require('./util/kill-childprocess');

export default class ApplicationWindow extends EventEmitter {
  constructor(options) {
    super();

    this.loadSettings = {
      bootstrapScript: require.resolve('../renderer/main')
    };
    this.loadSettings = _.extend(this.loadSettings, options);

    let windowOptions = {
      webPreferences: {
        subpixelFontScaling: true,
        directWrite: true
      }
    };
    windowOptions = _.extend(windowOptions, this.loadSettings);

    this.window = new BrowserWindow(windowOptions);
    this.handleEvents();
  }

  show() {
    var targetPath = path.resolve(__dirname, '..', '..', 'static', 'index.html');
    var targetUrl = url.format({
      protocol: 'file',
      pathname: targetPath,
      slashes: true,
      query: {
        loadSettings: JSON.stringify(this.loadSettings)
      }
    });
    this.window.loadURL(targetUrl);

    this.window.webContents.on('did-finish-load', () => {
      this.initProcess();
    });

    this.window.show();
  }

  reload() {
    this.window.webContents.reload();
  }

  toggleFullScreen() {
    this.window.setFullScreen(!this.window.isFullScreen());
  }

  toggleDevTools() {
    this.window.toggleDevTools();
  }

  close() {
    this.window.close();
    this.window = null;
  }

  handleEvents() {
    this.window.on('closed', event => this.emit('closed', event));

    this.on('generator-cancel', this.killProcess);
    this.on('open-dialog', this.selectTargetDirectory);
    this.on('generator:done', this.openProject);
  }

  selectTargetDirectory() {
    var options = {
      title: 'Select a folder to generate the project into',
      properties: ['openDirectory', 'createDirectory']
    };

    dialog.showOpenDialog(this.window, options, fileNames => {
      if (!fileNames) {
        return;
      }
      this.sendCommandToBrowserWindow('generator:directory-selected', fileNames.shift());
    });
  }

  openProject(cwd) {
    if (!cwd) {
      return;
    }

    shell.showItemInFolder(cwd);
  }

  initProcess() {
    if (this.loadSettings.isSpec) {
      return;
    }

    this.process = fork(path.join(__dirname, '..', 'provisioner', 'yo', 'index.js'));

    this.process.on('message', (message) => {
      console.log('APP', message);

      this.sendCommandToBrowserWindow(message.event, message.data);
      this.emitCommandToAppWindow(message.event, message.data);

    });

    this.sendCommandToProcess('generator:init');
  }

  killProcess() {
    if (this.process && this.process.pid) {
      killChildProcess(this.process.pid, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  emitCommandToAppWindow(event, data) {
    if (!event) {
      return;
    }

    this.emit(event, data);
  }

  sendCommandToBrowserWindow() {
    this.window.webContents.send(...arguments);
  }

  sendCommandToProcess(name, ...args) {
    this.process.send({
      action: name,
      args: args
    });
  }
}
