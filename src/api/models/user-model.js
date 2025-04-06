import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  return rows[0] || null;
};

const addUser = async (user) => {
  const {name, username, email, password, role = 'user'} = user;
  const [result] = await promisePool.execute(
    `INSERT INTO wsk_users (name, username, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, username, email, password, role]
  );
  return {user_id: result.insertId};
};

const modifyUser = async (user, id) => {
  const params = [
    user.name,
    user.username,
    user.email,
    user.password,
    user.role,
    id
  ];
  const [result] = await promisePool.execute(
    `UPDATE wsk_users 
     SET name = ?, username = ?, email = ?, password = ?, role = ?
     WHERE user_id = ?`,
    params
  );
  return result.affectedRows > 0;
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    
    await connection.execute(
      'DELETE FROM wsk_cats WHERE owner = ?',
      [id]
    );
    
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );
    
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser
};