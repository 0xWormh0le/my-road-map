import React from 'react';
import { shallow } from 'enzyme';
import { CustomTable } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CustomTable columns={[]} data={[]} />);
  expect(renderedComponent.find('.common-custom-table').length).toBe(1);
});
