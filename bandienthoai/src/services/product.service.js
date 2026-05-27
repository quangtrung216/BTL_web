const db = require('../config/db');
const productModel = require('../models/product.model');
const { allRows, rowById, updateRow, deleteRow } = require('./_base.service');

function normalizeLimit(value, fallback = 8) {
  return Math.max(1, Number.parseInt(value, 10) || fallback);
}

const PRODUCT_STATUSES = new Set(['available', 'out_of_stock', 'hidden']);

function normalizeText(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function normalizeRequiredText(value, fieldName) {
  const text = normalizeText(value);
  if (!text) {
    throw new Error(`${fieldName} is required`);
  }
  return text;
}

function normalizeInteger(value, fieldName, fallback = null, min = 0) {
  if (value === undefined || value === null || value === '') {
    if (fallback !== null) return fallback;
    throw new Error(`${fieldName} is required`);
  }

  const number = Number(value);
  if (!Number.isInteger(number) || number < min) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return number;
}

function normalizeMoney(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
  return number;
}

function normalizeStatus(value) {
  const status = normalizeText(value) || 'available';
  return PRODUCT_STATUSES.has(status) ? status : 'available';
}

function normalizeProductPayload(data = {}, options = {}) {
  const partial = Boolean(options.partial);
  const payload = {};

  if (!partial || data.name !== undefined) {
    payload.name = normalizeRequiredText(data.name, 'Product name');
  }
  if (!partial || data.category_id !== undefined) {
    payload.category_id = normalizeInteger(data.category_id, 'Category', null, 1);
  }
  if (!partial || data.description !== undefined) {
    payload.description = normalizeText(data.description) || null;
  }
  if (!partial || data.base_price !== undefined) {
    payload.base_price = normalizeMoney(data.base_price, 'Price');
  }
  if (!partial || data.image_url !== undefined) {
    payload.image_url = normalizeText(data.image_url) || null;
  }
  if (!partial || data.stock_quantity !== undefined) {
    payload.stock_quantity = normalizeInteger(data.stock_quantity, 'Stock quantity', 0);
  }
  if (!partial || data.status !== undefined) {
    payload.status = normalizeStatus(data.status);
  }

  return payload;
}

async function getAvailableProducts(limit) {
  const safeLimit = limit ? normalizeLimit(limit) : null;
  const sql = `SELECT * FROM products WHERE status = ? ORDER BY id DESC${safeLimit ? ` LIMIT ${safeLimit}` : ''}`;
  const [rows] = await db.execute(sql, ['available']);
  return rows;
}

async function getFeaturedProducts(...args) {
  return getAvailableProducts(args[0] || 8);
}


async function getNewestProducts(...args) {
  return getAvailableProducts(args[0] || 8);
}


async function getPromotionProducts(...args) {
  return getAvailableProducts(args[0] || 8);
}


async function getAllProducts(...args) {
  return allRows(productModel);
}


async function getProductById(...args) {
  return rowById(productModel, args[0]);
}


async function getProductDetail(...args) {
  const [products] = await db.execute('SELECT * FROM products WHERE id = ? AND status = ? LIMIT 1', [args[0], 'available']);
  const product = products[0] || null;
  if (!product) {
    return { product: null, images: [], sizes: [], toppings: [], relatedProducts: [] };
  }
  let images = [];
  try {
    const [imageRows] = await db.execute('SELECT * FROM product_images WHERE product_id = ? ORDER BY id DESC', [args[0]]);
    images = imageRows;
  } catch (err) {
    images = [];
  }
  const [sizes] = await db.execute('SELECT * FROM product_sizes WHERE product_id = ? ORDER BY id DESC', [args[0]]);
  const [toppings] = await db.execute('SELECT * FROM toppings WHERE is_active = 1 ORDER BY id DESC');
  const [relatedProducts] = await db.execute('SELECT * FROM products WHERE id <> ? AND status = ? ORDER BY id DESC LIMIT 4', [args[0], 'available']);
  return { product, images, sizes, toppings, relatedProducts };
}


async function searchProducts(...args) {
  const filters = args[0] || {};
  const keyword = typeof filters === 'string' ? filters : filters.keyword;

  if (!keyword) {
    return getAvailableProducts();
  }

  const [rows] = await db.execute(
    'SELECT * FROM products WHERE status = ? AND name LIKE ? ORDER BY id DESC',
    ['available', `%${keyword}%`]
  );
  return rows;
}


async function filterProducts(...args) {
  const filters = args[0] || {};
  let sql = 'SELECT * FROM products WHERE status = ?';
  const params = ['available'];
  if (filters.category_id) { sql += ' AND category_id = ?'; params.push(filters.category_id); }
  sql += ' ORDER BY id DESC';
  const [rows] = await db.execute(sql, params);
  return rows;
}


async function createProduct(...args) {
  const data = normalizeProductPayload(args[0] || {});
  const [result] = await db.execute(
    `INSERT INTO products
      (name, category_id, description, base_price, image_url, stock_quantity, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      data.name,
      data.category_id,
      data.description,
      data.base_price,
      data.image_url,
      data.stock_quantity,
      data.status
    ]
  );
  return { ok: true, id: result.insertId };
}


async function updateProduct(...args) {
  const data = normalizeProductPayload(args[1] || {}, { partial: true });
  return updateRow(productModel, args[0], data);
}


async function deleteProduct(...args) {
  return deleteRow(productModel, args[0]);
}


async function toggleProductStatus(...args) {
  const item = await rowById(productModel, args[0]);
  if (!item) return { ok: false, message: 'Không tìm thấy sản phẩm' };
  const nextValue = String(item.status || '') === 'hidden' ? 'available' : 'hidden';
  await db.execute('UPDATE products SET status = ? WHERE id = ?', [nextValue, args[0]]);
  return { ok: true };
}


async function updateStock(...args) {
  await db.execute('UPDATE products SET stock_quantity = ? WHERE id = ?', [args[1], args[0]]);
  return { ok: true };
}


async function getRelatedProducts(...args) {
  const safeLimit = normalizeLimit(args[1] || 4, 4);
  const [rows] = await db.execute(`SELECT * FROM products WHERE id <> ? AND status = ? ORDER BY id DESC LIMIT ${safeLimit}`, [args[0], 'available']);
  return rows;
}


module.exports = {
  getFeaturedProducts,
  getNewestProducts,
  getPromotionProducts,
  getAvailableProducts,
  getAllProducts,
  getProductById,
  getProductDetail,
  searchProducts,
  filterProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateStock,
  getRelatedProducts
};
