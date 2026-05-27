function generateCode(prefix = 'CODE') {
  return `${prefix}${Date.now()}`;
}

module.exports = { generateCode };
