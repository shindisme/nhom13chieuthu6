import db from "../config/db.js";

export const getAllUsers = () => {
    const sql = "select * FROM users";
    return db.promise().query(sql);
};

export const getUserById = (id) => {
    const sql = "select * from users where id = ?";
    return db.promise().query(sql, [id]);
};

export const createUser = (id, name) => {
    const sql = "insert into users (id, name) values (?, ?)";
    return db.promise().query(sql, [id, name]);
};

export const updateUser = (id, name) => {
    const sql = "update users set name=? where id=?";
    return db.promise().query(sql, [name, id]);
};

export const deleteUser = (id) => {
    const sql = "delete from users where id=?";
    return db.promise().query(sql, [id]);
};