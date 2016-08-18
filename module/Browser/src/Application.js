import electron from 'electron';
const {systemPreferences} = require('electron'); // http://electron.atom.io/docs/api/system-preferences/
import path from 'path';
import {EventEmitter} from 'events';
import _ from 'underscore-plus';
import ApplicationMenu from './ApplicationMenu';
import ApplicationWindow from './ApplicationWindow';
import GithubReleases from 'electron-gh-releases';
import Positioner from 'electron-positioner';
const url = require('url');

class Application extends EventEmitter {

  /**
   * The application's class.
   *
   * It's the entry point into the application and maintains the global state of the application.
   */
  constructor() {
    super();

    this.pkgJson = require('../../../package.json');
    this.windows = [];
    this.appIcon = null;

    electron.powerMonitor.on('suspend', () => {
      console.log('The system is going to sleep');
    });
    electron.powerMonitor.on('resume', () => {
      console.log('The system is back');
    });
    //electron.app.getPath('home');
    //electron.app.getVersion('home');
    //electron.app.addRecentDocument('home');
    //electron.app.clearRecentDocuments('home');
    //electron.app.setAsDefaultProtocolClient('grow');
    //electron.app.isDefaultProtocolClient('grow');
    //electron.app.dock.bounce('critical');
//electron.app.dock.downloadFinished(filePath);
    electron.app.dock.setBadge('text');
    electron.app.dock.setMenu(electron.Menu.buildFromTemplate([{label: 'foo'}]));
    //electron.app.dock.setIcon(image);

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
      window = this.createSpecsWindow(options);
    } else {
      window = this.createWindow(options);
    }

    //window.show();
    window.on('closed', () => this.removeApplicationWindow(window));

