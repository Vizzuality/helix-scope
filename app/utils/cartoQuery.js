import { ENDPOINT_SQL } from 'constants/map';

const cartoQuery = (sql) => fetch(`${ENDPOINT_SQL}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `q=${encodeURIComponent(sql)}`
});

export default cartoQuery;
