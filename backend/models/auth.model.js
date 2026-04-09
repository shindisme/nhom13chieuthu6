import db from "../config/db.js";

export const findUserByEmail = async (email) => {
    const connection = await db;
    const query = `SELECT * FROM taikhoan WHERE Email = ?`;
    return connection.execute(query, [email]);
};