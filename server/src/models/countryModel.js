const pool = require('../config/db');

class CountryModel {
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        flag VARCHAR(255)
      )
    `;

    try {
      await pool.query(createTableQuery);
      console.log('Countries table is ready.');
    } catch (error) {
      console.error('Error creating countries table:', error);
      throw error;
    }
  }

  static async insert(country) {
    const query = `
      INSERT INTO countries (id, name, flag)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO NOTHING
    `;

    const values = [country.id, country.name, country.flag];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error(`Error inserting country ${country.name}:`, error);
      throw error;
    }
  }

  static async getCountryIdByFlag(flagUrl) {
    const query = `
      SELECT id FROM countries WHERE flag = $1 LIMIT 1;
    `;
    const values = [flagUrl];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length > 0) {
        return result.rows[0].id;
      } else {
        // Handle case where country is not found
        console.warn(`Country not found for flag URL: ${flagUrl}`);
        return null; // Or handle as appropriate
      }
    } catch (error) {
      console.error('Error fetching country ID by flag:', error);
      throw error;
    }
  }
}

module.exports = CountryModel;
