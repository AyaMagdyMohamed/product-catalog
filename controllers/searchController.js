// controllers/searchController.js
const { searchProducts } = require('../services/searchService');

async function handleSearch(req, res, es) {
  try {
    const results = await searchProducts(es, req.query);

    if (results.message) {
      return res.json(results);
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
}

module.exports = { handleSearch };
