// utils/getBattleSumm.js
const db = require('./db');
const countryFlagMap = require('./countryFlags');

async function getBattleSummary(battleId) {
  try {
    // Get the internal battle ID
    const urlPattern = `%/war/${battleId}%`;
    const battleResult = await db.query(
      'SELECT id, attacker, defender, winner, url FROM battles WHERE url LIKE $1',
      [urlPattern]
    );

    if (battleResult.rows.length === 0) {
      throw new Error('Battle not found in database.');
    }

    const internalBattleId = battleResult.rows[0].id;
    const attackerName = battleResult.rows[0].attacker; // Get the attacker
    const defenderName = battleResult.rows[0].defender; // Get the defender
    const winner = battleResult.rows[0].winner; // Get the winner
    const url = battleResult.rows[0].url; // Get the battle URL

    // Query the battle_players table using the internal battle ID
    const query = `
      SELECT
        c.name AS country_name,
        bp.side,
        SUM(bp.total_damage) AS total_damage
      FROM
        battle_players bp
      LEFT JOIN
        countries c ON bp.country_id = c.id
      WHERE
        bp.battle_id = $1
      GROUP BY
        c.name, bp.side
      ORDER BY
        total_damage DESC;
    `;

    const values = [internalBattleId];

    const result = await db.query(query, values);

    // Process the result to separate attackers and defenders
    const attackerSummary = [];
    const defenderSummary = [];

    let totalAttackerDamage = 0;
    let totalDefenderDamage = 0;

    result.rows.forEach((row) => {
      const countryName = row.country_name || 'Unknown';
      const flag = countryFlagMap[countryName] || ''; // Get the corresponding flag emoji
      const totalDamage = parseInt(row.total_damage);

      const line = `${flag} ${countryName}: ${parseInt(
        row.total_damage
      ).toLocaleString()}`;

      if (row.side === 'attacker') {
        attackerSummary.push(line);
        totalAttackerDamage += totalDamage; // Accumulate attacker damage
      } else if (row.side === 'defender') {
        defenderSummary.push(line);
        totalDefenderDamage += totalDamage; // Accumulate defender damage
      }
    });

    return {
      attackerSummary: attackerSummary.join('\n') || 'No data',
      defenderSummary: defenderSummary.join('\n') || 'No data',
      totalAttackerDamage: totalAttackerDamage.toLocaleString(),
      totalDefenderDamage: totalDefenderDamage.toLocaleString(),
      attackerName, // Now coming from the battles table
      defenderName, // Now coming from the battles table
      winner, // Now coming from the battles table
      url, // Now coming from the battles table
    };
  } catch (error) {
    console.error('Error fetching battle summary:', error);
    throw error;
  }
}

module.exports = getBattleSummary;
