export const LOAD_HEADLINES = 'LOAD_HEADLINES';
export const RECEIVE_HEADLINES = 'RECEIVE_HEADLINES';
export const SHOW_HEADLINE = 'SHOW_HEADLINE';

export function loadHeadlines() {
  return {
    type: LOAD_HEADLINES
  };
}

export function receiveHeadlines(headlines) {
  return {
    type: RECEIVE_HEADLINES,
    headlines
  };
}

export function showHeadline(headlineIndex) {
  return {
    type: SHOW_HEADLINE,
    headlineIndex
  };
}

export function fetchHeadlinesIfNeeded() {
  return (dispatch, getState) => {
    if (getState().headlines.headlines.length === 0) {
      dispatch(loadHeadlines());
      return fetch('/dummy_headlines.json')
        .then(response => response.json())
        .then(json => {
          const fetchedHeadlines = json.data.attributes.headlines.map(child => child);
          dispatch(receiveHeadlines(fetchedHeadlines));
        });
    }
    return dispatch(receiveHeadlines(getState().headlines.headlines.concat()));
  };
}
