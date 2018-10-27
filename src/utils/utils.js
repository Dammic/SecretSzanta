import React from 'react';
import { trim } from 'lodash';

export function replaceWithComponent(message) {
    const regex = /(%\*?[^%]*\*?%)/g
    return message.split(regex).reduce((result, splittedPhrase, index) => {
        if (splittedPhrase === '%counter%') {
            result.push(<span>counter</span>)
        } else if (splittedPhrase[1] === '*') {
            result.push(<b>{trim(splittedPhrase, '%*')}</b>)
        } else {
            result.push(<span>{splittedPhrase}</span>)
        }
        return result
    }, [])
}
