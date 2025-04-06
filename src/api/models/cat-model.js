import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
  `);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.cat_id = ?
  `, [id]);
  return rows[0] || null;
};

const findCatsByUserId = async (userId) => {
  const [rows] = await promisePool.execute(`
    SELECT c.*, u.name as owner_name 
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.owner = ?
  `, [userId]);
  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const [result] = await promisePool.execute(
    `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
     VALUES (?, ?, ?, ?, ?)`,
    [cat_name, weight, owner, filename, birthdate]
  );
  return {cat_id: result.insertId};
};

const modifyCat = async (cat, id) => {
  const params = [
    cat.cat_name,
    cat.weight,
    cat.owner,
    cat.filename,
    cat.birthdate,
    id
  ];
  const [result] = await promisePool.execute(
    `UPDATE wsk_cats 
     SET cat_name = ?, weight = ?, owner = ?, filename = ?, birthdate = ?
     WHERE cat_id = ?`,
    params
  );
  return result.affectedRows > 0;
};

const removeCat = async (id, userId, role) => {
  let sql, params;
  
  if (role === 'admin') {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
    params = [id];
  } else {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?';
    params = [id, userId];
  }

  const [result] = await promisePool.execute(sql, params);
  return result.affectedRows > 0;
};

export {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat
};