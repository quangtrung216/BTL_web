const db = require('../config/db');
const userModel = require('../models/user.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function getAllUsers(...args) {
  return allRows(userModel);
}


async function getUserById(...args) {
  const [rows] = await db.execute(
    `SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.address,
      u.role_id,
      u.status,
      u.created_at,
      u.updated_at,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
    LIMIT 1`,
    [args[0]]
  );
  return rows[0] || null;
}


async function createStaff(...args) {
  return insertRow(userModel, args[0] || {});
}


async function createAdmin(...args) {
  return insertRow(userModel, args[0] || {});
}


async function updateUser(...args) {
  return updateRow(userModel, args[0], args[1] || {});
}


async function updateProfile(...args) {
  const data = args[1] || {};
  await db.execute(
    'UPDATE users SET full_name = ?, phone = ?, address = ? WHERE id = ?',
    [data.full_name || '', data.phone || '', data.address || '', args[0]]
  );
  return { ok: true };
}


async function toggleUserStatus(...args) {
  const item = await rowById(userModel, args[0]);
  if (!item) return { ok: false };
  const nextValue = Number(item.status || 0) === 1 ? 0 : 1;
  await db.execute('UPDATE users SET status = ? WHERE id = ?', [nextValue, args[0]]);
  return { ok: true };
}


async function changeUserRole(...args) {
  await db.execute('UPDATE users SET role_id = ? WHERE id = ?', [args[1], args[0]]);
  return { ok: true };
}


async function deleteUserSoft(...args) {
  return deleteRow(userModel, args[0]);
}


module.exports = {
  getAllUsers,
  getUserById,
  createStaff,
  createAdmin,
  updateUser,
  updateProfile,
  toggleUserStatus,
  changeUserRole,
  deleteUserSoft
};
