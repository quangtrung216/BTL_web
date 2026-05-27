const db = require('../config/db');
const invoiceModel = require('../models/invoice.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function createInvoice(...args) {
  return insertRow(invoiceModel, args[0] || {});
}


async function getAllInvoices(...args) {
  return allRows(invoiceModel);
}


async function getInvoiceById(...args) {
  return rowById(invoiceModel, args[0]);
}


async function getInvoiceByOrderId(...args) {
  const [rows] = await db.execute('SELECT * FROM invoices WHERE order_id = ? LIMIT 1', [args[0]]);
  return rows[0] || null;
}


async function buildInvoiceData(...args) {
  return rowById(invoiceModel, args[0]);
}


async function generateInvoiceCode(...args) {
  return 'INV' + Date.now();
}


async function deleteInvoiceSoft(...args) {
  return deleteRow(invoiceModel, args[0]);
}


module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoiceByOrderId,
  buildInvoiceData,
  generateInvoiceCode,
  deleteInvoiceSoft
};
