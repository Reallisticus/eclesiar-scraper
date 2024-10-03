const pool = require('../config/db');

async function saveRegionData(data) {
  const query = `
    INSERT INTO region_data (region_name, country_name, resource_type, pollution, url)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await pool.query(query, [
    data.regionName || null,
    data.countryName || null,
    data.resourceType || null,
    data.pollution || null,
    data.url || null,
  ]);
}

module.exports = {
  saveRegionData,
};
