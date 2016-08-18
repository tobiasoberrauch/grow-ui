var Menu = require('electron').Menu;
var path = require('path');
var season = require('season');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore-plus');

export default class ApplicationMenu extends EventEmitter {
  constructor(options) {
    super();

    var menuJson = season.resolve(path.join(__dirname, '..', '..', 'data', 'menus', process.platform + '.json'));
    var template = season.readFileSync(menuJson);

    this.template = this.translateTemplate(template.menu, options.pkg);
  }

  attachToWindow() {
    console.log('template', this.template);
    this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
    Menu.setApplicationMenu(this.menu);
  }

  wireUpMenu(menu, command) {
    menu.click = () => this.emit(command);
  }

  translateTemplate(template, pkgJson) {
    template.forEach(item => {
      if (!item.metadata) {
        item.metadata = {};
      }
      if (item.label) {
        item.label = _.template(item.label)(pkgJson);
      }
      if (item.command) {
        this.wireUpMenu(item, item.command);
      }
      if (item.submenu) {
        this.translateTemplate(item.submenu, pkgJson);
      }
    });

    return template;
  }
}
