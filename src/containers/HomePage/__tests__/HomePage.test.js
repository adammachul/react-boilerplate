import React from 'react';
import renderer from 'react-test-renderer';

import HomePage from '../index';

describe('<HomePage />', () => {
    test('renders', () => {
        const tree = renderer.create(<HomePage />).toJSON();

        expect(tree).toMatchSnapshot();
    })
})
