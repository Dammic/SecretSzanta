import React from 'react'
import { replaceKeysWithComponent, markupMessage } from '../utils'
import { Counter } from '../components/Counter'

describe('replaceKeysWithComponent', () => {
    it('replaces key containing \'bold\' with <b /> tag, whatever the letter case', () => {
        const keysWithReplacementElements = replaceKeysWithComponent({
            bold: 'test',
            Bold: 'test2',
            bOlD: 'test3',
        })
        expect(keysWithReplacementElements).toEqual({
            bold: <b key="bold">test</b>,
            Bold: <b key="Bold">test2</b>,
            bOlD: <b key="bOlD">test3</b>,
        })
    })

    it('replaces key containing \'counter\' with <Counter /> component, whatever the letters case', () => {
        const keysWithReplacementElements = replaceKeysWithComponent({
            counter: 34,
            Counter: 3,
            coUNTER: 5,
        })
        expect(keysWithReplacementElements).toEqual({
            counter: <Counter key="counter" start={34} />,
            Counter: <Counter key="Counter" start={3} />,
            coUNTER: <Counter key="coUNTER" start={5} />,
        })
    })

    it('replaces key containing any special keyword with special component', () => {
        const keysWithReplacementElements = replaceKeysWithComponent({
            bold: 'test',
            Counter: 3,
            otherName: 34,
        })
        expect(keysWithReplacementElements).toEqual({
            bold: <b key="bold">test</b>,
            Counter: <Counter key="Counter" start={3} />,
            otherName: 34,
        })
    })

    it('in the other cases it just returns the case value back', () => {
        const keysWithReplacementElements = replaceKeysWithComponent({
            otherName: 34,
            notAll: 3,
            othersCases: 'some string',
        })
        expect(keysWithReplacementElements).toEqual({
            otherName: 34,
            notAll: 3,
            othersCases: 'some string',
        })
    })

    it('can be called with an empty object', () => {
        expect(replaceKeysWithComponent({})).toEqual({})
    })
})

const notFoundValueText = '[STEVE! YOU SHOULD put some value HERE]'

describe('markupMessage', () => {
    it('divides text based on "{}" chars to tokens', () => {
        const tokens = markupMessage('{random example} with other text and {another sample}')
        expect(tokens).toEqual([notFoundValueText, ' with other text and ', notFoundValueText])
    })

    it('return nodes with given Component in place of some string found within template', () => {
        const nameReplacement = <b>Jarek</b>
        const numberReplacement = 100

        const nodes = markupMessage('{ name } found a { number } dollars', {
            name: nameReplacement,
            number: numberReplacement,
        })
        expect(nodes).toEqual([nameReplacement, ' found a ', numberReplacement, ' dollars'])
    })
})
