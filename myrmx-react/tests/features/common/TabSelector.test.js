import React from 'react';
import { shallow } from 'enzyme';
import { TabSelector } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TabSelector tabs={[]}/>);
  expect(renderedComponent.find('.tab-selector').length).toBe(1);
});
