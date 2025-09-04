#!/bin/sh

echo "Creating index with mapping..."
curl -s -X PUT "http://elasticsearch:9200/products" \
  -H 'Content-Type: application/json' \
  -d '{
    "mappings": {
      "properties": {
        "product_id": { "type": "keyword" },
        "variant_id": { "type": "keyword" },
        "name": { "type": "text" },
        "description": { "type": "text" },
        "category": { "type": "keyword" },
        "supplier": { "type": "keyword" },
        "attributes": {
          "properties": {
            "color": { "type": "keyword" },
            "size": { "type": "keyword" }
          }
        },
        "price": { "type": "float" },
        "sales": { "type": "integer" }
      }
    }
  }' > /dev/null

echo "Inserting sample products..."

curl -s -X POST "http://elasticsearch:9200/products/_doc/var1" \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "prod1",
    "variant_id": "var1",
    "name": "Classic T-Shirt Red S",
    "description": "100% cotton, unisex fit",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "Red", "size": "S" },
    "price": 20.00,
    "sales": 1500
  }' > /dev/null

curl -s -X POST "http://elasticsearch:9200/products/_doc/var2" \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "prod1",
    "variant_id": "var2",
    "name": "Classic T-Shirt Blue L",
    "description": "100% cotton, unisex fit",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "Blue", "size": "L" },
    "price": 22.00,
    "sales": 2500
  }' > /dev/null

echo "✅ Sample data loaded into Elasticsearch!"
