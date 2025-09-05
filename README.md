# 📦 Product Catalog Microservice

This is a **Node.js + Elasticsearch** based microservice that provides a searchable product catalog. It supports product variants, attributes, categories, supplier info, and neck styles, with flexible full-text and filtered search.

---

## 🚀 Features

* Full-text search across **name, description, supplier, and category**
* Attribute-based filtering (e.g. `color=red&size=L&neck_style=V-Neck`)
* Category filtering (e.g. `category=T-Shirts`)
* Fuzzy matching (`q=shrt` → matches `"shirt"`)
* Sorting by **sales** (popularity) and relevance
* Dockerized environment with Elasticsearch + API + sample data loader

---

## 🛠️ Tech Stack

* **Node.js** (Express) – API service
* **Elasticsearch** – Search engine
* **Docker Compose** – Container orchestration

---

## ⚙️ Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/AyaMagdyMohamed/product-catalog
cd product-catalog
```

### 2. Build and run services

```bash
docker-compose up --build
```

> Note: It takes some time to start all services and run the script to load sample data. Make sure it finishes before using the API.

To use Swagger documentation go to [http://localhost:3000/docs](http://localhost:3000/docs)

This starts:

* **Elasticsearch** on `http://localhost:9200`
* **Kibana** on `http://localhost:5601`
* **API service** on `http://localhost:3000`

The script `load-sample-data.sh` automatically loads sample T-Shirt products (including V-Neck and Round-Neck) into Elasticsearch.

---

## 🔍 Search API

### Endpoint

```
GET /search
```

### Query Parameters

| Parameter    | Type   | Description                                                                                |
| ------------ | ------ | ------------------------------------------------------------------------------------------ |
| `q`          | string | Free-text search across name, description, supplier, and category. Supports fuzzy matches. |
| `category`   | string | Filter by product category (e.g. `T-Shirts`).                                              |
| `color`      | string | Filter by color attribute (dynamic).                                                       |
| `size`       | string | Filter by size attribute (dynamic).                                                        |
| `neck_style` | string | Filter by neck style (e.g. `V-Neck`, `Round-Neck`).                                        |

### Sorting

Results are sorted by:

1. `sales` (most popular first)
2. `_score` (text relevance)

---

### Example Queries

#### 1. Search by keyword only

```http
GET /search?q=nike
```

Finds all products supplied by "Nike Inc."

#### 2. Search by category and keyword

```http
GET /search?q=tshirt&category=T-Shirts
```

Finds T-shirts that match keyword "tshirt".

#### 3. Search with multiple filters

```http
GET /search?q=tshirt&category=T-Shirts&color=red&size=L&neck_style=V-Neck
```

Finds **Red V-Neck T-shirts in size L**.

#### 4. Search with attributes only

```http
GET /search?color=blue&size=S&neck_style=Round-Neck
```

Finds products with attributes `color=blue`, `size=S`, and neck style `Round-Neck`.

---

### Response Format

#### ✅ When results exist

```json
[
  {
    "id": "var4",
    "score": 1.5,
    "product_id": "prod4",
    "name": "V-Neck T-Shirt Black M",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "Black", "size": "M", "neck_style": "V-Neck" },
    "price": 23.0,
    "sales": 1200
  }
]
```

#### ❌ When no results

```json
{
  "message": "No data exists with this search",
  "results": []
}
```

---

## 📊 Kibana

Kibana is available at [http://localhost:5601](http://localhost:5601) for exploring data and building dashboards.
Index: `products`

---

## 🧪 Testing with `curl`

Check product count:

```bash
curl "http://localhost:9200/products/_count?pretty"
```

Search by supplier:

```bash
curl "http://localhost:3000/search?q=Nike"
```

Search by category + attributes:

```bash
curl "http://localhost:3000/search?q=tshirt&category=T-Shirts&color=red&size=L&neck_style=V-Neck"
```

---

## 📌 Notes

* Ensure Docker Desktop is running.
* Elasticsearch may take a few seconds to start before accepting requests.
* The loader script (`load-sample-data.sh`) ensures fresh sample data is available, including **V-Neck and Round-Neck T-shirts**.
