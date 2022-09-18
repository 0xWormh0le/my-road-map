import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';

import { Header } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Router>
    <Header />
  </Router>);
  expect(renderedComponent.find('.common-header-container').length).toBe(1);
});
