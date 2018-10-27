import React from 'react';
export function invokeOnEvery(array, functionToInvoke) {
    array.forEach(element => functionToInvoke(element))
}
        export function replaceWithComponent(message) {
            const regex = /(%(.*)%)/g;
            const matched = message.match(regex)
            const reslt = message.split(regex).reduce((result, el, index) => {
                console.log(el)
                if (el === '%counter%') {
                    result.push(<span>dupadupadupa</span>);
                } else if (el[1] === '*') {
                    result.push(<b>{trim(el, '%*')}</b>);
                } else {
                    result.push(<span>{el}</span>); 
                }
                return result;
                // final.push (
                //     <WithWhat value={matched[index - 1]}/>, <span> {el}</span>
                // )
            }, [])
            return reslt;
        }
