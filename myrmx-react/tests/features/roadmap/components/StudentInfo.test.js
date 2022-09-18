import React from 'react';
import { shallow } from 'enzyme';
import { StudentInfo } from '../../../../src/features/roadmap';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<StudentInfo student={{}} />);
  expect(renderedComponent.find('.roadmap-components-student-info').length).toBe(1);
});
