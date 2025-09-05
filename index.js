require('dotenv').config();
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
    const { q, category, color, size, neck_style } = req.query;

    const body = {
      query: {
        bool: {
          must: [],
          filter: [],
        }
      },
      size: 20,
      sort: [
        { "sales": { "order": "desc" } },
        { "_score": { "order": "desc" } }
      ]
    };

    // 🔍 Full-text fuzzy search for q
    if (q) {
      body.query.bool.must.push({
        multi_match: {
          query: q,
          fields: ["name^3", "description", "supplier^2", "category"],
          fuzziness: "AUTO"
        }
      });
    }

    // 🎯 Strict filters
    if (category) {
      body.query.bool.filter.push({
        term: { "category.keyword": category }
      });
    }

    if (color) {
      body.query.bool.filter.push({
        term: { "attributes.color.keyword": color }
      });
    }

    if (size) {
      body.query.bool.filter.push({
        term: { "attributes.size.keyword": size }
      });
    }

    if (neck_style) {
      body.query.bool.filter.push({
        term: { "attributes.neck_style.keyword": neck_style }
      });
    }

    // Execute search
    const { hits } = await es.search({ index: 'products', body });

    // ✅ Handle no results
    if (hits.hits.length === 0) {
      return res.json({
        message: "No data exists with this search",
        results: []
      });
    }

    // ✅ Return matching results
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
