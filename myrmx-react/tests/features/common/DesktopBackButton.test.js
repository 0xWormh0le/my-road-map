import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';

import { DesktopBackButton } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Router>
    <DesktopBackButton />
  </Router>);
  expect(renderedComponent.find('.common-desktop-back-button').length).toBe(1);
});
