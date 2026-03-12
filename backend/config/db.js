import mysql from "mysql2";

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER|| 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'quanlynhansu',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
      },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.connect((err) => {
    if (err) {
        console.log("ket noi that bai", err);
    } else {
        console.log("ket noi thanh cong");
    }
});

export default db;