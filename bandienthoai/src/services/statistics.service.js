const db = require('../config/db');

async function getDashboardSummary() {
  const [[productRow]] = await Promise.all([
    db.execute('SELECT COUNT(*) AS total FROM products').then(x => x[0]),
  ]);
  const [userRows] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE LOWER(r.name) = 'customer'`
  );
  const [orderRows] = await db.execute(
    `SELECT
       COUNT(*) AS totalOrders,
       IFNULL(SUM(total_amount), 0) AS totalRevenue,
       SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS todayOrders,
       SUM(CASE WHEN DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS yesterdayOrders,
       IFNULL(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_amount ELSE 0 END), 0) AS todayRevenue,
       IFNULL(SUM(CASE WHEN DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN total_amount ELSE 0 END), 0) AS yesterdayRevenue
     FROM orders
     WHERE status = 'completed'`
  );
  const orderStats = orderRows[0] || {};
  return {
    totalProducts: productRow?.total || 0,
    totalUsers: userRows[0]?.total || 0,
    totalOrders: orderStats.totalOrders || 0,
    totalRevenue: orderStats.totalRevenue || 0,
    orderGrowthPercent: calculateGrowthPercent(orderStats.todayOrders, orderStats.yesterdayOrders),
    revenueGrowthPercent: calculateGrowthPercent(orderStats.todayRevenue, orderStats.yesterdayRevenue)
  };
}

function calculateGrowthPercent(currentValue, previousValue) {
  const current = Number(currentValue || 0);
  const previous = Number(previousValue || 0);

  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

async function getRevenueByDay() {
  const [rows] = await db.execute('SELECT DATE(created_at) AS label, SUM(total_amount) AS value FROM orders GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 30');
  return rows;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getRevenueForLastDays(days = 7) {
  const safeDays = Math.max(1, Math.min(31, Number.parseInt(days, 10) || 7));
  const [rows] = await db.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS label, SUM(total_amount) AS value
     FROM orders
     WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ${safeDays - 1} DAY)
       AND status = 'completed'
     GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
     ORDER BY label ASC`
  );

  const revenueByDate = new Map(rows.map(row => [row.label, Number(row.value || 0)]));
  const today = new Date();
  const result = [];

  for (let offset = safeDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = formatDateKey(date);
    result.push({
      label: key,
      displayLabel: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      value: revenueByDate.get(key) || 0
    });
  }

  return result;
}

async function getRevenueByMonth() {
  const [rows] = await db.execute('SELECT DATE_FORMAT(created_at, \'%Y-%m\') AS label, SUM(total_amount) AS value FROM orders GROUP BY DATE_FORMAT(created_at, \'%Y-%m\') ORDER BY label DESC LIMIT 12');
  return rows;
}

async function getRevenueByYear() {
  const [rows] = await db.execute('SELECT YEAR(created_at) AS label, SUM(total_amount) AS value FROM orders GROUP BY YEAR(created_at) ORDER BY label DESC');
  return rows;
}

async function getTopSellingProducts(limit = 10) {
  const safeLimit = Math.max(1, Number.parseInt(limit, 10) || 10);
  const [rows] = await db.execute(
    `SELECT
       p.id,
       p.name,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.quantity * oi.unit_price) AS total_revenue
     FROM order_items oi
     INNER JOIN orders o ON o.id = oi.order_id
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE o.status = 'completed'
     GROUP BY p.id, p.name
     ORDER BY total_sold DESC
     LIMIT ${safeLimit}`
  );
  return rows;
}

async function getRecentOrders(limit = 4) {
  const safeLimit = Math.max(1, Number.parseInt(limit, 10) || 4);
  const [rows] = await db.execute(
    `SELECT
       o.id,
       o.order_code,
       o.status,
       o.total_amount,
       o.receiver_name,
       o.created_at,
       u.full_name AS customer_name
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC, o.id DESC
     LIMIT ${safeLimit}`
  );
  return rows;
}

async function getLowStockProducts(limit = 10) {
  const safeLimit = Math.max(1, Number.parseInt(limit, 10) || 10);
  const [rows] = await db.execute(`SELECT * FROM products ORDER BY stock_quantity ASC, id DESC LIMIT ${safeLimit}`);
  return rows;
}

async function getOrderStatusStatistics() {
  const [rows] = await db.execute('SELECT status AS label, COUNT(*) AS value FROM orders GROUP BY status');
  return rows;
}

async function getPaymentStatusStatistics() {
  const [rows] = await db.execute('SELECT payment_method AS label, COUNT(*) AS value FROM orders GROUP BY payment_method');
  return rows;
}

async function getImportStatistics() {
  const [rows] = await db.execute('SELECT DATE(created_at) AS label, total_amount AS value FROM import_receipts ORDER BY created_at DESC LIMIT 30');
  return rows;
}

async function getCustomerStatistics() {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE LOWER(r.name) = 'customer'`
  );
  return rows[0] || { total: 0 };
}

module.exports = { getDashboardSummary, getRevenueByDay, getRevenueForLastDays, getRevenueByMonth, getRevenueByYear, getTopSellingProducts, getRecentOrders, getLowStockProducts, getOrderStatusStatistics, getPaymentStatusStatistics, getImportStatistics, getCustomerStatistics };
