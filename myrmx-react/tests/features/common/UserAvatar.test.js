import React from 'react';
import { shallow } from 'enzyme';
import { UserAvatar } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UserAvatar />);
  expect(renderedComponent.find('.common-user-avatar').length).toBe(1);
});
