import React from 'react'
import { replaceWithComponent } from '../utils'

describe('replaceWithComponent', () => {
    test('matches counter', () => {
        const phrase = 'The elections will start in %counter% seconds!'
        const result = replaceWithComponent(phrase)
        expect(result).toEqual([
            <span>The elections will start in </span>,
            <span>counter</span>,
            <span> seconds!</span>
        ])
    })

    test('matches bold', () => {
        const phrase = 'The elections will start in %*3*% seconds!'
        const result = replaceWithComponent(phrase)
        expect(result).toEqual([
            <span>The elections will start in </span>,
            <b>3</b>,
            <span> seconds!</span>
        ])
    })

    test('matches both counter and bold', () => {
        const phrase = 'The elections will %*start*% in %counter% seconds!'
        const result = replaceWithComponent(phrase)
        expect(result).toEqual([
            <span>The elections will </span>,
            <b>start</b>,
            <span> in </span>,
            <span>counter</span>,
            <span> seconds!</span>
        ])
    })
})
