import insight from './utils/insight';
import {render} from 'react-dom';
import Root from './containers/root';

var main = document.createElement('main');
main.id = 'content';
document.body.appendChild(main);

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = 'fonts.css';
document.head.appendChild(style);

insight.init(function () {
  // React entry-point

  render(<Root />, document.getElementById('content'));
});
