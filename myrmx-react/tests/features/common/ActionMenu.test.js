import React from 'react';
import { shallow } from 'enzyme';
import { ActionMenu } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ActionMenu items={[]}/>);
  expect(renderedComponent.find('.common-action-menu').length).toBe(1);
});
