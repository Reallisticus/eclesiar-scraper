const pool = require('../config/db');
const BattleModel = require('../models/battleModel');
const BattlePlayersModel = require('../models/battlePlayersModel');
const axios = require('axios');

async function saveOngoingBattleData(data) {
  try {
    const response = await axios.post(
      'https://api.eclesiar.com/war/getstatistics',
      new URLSearchParams({ round_id: data.round_id }).toString(), // POST body
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          authorization: 'Bearer b8342dc44527sa361d5543g373sg91ca2632463', // Bearer token, replace if needed
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'sec-ch-ua':
            '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          Referer: 'https://eclesiar.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error fetching battle data:', error);
    throw new Error('Failed to fetch battle data');
  }
}

module.exports = {
  saveOngoingBattleData,
};
