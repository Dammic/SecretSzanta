import { mount } from 'enzyme'

export const expectMatchingSnapshot = (element) => {
    const renderedComponent = mount(element)
    expect(renderedComponent).toMatchSnapshot()
}
