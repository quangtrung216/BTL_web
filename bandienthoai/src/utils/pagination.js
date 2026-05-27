function buildPagination(page = 1, pageSize = 10) {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const limit = Math.max(parseInt(pageSize, 10) || 10, 1);
  const offset = (currentPage - 1) * limit;
  return { currentPage, limit, offset };
}

module.exports = { buildPagination };
