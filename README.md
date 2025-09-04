# Catalog Search API

## Overview
A Node.js + Elasticsearch based search API for product catalogs.  
Implements free-text search, attribute filters, and ranking by sales.

## Requirements
- Docker & Docker Compose

## Setup
1. Clone repo
3. Build & run services:
   docker-compose up --build

it will run on port 3000 by default.

you can test the api using postman or curl.

curl -X GET "http://localhost:3000/search?q=tshirt"

