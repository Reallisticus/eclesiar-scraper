const BattlePlayersModel = require('../models/battlePlayersModel');
const CountryModel = require('../models/countryModel');
async function saveBattlePlayers(players, battleId) {
  try {
    // Ensure the table exists
    await BattlePlayersModel.createTable();

    for (const player of players) {
      const countryId = await CountryModel.getCountryIdByFlag(
        player.countryFlag
      );

      const playerData = {
        battle_id: battleId, // FK to the battles table
        country_id: countryId, // Assuming country_id is not available; you might need to handle this
        player_name: player.playerName, // Corrected property name
        total_damage: player.totalDamage, // Corrected property name
        round_number: player.roundNumber || 1, // Provide a default value if not available
        is_hero: player.isHero, // Corrected property name
        side: player.side,
      };

      // Insert each player into the database
      await BattlePlayersModel.insertPlayer(playerData);
    }

    console.log('Battle players saved successfully.');
  } catch (error) {
    console.error('Error saving battle players:', error);
    throw error;
  }
}

module.exports = {
  saveBattlePlayers,
};
