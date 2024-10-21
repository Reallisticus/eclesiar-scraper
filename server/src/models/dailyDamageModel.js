// src/models/dailyDamageModel.js
const pool = require('../config/db');

class DailyDamageModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS daily_damage (
        id SERIAL PRIMARY KEY,
        day VARCHAR(255) NOT NULL,
        country_name VARCHAR(255) NOT NULL,
        damage BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  }

  static async insertDailyDamage(data) {
    const query = `
      INSERT INTO daily_damage (day, country_name, damage)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [data.day, data.country, data.damage];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  }

  static async getDailyDamageByDay(day) {
    const query = `
      SELECT country_name, damage
      FROM daily_damage
      WHERE day = $1
      ORDER BY damage DESC
    `;
    const values = [day];
    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = DailyDamageModel;
