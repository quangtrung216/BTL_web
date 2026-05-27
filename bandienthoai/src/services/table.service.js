const db = require('../config/db');

function normalizeTableCode(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 20)
    .toUpperCase();
}

function buildCodeCandidates(value) {
  const code = normalizeTableCode(value);
  if (!code) return [];

  const candidates = new Set([code]);
  const numericMatch = code.match(/^T?0*(\d+)$/);
  if (numericMatch) {
    candidates.add(`T${numericMatch[1].padStart(2, '0')}`);
  }

  return Array.from(candidates);
}

async function findActiveByCode(value) {
  const candidates = buildCodeCandidates(value);
  if (!candidates.length) return null;

  const placeholders = candidates.map(() => '?').join(', ');
  const [rows] = await db.execute(
    `SELECT id, table_code, name, capacity, status, location
     FROM coffee_tables
     WHERE is_active = 1
       AND UPPER(table_code) IN (${placeholders})
     LIMIT 1`,
    candidates
  );

  return rows[0] || null;
}

module.exports = {
  findActiveByCode,
  normalizeTableCode
};
