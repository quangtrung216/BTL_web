const db = require('../config/db');

async function allRows(model) {
  const [rows] = await db.execute(`SELECT * FROM ${model.tableName} ORDER BY ${model.primaryKey} DESC`);
  return rows;
}

async function rowById(model, id) {
  const [rows] = await db.execute(`SELECT * FROM ${model.tableName} WHERE ${model.primaryKey} = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function insertRow(model, data) {
  const fields = (model.fillable || []).filter((field) => data[field] !== undefined);
  if (!fields.length) return { ok: true };
  const sql = `INSERT INTO ${model.tableName} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
  const values = fields.map((field) => data[field]);
  const [result] = await db.execute(sql, values);
  return { ok: true, id: result.insertId };
}

async function updateRow(model, id, data) {
  const fields = (model.fillable || []).filter((field) => data[field] !== undefined);
  if (!fields.length) return { ok: true };
  const sql = `UPDATE ${model.tableName} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE ${model.primaryKey} = ?`;
  const values = fields.map((field) => data[field]);
  values.push(id);
  await db.execute(sql, values);
  return { ok: true };
}

async function deleteRow(model, id) {
  await db.execute(`DELETE FROM ${model.tableName} WHERE ${model.primaryKey} = ?`, [id]);
  return { ok: true };
}

async function searchRows(model, keyword) {
  if (!keyword || !model.searchable || !model.searchable.length) {
    return allRows(model);
  }
  const where = model.searchable.map((field) => `${field} LIKE ?`).join(' OR ');
  const params = model.searchable.map(() => `%${keyword}%`);
  const [rows] = await db.execute(`SELECT * FROM ${model.tableName} WHERE ${where} ORDER BY ${model.primaryKey} DESC`, params);
  return rows;
}

module.exports = {
  allRows,
  rowById,
  insertRow,
  updateRow,
  deleteRow,
  searchRows,
  db
};
