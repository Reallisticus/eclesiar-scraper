const pool = require('../config/db');

class BattleModel {
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS battles (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        url VARCHAR(255),
			  attacker VARCHAR(255), 
        defender VARCHAR(255),
				winner VARCHAR(255)
      )
    `;

    try {
      await pool.query(createTableQuery);
      console.log('Battles table is ready.');
    } catch (error) {
      console.error('Error creating battles table:', error);
      throw error;
    }
  }

  static async insertBattle({
    round_id,
    status,
    url,
    attacker,
    defender,
    winner,
  }) {
    const insertQuery = `
      INSERT INTO battles (round_id, status, url, attacker, defender, winner)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const values = [round_id, status, url, attacker, defender, winner];

    try {
      const result = await pool.query(insertQuery, values);
      return result.rows[0].id; // Return the inserted battle ID
    } catch (error) {
      console.error('Error inserting battle:', error);
      throw error;
    }
  }

  static async getBattleByUrl(url) {
    const query = 'SELECT * FROM battles WHERE url = $1 LIMIT 1';
    const values = [url];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Returns undefined if no battle found
    } catch (error) {
      console.error('Error fetching battle by URL:', error);
      throw error;
    }
  }
}

module.exports = BattleModel;
