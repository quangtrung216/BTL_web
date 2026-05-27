const db = require('../config/db');
const contactModel = require('../models/contact.model');
const { allRows, rowById, insertRow, updateRow, deleteRow, searchRows } = require('./_base.service');

async function createContact(...args) {
  return insertRow(contactModel, args[0] || {});
}


async function getAllContacts(...args) {
  return allRows(contactModel);
}


async function getContactById(...args) {
  return rowById(contactModel, args[0]);
}


async function markContactAsRead(...args) {
  return { ok: true };
}


async function deleteContact(...args) {
  return deleteRow(contactModel, args[0]);
}


module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  markContactAsRead,
  deleteContact
};
