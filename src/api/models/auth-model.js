import promisePool from '../../utils/database.js';


const login = async (user) => {
    const [sql] = await promisePool.execute(
        `SELECT *
        FROM wsk_users 
        WHERE username = ?`,
        [user]
    );
    return sql[0] || null;         
}

const register = async (user) => {
    const {name, username, email, passwd, role} = user;
    const [result] = await promisePool.execute(
        `INSERT INTO wsk_users (name, username, email, password, role)
        VALUES (?, ?, ?, ?, ?)`,
        [name, username, email, passwd, role]
    );
    return {user_id: result.insertId};
};

export {login, register}