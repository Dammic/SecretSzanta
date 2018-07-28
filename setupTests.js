import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { socket } from './src/utils/SocketHandler'

window.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0)
    return 0
}

Enzyme.configure({ adapter: new Adapter() })

socket.emit = jest.fn()
