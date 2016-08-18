import Project from './Project';

export default class PhpStormService {
  static createProject(rootPath) {
    return new Project(rootPath);
  }
}
