import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
  return 0;
}

Enzyme.configure({ adapter: new Adapter() })
