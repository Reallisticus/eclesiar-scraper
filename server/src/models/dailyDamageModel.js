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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_day_country UNIQUE (day, country_name)
      )
    `;
    await pool.query(query);
  }

  static async insertDailyDamage(data) {
    const query = `
    INSERT INTO daily_damage (day, country_name, damage)
    VALUES ($1, $2, $3)
    ON CONFLICT (day, country_name) DO NOTHING
    RETURNING id
  `;
    // Use 'countryName' instead of 'country'
    const values = [data.day, data.countryName, data.damage];
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
  static async getLatestDayForCountry(country) {
    const query = `
      SELECT day 
      FROM daily_damage 
      WHERE LOWER(country_name) = LOWER($1)
      ORDER BY regexp_replace(day, '[^0-9]', '', 'g')::int DESC 
      LIMIT 1
    `;
    const values = [country];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async getDailyDamageByDayAndCountry(day, country) {
    const query = `
      SELECT * 
      FROM daily_damage 
      WHERE day = $1 AND LOWER(country_name) = LOWER($2)
    `;
    const values = [day, country];
    const result = await pool.query(query, values);
    return result.rows;
  }
  static async getNextDayForCountry(day, country) {
    const query = `
      SELECT * 
      FROM daily_damage 
      WHERE regexp_replace(day, '[^0-9]', '', 'g')::int = (
        SELECT MIN(regexp_replace(day, '[^0-9]', '', 'g')::int) 
        FROM daily_damage 
        WHERE regexp_replace(day, '[^0-9]', '', 'g')::int > regexp_replace($1, '[^0-9]', '', 'g')::int
        AND LOWER(country_name) = LOWER($2)
      )
      AND LOWER(country_name) = LOWER($2)
      LIMIT 1
    `;
    const values = [day, country];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
}

module.exports = DailyDamageModel;
