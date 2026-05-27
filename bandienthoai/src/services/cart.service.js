const db = require('../config/db');
const promotionService = require('./promotion.service');

async function getOrCreateCart(userId) {
  const [rows] = await db.execute('SELECT * FROM carts WHERE user_id = ? LIMIT 1', [userId]);
  if (rows[0]) return rows[0];
  const [result] = await db.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return { id: result.insertId, user_id: userId };
}

async function getCartByUser(userId) {
  return getOrCreateCart(userId);
}

async function getCartItems(userId) {
  const cart = await getOrCreateCart(userId);
  const [rows] = await db.execute(
    `SELECT ci.*, p.name, p.base_price, p.image_url, ps.size_name,
       (
         SELECT GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ')
         FROM toppings t
         WHERE ci.toppings IS NOT NULL
           AND ci.toppings <> ''
           AND FIND_IN_SET(t.id, ci.toppings)
       ) AS topping_names
     FROM cart_items ci
     LEFT JOIN products p ON p.id = ci.product_id
     LEFT JOIN product_sizes ps ON ps.id = ci.size_id
     WHERE ci.cart_id = ?
     ORDER BY ci.id DESC`,
    [cart.id]
  );
  return rows;
}

function normalizeQuantity(value) {
  const quantity = Number(value || 1);
  return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
}

function normalizeToppings(value) {
  if (!value) return '';
  return String(value)
    .split(',')
    .map(id => Number(id))
    .filter(Boolean)
    .sort((a, b) => a - b)
    .join(',');
}

async function getToppingDetails(toppings) {
  const toppingIds = toppings
    .split(',')
    .map(id => Number(id))
    .filter(Boolean);

  if (!toppingIds.length) return { total: 0, names: '' };

  const placeholders = toppingIds.map(() => '?').join(',');
  const [rows] = await db.execute(
    `SELECT SUM(price) AS total, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS names
     FROM toppings
     WHERE id IN (${placeholders}) AND is_active = 1`,
    toppingIds
  );

  return {
    total: Number(rows[0]?.total || 0),
    names: rows[0]?.names || ''
  };
}

async function getToppingsTotal(toppings) {
  const details = await getToppingDetails(toppings);
  return details.total;
}

