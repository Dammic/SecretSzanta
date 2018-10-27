import React from 'react';

export function replaceWithComponent(message) {
    const regex = /(%\*?[^%]*\*?%)/g;
    const matched = message.match(regex)
    const reslt = message.split(regex).reduce((result, el, index) => {
        console.log(el)
        if (el === '%counter%') {
            result.push(<span>counter</span>);
        } else if (el[1] === '*') {
            result.push(<b>{trim(el, '%*')}</b>);
        } else {
            result.push(<span>{el}</span>); 
        }
        return result;
    }, [])
    return reslt;
}
