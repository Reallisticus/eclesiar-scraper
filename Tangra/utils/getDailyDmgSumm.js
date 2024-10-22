const db = require('./db');

async function getDailyDamageSummary(day = null, country = null) {
  let currentDayQuery = `
    SELECT country_name, damage, regexp_replace(day, '[^0-9]', '', 'g')::int AS day_number
    FROM daily_damage
    WHERE day = COALESCE($1, (SELECT MAX(day) FROM daily_damage))
  `;
  const currentDayValues = [day];

  if (country) {
    currentDayQuery += ' AND country_name = $2';
    currentDayValues.push(country);
  }

  currentDayQuery += ' ORDER BY damage DESC';

  let previousDayQuery = `
    SELECT country_name, damage, regexp_replace(day, '[^0-9]', '', 'g')::int AS day_number
    FROM daily_damage
    WHERE regexp_replace(day, '[^0-9]', '', 'g')::int = (
      SELECT MAX(regexp_replace(day, '[^0-9]', '', 'g')::int) 
      FROM daily_damage WHERE regexp_replace(day, '[^0-9]', '', 'g')::int < COALESCE($1, (SELECT MAX(regexp_replace(day, '[^0-9]', '', 'g')::int) FROM daily_damage))
    )
  `;
  const previousDayValues = [day];

  if (country) {
    previousDayQuery += ' AND country_name = $2';
    previousDayValues.push(country);
  }

  // Execute both queries
  const currentDayResult = await db.query(currentDayQuery, currentDayValues);
  const previousDayResult = await db.query(previousDayQuery, previousDayValues);

  // Create a map for quick lookup of previous day damage by country
  const previousDayMap = new Map();
  previousDayResult.rows.forEach((row) => {
    previousDayMap.set(row.country_name, row.damage);
  });

  // Calculate daily damage and prepare the result
  const summary = currentDayResult.rows.map((currentDayRow) => {
    const previousDayDamage =
      previousDayMap.get(currentDayRow.country_name) || 0;
    const dailyDamage = currentDayRow.damage - previousDayDamage;

    return {
      country_name: currentDayRow.country_name,
      total_damage: currentDayRow.damage,
      daily_damage: dailyDamage,
      day_number: currentDayRow.day_number, // Ensure we pass the current day number
    };
  });

  return summary;
}

module.exports = getDailyDamageSummary;
