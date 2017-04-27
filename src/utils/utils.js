'use strict'

export const dispatchAction = function (type, payload, parameters) {
    return {
        type,
        payload: {...payload, ...parameters}
    }
}
