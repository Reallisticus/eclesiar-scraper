const pool = require('../config/db');

class RegionModel {
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS region_data (
        id SERIAL PRIMARY KEY,
        region_name VARCHAR(255),
        country_name VARCHAR(255),
        resource_type VARCHAR(255),
        pollution VARCHAR(255),
        url VARCHAR(255)
      )
    `;

    try {
      await pool.query(createTableQuery);
      console.log('Region data table is ready.');
    } catch (error) {
      console.error('Error creating region_data table:', error);
      throw error;
    }
  }

  static async insert(regionData) {
    const query = `
      INSERT INTO region_data (region_name, country_name, resource_type, pollution, url)
      VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [
      regionData.regionName || null,
      regionData.countryName || null,
      regionData.resourceType || null,
      regionData.pollution || null,
      regionData.url || null,
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error(
        `Error inserting region data for ${regionData.regionName}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = RegionModel;
