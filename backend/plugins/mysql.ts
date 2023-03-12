import mysql from 'mysql2';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: 'root',
  database: 'shop',
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0
});
const promisePool = pool.promise();

export default promisePool
