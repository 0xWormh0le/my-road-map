import React from 'react';
import { shallow } from 'enzyme';
import { CustomDialog } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(
    <CustomDialog text={{ caption: 'caption', yes: 'yes' }}/>
  );
  expect(renderedComponent.find('.common-custom-dialog').length).toBe(1);
});
