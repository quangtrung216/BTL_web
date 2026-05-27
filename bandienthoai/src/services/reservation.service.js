const db = require('../config/db');

function buildReservationCode() {
  return 'RSV' + Date.now();
}

function getBranchLabel(value) {
  const branches = {
    'hung-yen': 'Brew Haven Hưng Yên - Khoái Châu, Tỉnh Hưng Yên',
    'ha-noi': 'Brew Haven Hà Nội - Hoàn Kiếm, Thành phố Hà Nội',
    'hai-phong': 'Brew Haven Hải Phòng - Lê Chân, Thành phố Hải Phòng'
  };
  return branches[value] || branches['hung-yen'];
}

async function createReservation(userId, data) {
  const guestCount = Math.max(1, Number.parseInt(data.party_size || data.guest_count, 10) || 1);
  const [tables] = await db.execute(
    `SELECT * FROM coffee_tables
     WHERE is_active = 1
       AND capacity >= ?
     ORDER BY capacity ASC, id ASC
     LIMIT 1`,
    [guestCount]
  );

  const table = tables[0];
  if (!table) {
    return { ok: false, message: 'Hiện chưa có bàn phù hợp với số khách này.' };
  }

  const noteParts = [
    data.branch ? `Cơ sở: ${getBranchLabel(data.branch)}` : '',
    data.email ? `Email: ${data.email}` : '',
    data.message ? `Ghi chú: ${data.message}` : ''
  ].filter(Boolean);

  const [result] = await db.execute(
    `INSERT INTO reservations
     (user_id, table_id, reservation_code, reservation_date, reservation_time, guest_count, status, contact_name, contact_phone, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId || null,
      table.id,
      buildReservationCode(),
      data.reservation_date,
      data.reservation_time,
      guestCount,
      'pending',
      data.name || data.contact_name || '',
      data.phone || data.contact_phone || '',
      noteParts.join(' | ').slice(0, 255)
    ]
  );

  return { ok: true, id: result.insertId };
}

async function getAllReservations() {
  const [rows] = await db.execute(
    `SELECT
       r.*,
       u.full_name AS customer_name,
       u.email AS customer_email,
       t.name AS table_name,
       t.capacity AS table_capacity
     FROM reservations r
     LEFT JOIN users u ON u.id = r.user_id
     LEFT JOIN coffee_tables t ON t.id = r.table_id
     ORDER BY r.id DESC`
  );
  return rows;
}

async function getReservationsByUser(userId) {
  const [rows] = await db.execute(
    `SELECT
       r.*,
       t.name AS table_name,
       t.capacity AS table_capacity
     FROM reservations r
     LEFT JOIN coffee_tables t ON t.id = r.table_id
     WHERE r.user_id = ?
     ORDER BY r.id DESC`,
    [userId]
  );
  return rows;
}

function normalizeReservationStatus(status) {
  const statusMap = {
    pending: 'pending',
    confirmed: 'confirmed',
    approved: 'confirmed',
    cancelled: 'cancelled',
    rejected: 'cancelled',
    completed: 'completed'
  };
  return statusMap[String(status || '').toLowerCase()] || 'pending';
}

async function updateReservationStatus(id, status) {
  await db.execute(
    'UPDATE reservations SET status = ? WHERE id = ?',
    [normalizeReservationStatus(status), id]
  );
  return { ok: true };
}

module.exports = {
  createReservation,
  getAllReservations,
  getReservationsByUser,
  updateReservationStatus
};
