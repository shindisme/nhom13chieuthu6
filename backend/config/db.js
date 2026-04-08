import mysql from "mysql2/promise";
import 'dotenv/config';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'quanlynhansu',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.promise = () => db;

db.getConnection()
  .then(connection => {
    console.log(' -<Kết nối Database thành công!>-');
    connection.release(); 
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối Database:', err.message);
  });

export default db;