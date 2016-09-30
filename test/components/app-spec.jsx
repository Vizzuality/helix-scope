import React from 'react';
import { renderIntoDocument, scryRenderedDOMComponentsWithTag } from 'react-addons-test-utils';
import { expect } from 'chai';
import App from '../../app/components/App';

describe('App component', () => {
  it('renders an hello message', () => {
    const component = renderIntoDocument(
      <App />
    );
    const titles = scryRenderedDOMComponentsWithTag(component, 'h1');
    expect(titles[0].textContent).to.equal('Hello!');
  });
});
