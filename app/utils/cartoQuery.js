import { ENDPOINT_SQL } from 'constants/map';

const cartoQuery = (sql) => fetch(`${ENDPOINT_SQL}?q=${encodeURIComponent(sql)}`);

export default cartoQuery;
