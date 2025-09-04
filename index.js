require('dotenv').config();
const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const app = express();
app.use(express.json());

// ✅ Define Elasticsearch client here
const es = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

/**
 * GET /search
 * Example: /search?q=shirt&category=T-Shirts&color=Red
 */
app.get('/search', async (req, res) => {
  try {
    const { q, category, ...filters } = req.query;

    const body = {
      query: {
        bool: { must: [], filter: [], should: [] }
      },
      size: 20,
      sort: [
        { "sales": { "order": "desc" } },
        { "_score": { "order": "desc" } }
      ]
    };

    // 🔍 Full-text search
    if (q) {
      body.query.bool.should.push({
        multi_match: {
          query: q,
          fields: ["name^3", "description"],
          fuzziness: "AUTO"
        }
      });

      // Wildcard fallback (handles tshirt vs t-shirt)
      body.query.bool.should.push({
        wildcard: {
          "name": {
            value: `*${q.toLowerCase()}*`,
            boost: 2.0
          }
        }
      });

      body.query.bool.minimum_should_match = 1;
    }

    // 📂 Category filter (case-insensitive)
    if (category) {
      body.query.bool.filter.push({
        match: { category: category }
      });
    }

    // 🎨 Attribute filters (case-insensitive)
    Object.keys(filters).forEach(attr => {
      body.query.bool.filter.push({
        match: { [`attributes.${attr}`]: filters[attr] }
      });
    });

    // ✅ Run query
    const { hits } = await es.search({ index: 'products', body });

    res.json(hits.hits.map(h => ({
      id: h._id,
      score: h._score,
      ...h._source
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});





app.get('/', (req, res) => {
    res.send('Service is up and running');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Search API running on port ${PORT}`));
