const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const ROLES = require('../constants/roles');

function normalizeRole(roleName, roleId) {
  const role = String(roleName || '').trim().toLowerCase();
  if ([ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER].includes(role)) {
    return role;
  }

  if (Number(roleId) === 1) return ROLES.ADMIN;
  if (Number(roleId) === 2) return ROLES.STAFF;
  return ROLES.CUSTOMER;
}

async function registerCustomer(data) {
  const email = String(data.email || '').trim().toLowerCase();
  const password = data.password || '123456';

  if (!data.full_name || !email || !password) {
    return { ok: false, message: 'Vui long nhap day du ho ten, email va mat khau' };
  }

  if (data.confirm_password !== undefined && password !== data.confirm_password) {
    return { ok: false, message: 'Mat khau xac nhan khong khop' };
  }

  const passwordHash = await hashPassword(password);

  const [exists] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (exists.length) {
    return { ok: false, message: 'Email da ton tai' };
  }

  await db.execute(
    'INSERT INTO users (full_name, email, phone, password_hash, address, role_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.full_name || '', email, data.phone || '', passwordHash, data.address || '', 3, 'active']
  );

  return { ok: true };
}

async function login(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { ok: false, message: 'Vui long nhap email va mat khau' };
  }

  const [rows] = await db.execute(
    `SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.address,
      u.password_hash,
      u.role_id,
      u.status,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
    LIMIT 1`,
    [normalizedEmail]
  );

  const user = rows[0];
  if (!user) {
    return { ok: false, message: 'Sai email hoac mat khau' };
  }

  if (String(user.status || '').toLowerCase() !== 'active') {
    return { ok: false, message: 'Tai khoan dang bi khoa hoac chua kich hoat' };
  }

  const matched = await comparePassword(password, user.password_hash || '');
  if (!matched) {
    return { ok: false, message: 'Sai email hoặc mật khẩu' };
  }

  const role = normalizeRole(user.role_name, user.role_id);

  return {
    ok: true,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role,
      role_id: user.role_id,
      status: user.status
    }
  };
}

async function getCurrentUser(userId) {
  const [rows] = await db.execute(
    `SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.address,
      u.role_id,
      u.status,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
    LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function changePassword(userId, oldPassword, newPassword) {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
  const user = rows[0];

  if (!user) {
    return { ok: false, message: 'Khong tim thay tai khoan' };
  }

  const matched = await comparePassword(oldPassword || '', user.password_hash || '');
  if (!matched) {
    return { ok: false, message: 'Mat khau cu khong dung' };
  }

  const passwordHash = await hashPassword(newPassword || '123456');
  await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
  return { ok: true };
}

async function logout() {
  return { ok: true };
}

module.exports = {
  registerCustomer,
  login,
  getCurrentUser,
  changePassword,
  logout
};
