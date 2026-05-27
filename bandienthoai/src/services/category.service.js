const db = require('../config/db');
const categoryModel = require('../models/category.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function getAllCategories(...args) {
  return allRows(categoryModel);
}


async function getCategoryById(...args) {
  return rowById(categoryModel, args[0]);
}


async function createCategory(...args) {
  return insertRow(categoryModel, args[0] || {});
}


async function updateCategory(...args) {
  return updateRow(categoryModel, args[0], args[1] || {});
}


async function deleteCategory(...args) {
  return deleteRow(categoryModel, args[0]);
}


async function getCategoryOptions(...args) {
  const rows = await allRows(categoryModel);
  return rows.slice(0, Number(args[0] || rows.length));
}


module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryOptions
};
