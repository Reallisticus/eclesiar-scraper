const pool = require('../config/db');

class BusinessDataModel {
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS business_data (
        id SERIAL PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        quality VARCHAR(255),
        type VARCHAR(255),
        region_text VARCHAR(255),
        region_image VARCHAR(255),
        employees JSON,
        url VARCHAR(255)
      )
    `;

    try {
      await pool.query(createTableQuery);
      console.log('Business data table is ready.');
    } catch (error) {
      console.error('Error creating business data table:', error);
      throw error;
    }
  }

  static async insert(data) {
    const query = `
      INSERT INTO business_data (business_name, quality, type, region_text, region_image, employees, url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const values = [
      data.businessName,
      data.quality,
      data.type,
      data.regionText,
      data.regionImage,
      JSON.stringify(data.employees),
      data.url,
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error(
        `Error inserting business data for ${data.businessName}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = BusinessDataModel;
