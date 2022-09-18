import React from 'react';
import { shallow } from 'enzyme';
import { RenameStage } from '../../../src/features/manage';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<RenameStage />);
  expect(renderedComponent.find('.manage-rename-stage').length).toBe(1);
});
