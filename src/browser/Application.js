import {app, BrowserWindow, ipcMain, shell} from 'electron';
import path from 'path';
import {EventEmitter} from 'events';
import _ from 'underscore-plus';
import ApplicationMenu from './ApplicationMenu';
import ApplicationWindow from './ApplicationWindow';

class Application extends EventEmitter {

  /**
   * The application's class.
   *
   * It's the entry point into the application and maintains the global state of the application.
   */
  constructor() {
    super();

    this.pkgJson = require('../../package.json');
    this.windows = [];

    this.handleEvents();
  }

  /**
   * Opens a new window based on the options provided.
   *
   * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
   * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
   */
  run(options) {
    let window;

    if (options.test) {
      if (options.exitWhenDone === undefined) {
        options.exitWhenDone = true;
      }
      window = this.openSpecsWindow(options);
    } else {
      window = this.openWindow(options);
    }

    window.show();
    window.on('closed', () => this.removeApplicationWindow(window));

    this.windows.push(window);
  }

  /**
   * Opens up a new AtomWindow to run specs within.
   *
   * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
   */
  openSpecsWindow(options) {
    let bootstrapScript;
    let exitWhenDone = options.exitWhenDone;

    try {
      bootstrapScript = require.resolve(path.resolve(__dirname, 'spec', 'helpers', 'bootstrap'));
    } catch (error) {
      bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'helpers', 'bootstrap'));
    }

    return new ApplicationWindow({
      bootstrapScript: bootstrapScript,
      exitWhenDone: exitWhenDone,
      isSpec: true,
      title: `${this.pkgJson.productName}\'s Spec Suite`
    });
  }


  /**
   * Opens up a new applicationWindow and runs the application.
   */
  openWindow() {
    let iconPath = path.resolve(__dirname, '..', '..', 'resources', 'app.png');

    let applicationWindow = new ApplicationWindow({
      title: this.pkgJson.productName,
      icon: iconPath,
      width: 1024,
      height: 700,
      titleBarStyle: 'hidden-inset'
    });
    this.menu = new ApplicationMenu({
      pkg: this.pkgJson
    });
    this.menu.attachToWindow(applicationWindow);
    this.menu.on('application:quit', () => app.quit());
    this.menu.on('application:report-issue', () => shell.openExternal(this.pkgJson.bugs));
    this.menu.on('window:reload', () => this.getFocusedWindow().reload());
    this.menu.on('window:toggle-dev-tools', () => this.getFocusedWindow().toggleDevTools());
    this.menu.on('window:toggle-full-screen', () => this.getFocusedWindow().setFullScreen(!this.getFocusedWindow().isFullScreen()));

    this.menu.on('application:run-specs', () => {
      return this.run({
        test: true,
        exitWhenDone: false
      });
    });

    return applicationWindow;
  }

  getFocusedWindow() {
    return BrowserWindow.getFocusedWindow();
  }

  /**
   * Removes the given window from the list of windows, so it can be GC'd.
   *
   * @param {ApplicationWindow} applicationWindow The ApplicationWindow to be removed
   */
  removeApplicationWindow(applicationWindow) {
    this.windows.forEach((win, index) => {
      if (win === applicationWindow) {
        this.windows.splice(index, 1);
      }
    });
  }

  handleEvents() {
    this.on('application:quit', () => pp.quit());

    ipcMain.on('context-appwindow', (event, ...args) => this.windowForEvent(event.sender).emit(...args));
    ipcMain.on('context-generator', (event, ...args) => this.windowForEvent(event.sender).sendCommandToProcess(...args));
  }

  // Returns the {ApplicationWindow} for the given ipc event.
  windowForEvent(sender) {
    let window = BrowserWindow.fromWebContents(sender);

    return _.find(this.windows, applicationWindow => applicationWindow.window === window);
  }

}

export default Application;
