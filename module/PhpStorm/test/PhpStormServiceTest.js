const PhpStormService = require('../src/PhpStormService');

export default class PhpStormServiceTest {
  test() {
    let rootPath = '/Volumes/Repositories/production/b2c/casualFashion/.idea';
    let project = PhpStormService.createProject(rootPath);
    project.getComponents();
    project.getComponent('RemoteMappingsManager');
    project.getComponent('PhpProjectServersManager');
  }
}
