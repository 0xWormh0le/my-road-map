import React from 'react';
import { shallow } from 'enzyme';
import Roadmap from '../../../../src/features/dashboard/components/Roadmap';

it('renders node with correct class name', () => {
  const data = {
    title: 'Roadmap #1'
  }
  const renderedComponent = shallow(<Roadmap data={data} />);
  expect(renderedComponent.find('.dashboard-roadmap-card').length).toBe(1);
});
