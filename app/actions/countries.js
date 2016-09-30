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
          category: 'biodiversity',
          unit: '%',
          data: [
            {
              indicator1: 10,
              indicator2: 20,
              indicator3: 30,
              indicator4: 40,
              season: 1
            },
            {
              indicator1: 15,
              indicator2: 22,
              indicator3: 35,
              indicator4: 44,
              season: 2
            },
            {
              indicator1: 12,
              indicator2: 21,
              indicator3: 38,
              indicator4: 43,
              season: 3
            },
            {
              indicator1: 6,
              indicator2: 12,
              indicator3: 22,
              indicator4: 30,
              season: 4
            }
          ]
        },
        {
          name: 'Avg change temperature',
          category: 'climate',
          unit: 'ºC',
          data: [
            {
              indicator1: 2,
              indicator2: 2.8,
              indicator3: 4.6,
              indicator4: 5,
              season: 1
            },
            {
              indicator1: 2.5,
              indicator2: 3.2,
              indicator3: 4.7,
              indicator4: 5.6,
              season: 2
            },
            {
              indicator1: 1.8,
              indicator2: 4,
              indicator3: 4.9,
              indicator4: 6.7,
              season: 3
            },
            {
              indicator1: 1.5,
              indicator2: 2,
              indicator3: 4,
              indicator4: 6,
              season: 4
            }
          ]
        },
        {
          name: 'Avg precipitation',
          category: 'water',
          unit: 'mm',
          data: [
            {
              indicator1: 2,
              indicator2: 2.5,
              indicator3: 3.5,
              indicator4: 4,
              season: 1
            },
            {
              indicator1: 3,
              indicator2: 3.5,
              indicator3: 4,
              indicator4: 4.5,
              season: 2
            },
            {
              indicator1: 2,
              indicator2: 2.5,
              indicator3: 3.6,
              indicator4: 4.4,
              season: 3
            },
            {
              indicator1: 1.5,
              indicator2: 2,
              indicator3: 4,
              indicator4: 6,
              season: 4
            }
          ]
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
