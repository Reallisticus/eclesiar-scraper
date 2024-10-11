// services/countryService.js
const pool = require('../config/db');

const API_URL = 'https://api.eclesiar.com/countries';
const API_TOKEN = process.env.API_TOKEN_ECLESIAR;

async function populateCountries() {
  // Fetch data from the API
  const fetch = (await import('node-fetch')).default;

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch country data. Status: ${response.status}`);
  }

  const { data } = await response.json();

  // Loop through the country data and insert each country into the database
  for (const country of data) {
    const query = `
      INSERT INTO countries (id, name, flag)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO NOTHING
    `;

    const values = [
      country.id,
      country.name,
      country.avatar, // Assuming the avatar is a flag or image URL
    ];

    await pool.query(query, values);
  }

  console.log('Countries have been successfully inserted into the database');
}

module.exports = {
  populateCountries,
};
