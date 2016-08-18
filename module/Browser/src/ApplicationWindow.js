const electron = require('electron');
const browserWindowState = require('electron-window-state');
const path = require('path');
const url = require('url');
const EventEmitter = require('events').EventEmitter;
const fork = require('child_process').fork;
const _ = require('underscore-plus');
const killChildProcess = require('./util/kill-childprocess');

export default class ApplicationWindow extends EventEmitter {
  constructor(options) {
    super();

    this.process = null;
    this.loadSettings = _.extend({
      bootstrapScript: require.resolve('../../Renderer/src/main')
    }, options);

    let windowStateManager = browserWindowState({
      defaultWidth: 1000,
      defaultHeight: 800
    });
    let windowOptions = _.extend({
      title: 'Grow',
      width: windowStateManager.width,
      height: windowStateManager.height,
      x: windowStateManager.x,
      y: windowStateManager.y,
      webPreferences: {
        subpixelFontScaling: true,
        directWrite: true
      }
    }, this.loadSettings);

    this.window = new electron.BrowserWindow(windowOptions);
    windowStateManager.manage(this.window);

    this.handleEvents();

    var targetPath = path.resolve(__dirname, '..', '..', '..', 'public', 'index.html');
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
      if (this.loadSettings.isSpec) {
        return;
      }

      this.process = fork(path.join(__dirname, '..', '..', 'Provisioner', 'src', 'yo', 'index.js'));

      this.process.on('message', message => {
        this.sendCommandToBrowserWindow(message.event, message.data);
        this.emitCommandToAppWindow(message.event, message.data);
      });

      this.sendCommandToProcess('generator:init');
    });
  }

  show() {
    this.window.show();
    this.window.focus();
  }

  hide() {
    this.window.hide();
  }

  isVisible() {
    return this.window.isVisible();
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

    electron.dialog.showOpenDialog(this.window, options, fileNames => {
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

    electron.shell.showItemInFolder(cwd);
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
