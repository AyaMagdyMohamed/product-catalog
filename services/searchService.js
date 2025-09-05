// services/searchService.js

/**
 * Executes a product search query in Elasticsearch.
 * @param {Object} es - Elasticsearch client
 * @param {Object} query - Request query params
 * @returns {Array|Object} - Search results
 */
async function searchProducts(es, query) {
  const { q, category, ...filters } = query;

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

  // Full-text search
  if (q) {
    body.query.bool.should.push({
      multi_match: {
        query: q,
        fields: ["name^3", "description", "supplier^2", "category", "attributes.*"],
        fuzziness: "AUTO"
      }
    });

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

  // Category filter
  if (category) {
    body.query.bool.filter.push({
      match: { category }
    });
  }

  // Attributes filters
  Object.keys(filters).forEach(attr => {
    if (attr === "neck_style") {
      // ✅ exact match for neck_style
      body.query.bool.filter.push({
        term: { "attributes.neck_style": filters[attr].toLowerCase() }
      });
    } else {
      // ✅ fuzzy matching for other attributes
      body.query.bool.filter.push({
        match: { [`attributes.${attr}`]: filters[attr] }
      });
    }
  });

  // Run query
  const { hits } = await es.search({ index: "products", body });

  if (hits.hits.length === 0) {
    return {
      message: "No data exists with this search",
      results: []
    };
  }

  return hits.hits.map(h => ({
    id: h._id,
    score: h._score,
    ...h._source
  }));
}

module.exports = { searchProducts };
