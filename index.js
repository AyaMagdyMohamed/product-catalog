require('dotenv').config();
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
app.use(express.json());

// Swagger docs
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Elasticsearch client
const es = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// Routes
const searchRoutes = require('./routes/search')(es);
app.use('/', searchRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Service is up and running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Search API running on port ${PORT}`));
