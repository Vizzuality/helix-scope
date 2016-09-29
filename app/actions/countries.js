import { push } from 'react-router-redux';
import { ENDPOINT_SQL } from 'constants/map';

export const GET_COUNTRY_DATA = 'GET_COUNTRY_DATA';
export const GET_COUNTRIES_LIST = 'GET_COUNTRIES_LIST';

export function getCountriesList() {
  const url = `${ENDPOINT_SQL}?q=SELECT%20name_engli%20as%20name,%20iso%20FROM%20country_geoms%20ORDER%20BY%20name%20ASC`;
  return dispatch => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: GET_COUNTRIES_LIST,
          payload: data.rows
        });
      });
  };
}

export function getCountryData(iso) {
  return {
    type: GET_COUNTRY_DATA,
    payload: {
      iso,
      name: 'Brazil',
      regions: [
        {
          name: 'North',
          slug: 'north'
        },
        {
          name: 'Northeast',
          slug: 'northeast'
        },
        {
          name: 'West Central',
          slug: 'westcentral'
        },
        {
          name: 'Southeast',
          slug: 'southeast'
        },
        {
          name: 'South',
          slug: 'south'
        }
      ],
      indicators: [
        {
          name: 'Plant Species Richness Remaining',
          category: 'Biodiversity'
        },
        {
          name: 'Avg change temperature',
          category: 'Climate'
        },
        {
          name: 'Avg precipitation',
          category: 'Water'
        }
      ]
    }
  };
}

export function goToCountry(slug) {
  return (dispatch) => {
    dispatch(push(`/countries/${slug}`));
  };
}
