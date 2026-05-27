const db = require('../config/db');
const importReceiptModel = require('../models/importReceipt.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function getAllImportReceipts(...args) {
  return allRows(importReceiptModel);
}


async function getImportReceiptById(...args) {
  return rowById(importReceiptModel, args[0]);
}


async function getImportReceiptDetail(...args) {
  return rowById(importReceiptModel, args[0]);
}


async function createImportReceipt(...args) {
  return insertRow(importReceiptModel, args[0] || {});
}


async function updateImportReceipt(...args) {
  return updateRow(importReceiptModel, args[0], args[1] || {});
}


async function deleteImportReceiptSoft(...args) {
  return deleteRow(importReceiptModel, args[0]);
}


async function generateReceiptCode(...args) {
  return 'IMP' + Date.now();
}


module.exports = {
  getAllImportReceipts,
  getImportReceiptById,
  getImportReceiptDetail,
  createImportReceipt,
  updateImportReceipt,
  deleteImportReceiptSoft,
  generateReceiptCode
};
