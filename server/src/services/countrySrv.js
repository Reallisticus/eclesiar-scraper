// services/countryService.js
const pool = require('../config/db');
const CountryModel = require('../models/countryModel');
const API_URL = 'https://api.eclesiar.com/countries';
const API_TOKEN = process.env.API_TOKEN_ECLESIAR;

async function populateCountries() {
  // Ensure the table exists
  await CountryModel.createTable();

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
    const countryData = {
      id: country.id,
      name: country.name,
      flag: country.avatar, // Assuming 'avatar' is the flag URL or image
    };

    await CountryModel.insert(countryData);
  }

  console.log('Countries have been successfully inserted into the database');
}

module.exports = {
  populateCountries,
};
