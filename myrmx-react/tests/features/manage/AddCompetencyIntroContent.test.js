import React from 'react';
import { shallow } from 'enzyme';
import { AddCompetencyIntroContent } from '../../../src/features/manage';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<AddCompetencyIntroContent />);
  expect(renderedComponent.find('.manage-add-competency-intro-content-component').length).toBe(1);
});
