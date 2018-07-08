import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

const shallowRenderer = new ShallowRenderer()

export const expectMatchingSnapshot = (element) => {
    const renderedElement = renderer.create(element)
    expect(renderedElement).toMatchSnapshot()
    renderedElement.unmount()
}

export const expectShallowMatchingSnapshot = (element) => {
    const renderedElement = shallowRenderer.render(element)
    expect(renderedElement).toMatchSnapshot()
    renderedElement.unmount()
}
