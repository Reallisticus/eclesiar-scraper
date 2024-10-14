const pool = require('../config/db');

class BattlePlayersModel {
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS battle_players (
        id SERIAL PRIMARY KEY,
        battle_id INT REFERENCES battles(id) ON DELETE CASCADE,  -- FK to battles table
        country_id INT REFERENCES countries(id) ON DELETE SET NULL,  -- FK to countries table
        player_name VARCHAR(255) NOT NULL,
        total_damage INT NOT NULL,
        round_number INT NOT NULL,
        is_hero BOOLEAN DEFAULT FALSE,
        side VARCHAR(50) NOT NULL
      )
    `;

    try {
      await pool.query(createTableQuery);
      console.log('Battle players table is ready.');
    } catch (error) {
      console.error('Error creating battle_players table:', error);
      throw error;
    }
  }

  static async insertPlayer(data) {
    const insertQuery = `
      INSERT INTO battle_players (battle_id, country_id, player_name, total_damage, round_number, is_hero, side)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;

    const values = [
      data.battle_id,
      data.country_id, // FK to countries table
      data.player_name,
      data.total_damage,
      data.round_number,
      data.is_hero, // Boolean (true if hero, false otherwise)
      data.side, // e.g., 'North Macedonia' or 'Serbia'
    ];

    try {
      const result = await pool.query(insertQuery, values);
      return result.rows[0].id; // Return the inserted player's ID
    } catch (error) {
      console.error('Error inserting battle player:', error);
      throw error;
    }
  }
}

module.exports = BattlePlayersModel;
