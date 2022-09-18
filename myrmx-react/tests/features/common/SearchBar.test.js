import React from 'react';
import { shallow } from 'enzyme';
import { SearchBar } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SearchBar />);
  expect(renderedComponent.find('.common-search-bar').length).toBe(1);
});
