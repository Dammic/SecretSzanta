export function invokeOnEvery(array, functionToInvoke) {
    array.forEach(element => functionToInvoke(element))
}
