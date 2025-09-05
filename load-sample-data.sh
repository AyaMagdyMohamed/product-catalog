#!/bin/sh

echo "Deleting old index if exists..."
curl -s -X DELETE "http://elasticsearch:9200/products" > /dev/null

echo "Creating products index with proper mapping..."
curl -s -X PUT "http://elasticsearch:9200/products" \
  -H 'Content-Type: application/json' \
  -d '{
    "settings": {
      "analysis": {
        "normalizer": {
          "lowercase_normalizer": {
            "type": "custom",
            "char_filter": [],
            "filter": ["lowercase"]
          }
        }
      }
    },
    "mappings": {
      "properties": {
        "product_id": { "type": "keyword" },
        "variant_id": { "type": "keyword" },
        "name": {
          "type": "text",
          "fields": { "keyword": { "type": "keyword" } }
        },
        "description": { "type": "text" },
        "category": {
          "type": "text",
          "fields": { "keyword": { "type": "keyword" } }
        },
        "supplier": {
          "type": "text",
          "fields": { "keyword": { "type": "keyword" } }
        },
        "attributes": {
          "properties": {
            "color": {
              "type": "text",
              "fields": { "keyword": { "type": "keyword" } }
            },
            "size": {
              "type": "text",
              "fields": { "keyword": { "type": "keyword" } }
            },
            "neck_style": {
              "type": "keyword",
              "normalizer": "lowercase_normalizer"
            }
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

curl -s -X POST "http://elasticsearch:9200/products/_doc/var3" \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "prod1",
    "variant_id": "var3",
    "name": "Classic T-Shirt Red L",
    "description": "100% cotton, unisex fit",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "Red", "size": "L" },
    "price": 21.00,
    "sales": 1800
  }' > /dev/null

curl -s -X POST "http://elasticsearch:9200/products/_doc/var4" \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "prod2",
    "variant_id": "var1",
    "name": "V-Neck T-Shirt Black M",
    "description": "Soft cotton, slim fit V-neck style",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "Black", "size": "M", "neck_style": "V-Neck" },
    "price": 23.00,
    "sales": 1200
  }' > /dev/null

curl -s -X POST "http://elasticsearch:9200/products/_doc/var5" \
  -H 'Content-Type: application/json' \
  -d '{
    "product_id": "prod2",
    "variant_id": "var5",
    "name": "Round-Neck T-Shirt White XL",
    "description": "Classic white round-neck tee",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "White", "size": "XL", "neck_style": "Round-Neck" },
    "price": 19.00,
    "sales": 1400
  }' > /dev/null

echo "Sample data loaded into Elasticsearch!"
