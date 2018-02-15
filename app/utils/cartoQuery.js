import axios from 'axios';

import { ENDPOINT_SQL } from 'constants/map';

const cartoQuery = (sql) => axios.get(ENDPOINT_SQL, {
  params: {
    q: sql
  }
});

export default cartoQuery;
