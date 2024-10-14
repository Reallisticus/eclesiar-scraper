const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'randomdb',
  password: process.env.DB_PASSWORD || 'randompw',
  port: process.env.DB_PORT || 5432,
});

module.exports = db;