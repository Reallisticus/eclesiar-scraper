const pool = require('../config/db');

async function saveBusinessData(data) {
  const query = `
    INSERT INTO business_data (business_name, quality, type, region_text, region_image, employees, url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  await pool.query(query, [
    data.businessName,
    data.quality,
    data.type,
    data.regionText,
    data.regionImage,
    JSON.stringify(data.employees),
    data.url,
  ]);
}

module.exports = {
  saveBusinessData,
};
