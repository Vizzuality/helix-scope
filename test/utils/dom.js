/* eslint no-restricted-syntax: 0 */

import jsdom from 'jsdom';

// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
// get the window object out of the document
const win = doc.defaultView;

// from mocha-jsdom
// https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(w) {
  for (const key in w) {
    if (!Object.prototype.hasOwnProperty.call(w, key)) {
      continue;
    }
    if (key in global) {
      continue;
    }
    global[key] = w[key];
  }
}

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc;
global.window = win;

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(win);
