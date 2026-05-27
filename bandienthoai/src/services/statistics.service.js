const db = require('../config/db');

async function getDashboardSummary() {
  const [[productRow]] = await Promise.all([
    db.execute('SELECT COUNT(*) AS total FROM products').then(x => x[0]),
  ]);
  const [userRows] = await db.execute('SELECT COUNT(*) AS total FROM users');
  const [orderRows] = await db.execute('SELECT COUNT(*) AS total FROM orders');
  const [revenueRows] = await db.execute('SELECT IFNULL(SUM(total_amount), 0) AS total FROM orders');
  return {
    totalProducts: productRow?.total || 0,
    totalUsers: userRows[0]?.total || 0,
    totalOrders: orderRows[0]?.total || 0,
    totalRevenue: revenueRows[0]?.total || 0
  };
}

async function getRevenueByDay() {
  const [rows] = await db.execute('SELECT DATE(created_at) AS label, SUM(total_amount) AS value FROM orders GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 30');
  return rows;
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
    `SELECT p.id, p.name, SUM(oi.quantity) AS total_sold
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     GROUP BY p.id, p.name
     ORDER BY total_sold DESC
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
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM users');
  return rows[0] || { total: 0 };
}

module.exports = { getDashboardSummary, getRevenueByDay, getRevenueByMonth, getRevenueByYear, getTopSellingProducts, getLowStockProducts, getOrderStatusStatistics, getPaymentStatusStatistics, getImportStatistics, getCustomerStatistics };
