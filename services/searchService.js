async function searchProducts(esClient, filters) {
  const must = [];

  // full-text search (q)
  if (filters.q) {
    must.push({
      multi_match: {
        query: filters.q,
        fields: ["name^3", "description", "category"], // name weighted higher
        fuzziness: "AUTO"
      }
    });
  }

  // color (case-insensitive)
  if (filters.color) {
    must.push({
      match: {
        "attributes.color": {
          query: filters.color,
          operator: "and"
        }
      }
    });
  }

  // size (case-insensitive)
  if (filters.size) {
    must.push({
      match: {
        "attributes.size": {
          query: filters.size,
          operator: "and"
        }
      }
    });
  }

  // neck_style with synonym normalization
  if (filters.neck_style) {
    const normalizeNeckStyle = (value) => {
      const map = {
        rounded: "round-neck",
        "roundneck": "round-neck",
        "round-neck": "round-neck",
        vneck: "v-neck",
        "v-neck": "v-neck"
      };
      return map[value.toLowerCase()] || value.toLowerCase();
    };

    must.push({
      match: {
        "attributes.neck_style": {
          query: normalizeNeckStyle(filters.neck_style),
          operator: "and"
        }
      }
    });
  }

  let result;
  try {
    result = await esClient.search({
      index: "products",
      body: {
        query: {
          bool: { must }
        }
      }
    });
  } catch (err) {
    console.error("Elasticsearch query failed:", err);
    return { message: "Search error", results: [] };
  }

  const hits = result?.hits?.hits || [];

  if (hits.length === 0) {
    return { message: "No data exists with this search", results: [] };
  }

  return hits.map(hit => hit._source);
}


module.exports = { searchProducts };
