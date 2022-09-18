import React from 'react';
import { shallow } from 'enzyme';
import { UserAvatarEditor } from '../../../../src/features/user';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(
    <UserAvatarEditor user={{ photo: 'url' }} />
  );
  expect(renderedComponent.find('.user-components-user-avatar-editor').length).toBe(1);
});
