function success(data = null, message = 'OK') {
  return { success: true, message, data };
}

function failure(message = 'Failed', errors = null) {
  return { success: false, message, errors };
}

module.exports = { success, failure };
