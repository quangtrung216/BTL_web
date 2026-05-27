const db = require('../config/db');
const cartService = require('./cart.service');
const promotionService = require('./promotion.service');

async function prepareCheckout(userId, options = {}) {
  if (options.tableOrder && !userId) {
    return cartService.calculateGuestCartSummary(options.guestCart, options.promotionCode);
  }
  return cartService.calculateCartSummary(userId, options.promotionCode);
}

async function validateCheckoutStock(userId) {
  const summary = await cartService.calculateCartSummary(userId);
  return { ok: true, items: summary.items };
}

async function createOrderFromCart(userId, checkoutData, options = {}) {
  const tableOrder = options.tableOrder || null;
  const summary = tableOrder && !userId
    ? await cartService.calculateGuestCartSummary(options.guestCart)
    : await cartService.calculateCartSummary(userId);
  if (!summary.items.length) return { ok: false, message: 'Giỏ hàng đang trống' };

  const orderTypeMap = {
    'dine-in': 'dine_in',
    dine_in: 'dine_in',
    takeaway: 'takeaway',
    delivery: 'delivery'
  };
  const paymentMethodMap = {
    COD: 'cash',
    CASH: 'cash',
    cash: 'cash',
    BANK_TRANSFER: 'bank_transfer',
    bank_transfer: 'bank_transfer',
    E_WALLET: 'e_wallet',
    e_wallet: 'e_wallet',
    MOMO: 'e_wallet',
    VNPAY: 'e_wallet'
  };

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const subtotal = Number(summary.totalAmount || 0);
    let promotionId = null;
    let discountAmount = 0;

    if (checkoutData.promotion_code) {
      const promotionResult = await promotionService.validatePromotionCode(checkoutData.promotion_code, subtotal);
      if (!promotionResult.ok) {
        await connection.rollback();
        return { ok: false, message: promotionResult.message };
      }
      promotionId = promotionResult.promotion.id;
      discountAmount = Number(promotionResult.discountAmount || 0);
    }

    const shippingFee = 0;
    const totalAmount = subtotal - discountAmount + shippingFee;
    const orderType = tableOrder ? 'dine_in' : (orderTypeMap[checkoutData.order_type] || 'delivery');
    const paymentMethod = paymentMethodMap[checkoutData.payment_method] || 'cash';

    const receiverAddress = checkoutData.shipping_address
      || [checkoutData.shipping_ward, checkoutData.shipping_province].filter(Boolean).join(' - ')
      || checkoutData.receiver_address
      || '';
    const tableLabel = tableOrder?.label || (tableOrder?.code ? `Bàn ${tableOrder.code}` : '');
    const finalReceiverAddress = tableLabel || receiverAddress;
    const finalNote = [tableLabel ? `Đơn tại bàn: ${tableLabel}` : '', checkoutData.note || '']
      .filter(Boolean)
      .join(' | ');

    const [result] = await connection.execute(
      `INSERT INTO orders
       (user_id, promotion_id, order_code, order_type, status, payment_method, subtotal, discount_amount, shipping_fee, total_amount, receiver_name, receiver_phone, receiver_address, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        promotionId,
        'ORD' + Date.now(),
        orderType,
        'pending',
        paymentMethod,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        checkoutData.receiver_name || (tableOrder ? 'Khách tại quán' : ''),
        checkoutData.receiver_phone || '',
        finalReceiverAddress,
        finalNote
      ]
    );

    for (const item of summary.items) {
      const toppingId = String(item.toppings || '')
        .split(',')
        .map(id => Number(id))
        .find(Boolean) || null;

      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, size_id, topping_id, quantity, unit_price, note)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          result.insertId,
          item.product_id,
          item.size_id || null,
          toppingId,
          item.quantity,
          item.unit_price || item.price || 0,
          item.note || ''
        ]
      );
    }

    if (promotionId) {
      await connection.execute(
        'UPDATE promotions SET usage_limit = GREATEST(usage_limit - 1, 0) WHERE id = ? AND usage_limit IS NOT NULL',
        [promotionId]
      );
    }

    if (userId) {
      const cart = await cartService.getOrCreateCart(userId);
      await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }
    await connection.commit();
    return { ok: true, orderId: result.insertId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function createDirectOrder(userId, items, checkoutData) {
  return { ok: false, message: 'Chưa hỗ trợ createDirectOrder ở bản sinh tự động' };
}

module.exports = { prepareCheckout, validateCheckoutStock, createOrderFromCart, createDirectOrder };
