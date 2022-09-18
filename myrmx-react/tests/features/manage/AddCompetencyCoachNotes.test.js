import React from 'react';
import { shallow } from 'enzyme';
import { AddCompetencyCoachNotes } from '../../../src/features/manage';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<AddCompetencyCoachNotes />);
  expect(renderedComponent.find('.manage-add-stage-coach-notes').length).toBe(1);
});
