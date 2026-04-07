import mysql from "mysql2";
import 'dotenv/config';

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || '',
//   database: process.env.DB_NAME || 'quanlynhansu',
//   port: process.env.DB_PORT || 3306,
//   ssl: {
//     rejectUnauthorized: false
//   },
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'HQD',
  password: process.env.DB_PASS || 'hoangquocdat2004',
  database: process.env.DB_NAME || 'quanlynhansu',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;