async function addToCart(userId, productData, quantity) {
  const data = typeof productData === 'object'
    ? productData
    : { product_id: productData, quantity };

  const cart = await getOrCreateCart(userId);
  const productId = data.product_id;
  let sizeId = data.size_id || null;
  const itemQuantity = normalizeQuantity(data.quantity);
  const toppings = normalizeToppings(data.toppings);
  const sweetness = data.sweetness || '50%';
  const ice = data.ice || '50%';
  const note = data.note || null;

  const [products] = await db.execute(
    'SELECT * FROM products WHERE id = ? AND status = ? LIMIT 1',
    [productId, 'available']
  );
  const product = products[0];
  if (!product) return { ok: false, message: 'Không tìm thấy sản phẩm' };

  let unitPrice = Number(product.base_price || 0);

  if (sizeId) {
    const [sizes] = await db.execute(
      'SELECT * FROM product_sizes WHERE id = ? AND product_id = ? LIMIT 1',
      [sizeId, productId]
    );
    if (!sizes[0]) return { ok: false, message: 'Size không hợp lệ' };
    unitPrice = Number(sizes[0].price || 0);
  } else {
    const [defaultSizes] = await db.execute(
      `SELECT *
       FROM product_sizes
       WHERE product_id = ?
       ORDER BY
         CASE
           WHEN UPPER(size_name) = 'M' THEN 0
           WHEN price = ? THEN 1
           ELSE 2
         END,
         id ASC
       LIMIT 1`,
      [productId, product.base_price]
    );

    if (defaultSizes[0]) {
      sizeId = defaultSizes[0].id;
      unitPrice = Number(defaultSizes[0].price || product.base_price || 0);
    }
  }

  unitPrice += await getToppingsTotal(toppings);

  const [existing] = await db.execute(
    `SELECT * FROM cart_items
     WHERE cart_id = ?
       AND product_id = ?
       AND COALESCE(size_id, 0) = COALESCE(?, 0)
       AND COALESCE(toppings, '') = ?
     LIMIT 1`,
    [cart.id, productId, sizeId, toppings]
  );

  if (existing[0]) {
    await db.execute(
      `UPDATE cart_items
       SET quantity = quantity + ?,
           sweetness = COALESCE(sweetness, ?),
           ice = COALESCE(ice, ?),
           note = COALESCE(note, ?)
       WHERE id = ?`,
      [itemQuantity, sweetness, ice, note, existing[0].id]
    );
  } else {
    await db.execute(
      `INSERT INTO cart_items
       (cart_id, product_id, size_id, quantity, unit_price, toppings, sweetness, ice, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cart.id, productId, sizeId, itemQuantity, unitPrice, toppings, sweetness, ice, note]
    );
  }

  return { ok: true };
}

function getOrCreateGuestCart(session) {
  if (!session.guestCart || !Array.isArray(session.guestCart)) {
    session.guestCart = [];
  }
  return session.guestCart;
}

function makeGuestLineId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function buildCartLine(productData, quantity) {
  const data = typeof productData === 'object'
    ? productData
    : { product_id: productData, quantity };

  const productId = data.product_id;
  let sizeId = data.size_id || null;
  const itemQuantity = normalizeQuantity(data.quantity || quantity);
  const toppings = normalizeToppings(data.toppings);
  const sweetness = data.sweetness || '50%';
  const ice = data.ice || '50%';
  const note = data.note || null;

  const [products] = await db.execute(
    'SELECT * FROM products WHERE id = ? AND status = ? LIMIT 1',
    [productId, 'available']
  );
  const product = products[0];
  if (!product) return { ok: false, message: 'Không tìm thấy sản phẩm' };

  let unitPrice = Number(product.base_price || 0);
  let sizeName = 'Tiêu chuẩn';

  if (sizeId) {
    const [sizes] = await db.execute(
      'SELECT * FROM product_sizes WHERE id = ? AND product_id = ? LIMIT 1',
      [sizeId, productId]
    );
    if (!sizes[0]) return { ok: false, message: 'Size không hợp lệ' };
    unitPrice = Number(sizes[0].price || 0);
    sizeName = sizes[0].size_name || sizes[0].name || sizeName;
  } else {
    const [defaultSizes] = await db.execute(
      `SELECT *
       FROM product_sizes
       WHERE product_id = ?
       ORDER BY
         CASE
           WHEN UPPER(size_name) = 'M' THEN 0
           WHEN price = ? THEN 1
           ELSE 2
         END,
         id ASC
       LIMIT 1`,
      [productId, product.base_price]
    );

    if (defaultSizes[0]) {
      sizeId = defaultSizes[0].id;
      unitPrice = Number(defaultSizes[0].price || product.base_price || 0);
      sizeName = defaultSizes[0].size_name || defaultSizes[0].name || sizeName;
    }
  }

  const toppingDetails = await getToppingDetails(toppings);
  unitPrice += toppingDetails.total;

  return {
    ok: true,
    item: {
      id: makeGuestLineId(),
      product_id: Number(productId),
      size_id: sizeId ? Number(sizeId) : null,
      quantity: itemQuantity,
      unit_price: unitPrice,
      toppings,
      sweetness,
      ice,
      note,
      name: product.name,
      base_price: product.base_price,
      image_url: product.image_url,
      size_name: sizeName,
      topping_names: toppingDetails.names
    }
  };
}

async function addGuestCartItem(session, productData, quantity) {
  const result = await buildCartLine(productData, quantity);
  if (!result.ok) return result;

  const cart = getOrCreateGuestCart(session);
  const newItem = result.item;
  const existing = cart.find(item =>
    Number(item.product_id) === Number(newItem.product_id)
    && Number(item.size_id || 0) === Number(newItem.size_id || 0)
    && String(item.toppings || '') === String(newItem.toppings || '')
  );

  if (existing) {
    existing.quantity = normalizeQuantity(existing.quantity) + normalizeQuantity(newItem.quantity);
    existing.sweetness = existing.sweetness || newItem.sweetness;
    existing.ice = existing.ice || newItem.ice;
    existing.note = existing.note || newItem.note;
  } else {
    cart.unshift(newItem);
  }

  session.guestCart = cart;
  return { ok: true };
}

async function updateGuestCartItem(session, cartItemId, quantity) {
  const cart = getOrCreateGuestCart(session);
  const item = cart.find(row => String(row.id) === String(cartItemId));
  if (!item) return { ok: false };
  item.quantity = normalizeQuantity(quantity);
  session.guestCart = cart;
  return { ok: true };
}

async function removeGuestCartItem(session, cartItemId) {
  const cart = getOrCreateGuestCart(session);
  session.guestCart = cart.filter(row => String(row.id) !== String(cartItemId));
  return { ok: true };
}

async function clearGuestCart(session) {
  session.guestCart = [];
  return { ok: true };
}

async function updateCartItem(userId, cartItemId, quantity) {
  const items = await getCartItems(userId);
  const item = items.find(x => Number(x.id) === Number(cartItemId));
  if (!item) return { ok: false };
  await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [Number(quantity || 1), cartItemId]);
  return { ok: true };
}

async function removeCartItem(userId, cartItemId) {
  const items = await getCartItems(userId);
  const item = items.find(x => Number(x.id) === Number(cartItemId));
  if (!item) return { ok: false };
  await db.execute('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
  return { ok: true };
}

async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
  return { ok: true };
}

async function countCartItems(userId) {
  const cart = await getOrCreateCart(userId);
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM cart_items WHERE cart_id = ?', [cart.id]);
  return rows[0]?.total || 0;
}

async function calculateCartSummary(userId, promotionCode) {
  const items = await getCartItems(userId);
  return calculateSummaryFromItems(items, promotionCode);
}

async function calculateGuestCartSummary(guestCart, promotionCode) {
  const items = Array.isArray(guestCart) ? guestCart : [];
  return calculateSummaryFromItems(items, promotionCode);
}

async function calculateSummaryFromItems(items, promotionCode) {
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || item.base_price || 0), 0);
  let promotion = null;
  let promotionMessage = null;
  let promotionError = null;
  let discountAmount = 0;

  if (promotionCode) {
    const result = await promotionService.validatePromotionCode(promotionCode, totalAmount);
    if (result.ok) {
      promotion = result.promotion;
      promotionMessage = result.message;
      discountAmount = result.discountAmount;
    } else {
      promotionError = result.message;
    }
  }

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return {
    items,
    totalQuantity,
    totalAmount,
    subtotal: totalAmount,
    discountAmount,
    finalAmount,
    promotion,
    promotionCode: promotion?.code || promotionCode || '',
    promotionMessage,
    promotionError
  };
}

module.exports = {
  getOrCreateCart,
  getCartByUser,
  getCartItems,
  addToCart,
  addGuestCartItem,
  updateCartItem,
  updateGuestCartItem,
  removeCartItem,
  removeGuestCartItem,
  clearCart,
  clearGuestCart,
  countCartItems,
  calculateCartSummary,
  calculateGuestCartSummary
};
