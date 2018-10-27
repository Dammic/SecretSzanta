import React from 'react';
import { replaceWithComponent } from '../collectionsHelper';

describe('replaceWithComponent', () => {
    test('matches counter', () => {
        const phrase = 'The elections will start in %counter% seconds!';
        const result = replaceWithComponent(phrase);
        expect(result).toEqual([<span>The elections will start in </span>, <span>dupadupadupa</span>, <span> seconds!</span>])
    })
});
