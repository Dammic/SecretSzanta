const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
  return 0;
};

configure({ adapter: new Adapter() });

