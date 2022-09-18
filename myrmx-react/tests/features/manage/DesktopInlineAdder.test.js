import React from 'react';
import { shallow } from 'enzyme';
import { DesktopInlineAdder } from '../../../src/features/manage';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DesktopInlineAdder />);
  expect(renderedComponent.find('.manage-desktop-inline-adder').length).toBe(1);
});
