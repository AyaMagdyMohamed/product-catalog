# 📦 Product Catalog Microservice

This is a **Node.js + Elasticsearch** based microservice that provides a searchable product catalog. It supports product variants, attributes, categories, and supplier info, with flexible full-text and filtered search.

---

## 🚀 Features
- Full-text search across **name, description, supplier, and category**  
- Attribute-based filtering (e.g. `color=red&size=L`)  
- Category filtering (e.g. `category=T-Shirts`)  
- Fuzzy matching (`q=shrt` → matches `"shirt"`)  
- Sorting by **sales** (popularity) and relevance  
- Dockerized environment with Elasticsearch + API + sample data loader  

---

## 🛠️ Tech Stack
- **Node.js** (Express) – API service  
- **Elasticsearch** – Search engine  
- **Docker Compose** – Container orchestration  

---

## ⚙️ Setup & Run

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd product-catalog
```

### 2. Build and run services
```bash
docker-compose up --build
```

This starts:
- **Elasticsearch** on `http://localhost:9200`  
- **Kibana** on `http://localhost:5601`  
- **API service** on `http://localhost:3000`  

The script `load-sample-data.sh` automatically loads sample T-Shirt products into Elasticsearch.

---

## 🔍 Search API

### Endpoint
```
GET /search
```

### Query Parameters

| Parameter   | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| `q`         | string   | Free-text search across name, description, supplier, and category. Supports fuzzy matches. |
| `category`  | string   | Filter by product category (e.g. `T-Shirts`).                               |
| `color`     | string   | Filter by color attribute (dynamic).                                        |
| `size`      | string   | Filter by size attribute (dynamic).                                         |

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
GET /search?q=tshirt&category=T-Shirts&color=red&size=L
```
Finds **Red T-shirts in size L**.

#### 4. Search with attributes only
```http
GET /search?color=blue&size=S
```
Finds products with attributes `color=blue` and `size=S`.

---

### Response Format

#### ✅ When results exist
```json
[
  {
    "id": "var1",
    "score": 1.5,
    "product_id": "prod1",
    "name": "Classic T-Shirt Red S",
    "category": "T-Shirts",
    "supplier": "Nike Inc.",
    "attributes": { "color": "Red", "size": "S" },
    "price": 20.0,
    "sales": 1500
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
curl "http://localhost:3000/search?q=tshirt&category=T-Shirts&color=red&size=L"
```

---

## 📌 Notes
- Ensure Docker Desktop is running.  
- Elasticsearch may take a few seconds to start before accepting requests.  
- The loader script (`load-sample-data.sh`) ensures fresh sample data is available.  
