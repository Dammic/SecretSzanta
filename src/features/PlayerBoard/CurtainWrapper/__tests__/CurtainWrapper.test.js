import React from 'react'
import { shallow } from 'enzyme'
import { expectMatchingSnapshot } from 'packages/testUtils'
import CurtainWrapper from '../CurtainWrapper'

const setupProps = (propsOverrides = {}, renderMethod = shallow) => {
    const props = {
        isHidden: false,
        isFascist: false,
        ...propsOverrides,
    }
    const component = renderMethod(<CurtainWrapper {...props} />)
    return { props, component }
}

describe('<CurtainWrapper />', () => {
    describe('liberal', () => {
        it('renders visible curtains', () => {
            const { props } = setupProps({ isHidden: false, isFascist: false })
            expectMatchingSnapshot(<CurtainWrapper {...props} />)
        })

        it('renders hidden curtains', () => {
            const { props } = setupProps({ isHidden: true, isFascist: false })
            expectMatchingSnapshot(<CurtainWrapper {...props} />)
        })
    })

    describe('fascist', () => {
        it('renders visible curtains', () => {
            const { props } = setupProps({ isHidden: false, isFascist: true })
            expectMatchingSnapshot(<CurtainWrapper {...props} />)
        })

        it('renders hidden curtains', () => {
            const { props } = setupProps({ isHidden: true, isFascist: true })
            expectMatchingSnapshot(<CurtainWrapper {...props} />)
        })
    })
})