    this.windows.push(window);
  }

  /**
   * Opens up a new AtomWindow to run specs within.
   *
   * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
   */
  createSpecsWindow(options) {
    let bootstrapScript;
    let exitWhenDone = options.exitWhenDone;

    // todo pathes
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
  createWindow() {
    let iconPath = path.resolve(__dirname, '..', '..', '..', 'public', 'img', 'favicon.png');

    let appIcon = new electron.Tray(iconPath);
    appIcon.setToolTip('');
    appIcon.setPressedImage(iconPath);
    appIcon.window = new ApplicationWindow({
      //show: false
    });


    electron.globalShortcut.register('CommandOrControl+Shift+X', () => {
      appIcon.window.isVisible() ? appIcon.window.hide() : appIcon.window.show();
    });

    appIcon.window.toggleDevTools();
    appIcon.positioner = new Positioner(appIcon.window);

    appIcon.on('click', () => {
      appIcon.window.isVisible() ? appIcon.window.hide() : appIcon.window.show();
    });
    appIcon.on('right-click', () => {
      electron.dialog.showMessageBox({
        type: 'question',
        buttons: ['asd']
      });
//electron.dialog.showSaveDialog({});
      //electron.dialog.showOpenDialog(appIcon.window, {
      //  title: 'title',
      //  defaultPath: '~',
      //  properties: [
      //    'openFile',
      //    'openDirectory',
      //    'multiSelections'
      //  ],
      //  filters: [
      //    {name: 'Images', extensions: ['jpg', 'png', 'gif']},
      //    {name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
      //    {name: 'Custom File Type', extensions: ['as']},
      //    {name: 'All Files', extensions: ['*']}
      //  ]
      //});
    });
    appIcon.on('drop-files', () => {

    });

    appIcon.window.on('blur', this.hideWindow);
    appIcon.window.on('show', () => {
      appIcon.setHighlightMode('always')
    });
    appIcon.window.on('hide', () => {
      appIcon.setHighlightMode('never')
    });


    this.menu = this.createMenu();
    this.menu.attachToWindow(appIcon.window);
    //this.updater = this.createUpdater();

    return appIcon.window;
  }

  showWindow() {
    this.appIcon.window.show();
  }

  hideWindow() {
    if (this.appIcon && this.appIcon.window) {
      this.appIcon.window.hide();
    }
  }

  /**
   *
   * @returns {ApplicationMenu}
   * */
  createMenu() {
    let menu = new ApplicationMenu({
      pkg: this.pkgJson
    });

    menu.on('application:quit', electron.app.quit);
    menu.on('application:report-issue', () => electron.shell.openExternal(this.pkgJson.bugs));
    //menu.on('window:reload', electron.BrowserWindow.getFocusedWindow().reload);
    //menu.on('window:toggle-dev-tools', this.getFocusedWindow().toggleDevTools);
    //menu.on('window:toggle-full-screen', () => this.getFocusedWindow().setFullScreen(!this.getFocusedWindow().isFullScreen()));
    menu.on('application:run-specs', () => {
      return this.run({
        test: true,
        exitWhenDone: false
      });
    });

    return menu;
  }

  createAppIcon() {
    let iconPath = path.resolve(__dirname, '..', '..', '..', 'data', 'resources', 'app.png');
    var iconIdle = path.join(__dirname, '..', '..', '..', 'data', 'resources', 'app.png');

    let appIcon = new electron.Tray(iconIdle);
    appIcon.applicationWindow = new ApplicationWindow({
      icon: iconPath,
      titleBarStyle: 'hidden-inset'
    });
    appIcon.positioner = new Positioner(appIcon.applicationWindow);
    appIcon.on('click', (event, bounds) => {
      console.log('click', arguments);
      appIcon.applicationWindow.hide();
    });
    appIcon.setToolTip('GitHub Notifications on your menu bar.');

    return appIcon;
  }

  createUpdater(showAlert) {
    const updater = new GithubReleases({
      repo: 'tobiasoberrauch/grow',
      currentVersion: electron.app.getVersion()
    });

    updater.on('error', (event, message) => {
      console.log('ERRORED.');
      console.log('Event: ' + JSON.stringify(event) + '. MESSAGE: ' + message);
    });

    updater.on('update-downloaded', () => {
      electron.dialog.showMessageBox({
        type: 'question',
        buttons: ['Update & Restart', 'Cancel'],
        title: 'Update Available',
        cancelId: 99,
        message: 'There is an update available. Would you like to update FlowManager now?'
      }, function (response) {
        console.log('Exit: ' + response);
        electron.app.dock.hide();

        if (response === 0) {
          updater.install();
        }
      });
    });

    updater.check((err, status) => {
      if (err || !status) {
        if (showAlert) {
          electron.dialog.showMessageBox({
            type: 'info',
            buttons: ['Close'],
            title: 'No update available',
            message: 'You are currently running the latest version of FlowManager.'
          });
        }
        electron.app.dock.hide();
      }

      if (!err && status) {
        updater.download();
      }
    });
  }

  getFocusedWindow() {
    return electron.BrowserWindow.getFocusedWindow();
  }

  removeApplicationWindow(applicationWindow) {
    this.windows.forEach((win, index) => {
      if (win === applicationWindow) {
        this.windows.splice(index, 1);
      }
    });
  }

  handleEvents() {
    this.on('application:quit', electron.app.quit);

    electron.ipcMain.on('context-appwindow', (event, ...args) => this.windowForEvent(event.sender).emit(...args));
    electron.ipcMain.on('context-generator', (event, ...args) => this.windowForEvent(event.sender).sendCommandToProcess(...args));
    electron.ipcMain.on('update-icon', (event, arg) => {
      if (arg === 'TrayActive') {
        //this.appIcon.setImage(iconActive);
      } else {
        //this.appIcon.setImage(iconIdle);
      }
    });
  }

  windowForEvent(sender) {
    let window = electron.BrowserWindow.fromWebContents(sender);

    return _.find(this.windows, applicationWindow => applicationWindow.window === window);
  }

}

export default Application;
