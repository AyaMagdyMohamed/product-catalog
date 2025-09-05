// routes/search.js
const express = require('express');
const { handleSearch } = require('../controllers/searchController');

module.exports = (es) => {
  const router = express.Router();

  router.get('/search', (req, res) => handleSearch(req, res, es));

  return router;
};
