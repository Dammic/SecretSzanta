import React from 'react'
import { compact, trim, map, fromPairs } from 'lodash'
import { Counter } from './components/Counter'

export const markupMessage = (template, values = {}) => {
    const regex = /({.*?})/g
    const matchedKeys = template.match(regex) || []
    const splitedNodes = compact(template.split(regex))

    const result = splitedNodes.map((val) => {
        if (matchedKeys.includes(val)) {
            const keyName = trim(val, ' {}')
            return values[keyName] || '[STEVE! YOU SHOULD put some value HERE]'
        }
        return val
    })

    return result
}

export const replaceKeysWithComponent = (values) => {
    return fromPairs(map(values, (val, key) => {
        const lowercasedKey = key.toLowerCase()
        if (lowercasedKey.includes('bold')) {
            return [key, <b key={key}>{val}</b>]
        }
        if (lowercasedKey.includes('counter')) {
            return [key, <Counter key={key} start={val} />]
        }
        return [key, val]
    }))
}
