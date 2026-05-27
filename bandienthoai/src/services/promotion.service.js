const db = require('../config/db');
const promotionModel = require('../models/promotion.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function getAllPromotions(...args) {
  return allRows(promotionModel);
}


async function getActivePromotions(...args) {
  const rows = await allRows(promotionModel);
  return rows.slice(0, Number(args[0] || rows.length));
}


async function getPromotionById(...args) {
  return rowById(promotionModel, args[0]);
}

function normalizePromotionCode(code) {
  return String(code || '').trim().toUpperCase();
}

function calculateDiscountAmount(promotion, subtotal) {
  const orderSubtotal = Number(subtotal || 0);
  const discountValue = Number(promotion?.discount_value || promotion?.discount_percent || 0);
  const discountType = String(promotion?.discount_type || '').toLowerCase();

  if (!orderSubtotal || !discountValue) return 0;
  if (discountType === 'percent' || discountType === 'percentage') {
    return Math.min(orderSubtotal, Math.round(orderSubtotal * discountValue / 100));
  }
  if (discountType === 'fixed') {
    return Math.min(orderSubtotal, discountValue);
  }
  return 0;
}

async function getPromotionByCode(...args) {
  const code = normalizePromotionCode(args[0]);
  if (!code) return null;

  const [rows] = await db.execute(
    'SELECT * FROM promotions WHERE UPPER(code) = ? LIMIT 1',
    [code]
  );
  return rows[0] || null;
}

async function validatePromotionCode(...args) {
  const code = normalizePromotionCode(args[0]);
  const subtotal = Number(args[1] || 0);

  if (!code) return { ok: false, message: 'Vui lòng nhập mã giảm giá.' };

  const promotion = await getPromotionByCode(code);
  if (!promotion) return { ok: false, message: 'Mã giảm giá không tồn tại.' };

  if (Number(promotion.is_active) !== 1) {
    return { ok: false, message: 'Mã giảm giá hiện không hoạt động.' };
  }

  const now = new Date();
  if (promotion.start_date && new Date(promotion.start_date) > now) {
    return { ok: false, message: 'Mã giảm giá chưa đến thời gian sử dụng.' };
  }
  if (promotion.end_date && new Date(promotion.end_date) < now) {
    return { ok: false, message: 'Mã giảm giá đã hết hạn.' };
  }

  const minOrderValue = Number(promotion.min_order_value || 0);
  if (subtotal < minOrderValue) {
    return {
      ok: false,
      message: `Đơn hàng cần tối thiểu ${minOrderValue.toLocaleString('vi-VN')}đ để dùng mã này.`
    };
  }

  if (promotion.usage_limit !== null && promotion.usage_limit !== undefined && Number(promotion.usage_limit) <= 0) {
    return { ok: false, message: 'Mã giảm giá đã hết lượt sử dụng.' };
  }

  const discountAmount = calculateDiscountAmount(promotion, subtotal);
  if (discountAmount <= 0) {
    return { ok: false, message: 'Mã giảm giá không hợp lệ cho đơn hàng này.' };
  }

  return {
    ok: true,
    promotion,
    code: promotion.code || code,
    discountAmount,
    message: `Đã áp dụng mã ${promotion.code || code}.`
  };
}


async function createPromotion(...args) {
  return insertRow(promotionModel, args[0] || {});
}


async function updatePromotion(...args) {
  return updateRow(promotionModel, args[0], args[1] || {});
}


async function deletePromotion(...args) {
  return deleteRow(promotionModel, args[0]);
}


async function assignProductsToPromotion(...args) {
  return { ok: true };
}


async function removeProductFromPromotion(...args) {
  return { ok: true };
}


async function getPromotionProducts(...args) {
  const rows = await allRows(promotionModel);
  return rows.slice(0, Number(args[0] || rows.length));
}


module.exports = {
  getAllPromotions,
  getActivePromotions,
  getPromotionById,
  getPromotionByCode,
  validatePromotionCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
  assignProductsToPromotion,
  removeProductFromPromotion,
  getPromotionProducts
};
