const db = require('../config/db');

async function ensureReviewTable() {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS product_reviews (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id BIGINT UNSIGNED NOT NULL,
      order_item_id INT UNSIGNED NOT NULL,
      user_id INT UNSIGNED NOT NULL,
      product_id INT UNSIGNED NOT NULL,
      rating TINYINT UNSIGNED NOT NULL,
      comment VARCHAR(500) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_order_item_review (order_item_id),
      KEY product_reviews_order_id_index (order_id),
      KEY product_reviews_product_id_index (product_id)
    )`
  );
}

async function getReviewsByOrder(userId, orderId) {
  await ensureReviewTable();
  const [rows] = await db.execute(
    `SELECT *
     FROM product_reviews
     WHERE user_id = ? AND order_id = ?`,
    [userId, orderId]
  );
  return rows;
}
async function getReviewsByProduct(productId) {
  await ensureReviewTable();
  const [rows] = await db.execute(
    `SELECT
       pr.*,
       u.full_name AS reviewer_name
     FROM product_reviews pr
     LEFT JOIN users u ON u.id = pr.user_id
     WHERE pr.product_id = ?
     ORDER BY pr.updated_at DESC, pr.id DESC`,
    [productId]
  );

  const count = rows.length;
  const averageRating = count
    ? rows.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count
    : 0;

  return {
    rows,
    count,
    averageRating
  };
}

async function saveOrderItemReview(userId, orderId, data) {
  await ensureReviewTable();

  const rating = Math.max(1, Math.min(5, Number(data.rating || 5)));
  const comment = String(data.comment || '').trim().slice(0, 500) || null;

  const [items] = await db.execute(
    `SELECT oi.*
     FROM order_items oi
     INNER JOIN orders o ON o.id = oi.order_id
     WHERE oi.id = ?
       AND oi.order_id = ?
       AND oi.product_id = ?
       AND o.user_id = ?
       AND o.status = 'completed'
     LIMIT 1`,
    [data.order_item_id, orderId, data.product_id, userId]
  );

  const item = items[0];
  if (!item) {
    return { ok: false, message: 'Chỉ có thể đánh giá món trong đơn hàng đã hoàn tất.' };
  }

  await db.execute(
    `INSERT INTO product_reviews
     (order_id, order_item_id, user_id, product_id, rating, comment)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       rating = VALUES(rating),
       comment = VALUES(comment),
       updated_at = CURRENT_TIMESTAMP`,
    [orderId, item.id, userId, item.product_id, rating, comment]
  );

  return { ok: true };
}

module.exports = {
  getReviewsByOrder,
  getReviewsByProduct,
  saveOrderItemReview
};
