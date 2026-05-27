const db = require('../config/db');
const brandModel = require('../models/brand.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function getAllBrands(...args) {
  return allRows(brandModel);
}


async function getBrandById(...args) {
  return rowById(brandModel, args[0]);
}


async function createBrand(...args) {
  return insertRow(brandModel, args[0] || {});
}


async function updateBrand(...args) {
  return updateRow(brandModel, args[0], args[1] || {});
}


async function deleteBrand(...args) {
  return deleteRow(brandModel, args[0]);
}


async function getBrandOptions(...args) {
  const rows = await allRows(brandModel);
  return rows.slice(0, Number(args[0] || rows.length));
}


module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandOptions
};
