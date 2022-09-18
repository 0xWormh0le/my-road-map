import React from 'react';
import { shallow } from 'enzyme';
import { AddCompetencySupplementalContent } from '../../../src/features/manage';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<AddCompetencySupplementalContent />);
  expect(renderedComponent.find('.manage-add-competency-supplemental-content').length).toBe(1);
});
