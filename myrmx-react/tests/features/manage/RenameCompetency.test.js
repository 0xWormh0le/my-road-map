import React from 'react';
import { shallow } from 'enzyme';
import { RenameCompetency } from '../../../src/features/manage';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<RenameCompetency />);
  expect(renderedComponent.find('.manage-rename-competency').length).toBe(1);
});
