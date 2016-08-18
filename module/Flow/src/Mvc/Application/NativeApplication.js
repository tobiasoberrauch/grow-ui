/* globals global*/
import {BrowserWindow, app, dialog} from "electron";
import {EventEmitter} from "events";
import ServiceManager from "../../ServiceManager/ServiceManager";
import ServiceManagerConfig from "../../ServiceManager/ServiceManagerConfig";

export default class NativeApplication extends EventEmitter {
    constructor(configuration) {
        super();

        global.application = this;

        this.browserWindows = new Set();
        // this.config = new Config({
        //     configDirPath: process.env.ATOM_HOME,
        //     resourcePath: configuration.resourcePath,
        //     enablePersistence: true
        // });
        // this.autoUpdateManager = new AutoUpdateManager();
        // this.applicationMenu = new ApplicationMenu();
        // this.fileRecoveryService = new FileRecoveryService();
        // this.storageFolder = new StorageFolder();
    }

    static init(configuration) {
        let serviceManagerConfig = configuration.hasOwnProperty('service_manager') ? configuration.service_manager : [];
        let serviceManager = new ServiceManager(new ServiceManagerConfig(serviceManagerConfig));
        serviceManager.setService('ApplicationConfig', configuration);

        var moduleManager = serviceManager.get('ModuleManager');
        moduleManager.loadModules();

        let listenersFromAppConfig = configuration.hasOwnProperty('listeners') ? configuration.listeners : [];
        let config = serviceManager.get('Config');
        let listenersFromConfigService = config.has('listeners') ? config.get('listeners') : [];

        let listeners = listenersFromAppConfig.concat(listenersFromConfigService);

        return serviceManager.get('Application').bootstrap(listeners);

    }

    run() {
        let browserWindow = this.createBrowserWindow();
        browserWindow.loadURL(`file://${global.APPLICATION_ROOT}/module/Application/view/layout/layout.html`);
        browserWindow.once('ready-to-show', () => {
            browserWindow.show();
        });

    }

    createBrowserWindow() {
        let browserWindow = new BrowserWindow();

        this.browserWindows.add(browserWindow);

        return browserWindow;
    }
}