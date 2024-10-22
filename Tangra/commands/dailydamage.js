// commands/dailyDamage.js
const axios = require('axios');
const createDailyDamageEmbed =
  require('../utils/createEmbed').createDailyDamageEmbed;
const waitForDailyDamageScrapingToComplete =
  require('../utils/dbOps').waitForDailyDamageScrapingToComplete;
const getDailyDamageSummary = require('../utils/getDailyDmgSumm');

module.exports = {
  data: {
    name: 'dailydamage',
    description: 'Display daily damage statistics',
  },
  async execute(interaction) {
    const country = interaction.options.getString('country');
    const day = interaction.options.getString('day') || null;
    console.log(day);
    await interaction.deferReply({ ephemeral: false });
    try {
      // Send the request to the Node.js backend
      const response = await axios.post(
        'http://localhost:3005/api/fetchDailyDamage',
        {
          country,
          day,
        }
      );

      if (response.data.success) {
        if (response.data.needsScraping) {
          await interaction.editReply(
            'Fetching latest data. This may take a moment...'
          );

          await waitForDailyDamageScrapingToComplete(
            day,
            country,
            120000,
            5000
          );

          // Fetch the updated data
          const dailyDamageSummary = await getDailyDamageSummary(day, country);
          const embed = createDailyDamageEmbed(
            dailyDamageSummary,
            country,
            day
          );

          await interaction.editReply({
            content: 'Daily damage statistics (updated data):',
            embeds: [embed],
          });
        } else {
          console.log(
            `Daily damage data already exists for ${
              day || 'latest available day'
            }. Fetching from database...`
          );

          // Fetch the cached data from the database
          const dailyDamageSummary = await getDailyDamageSummary(day, country);

          // Send the daily damage summary as an embed
          const embed = createDailyDamageEmbed(
            dailyDamageSummary,
            country,
            day
          );

          await interaction.editReply({
            content: 'Daily damage statistics (from cached data):',
            embeds: [embed],
          });
        }
      } else {
        await interaction.editReply(
          `Failed to fetch data: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error('Error fetching daily damage data:', error);
      await interaction.editReply(
        'An error occurred while fetching daily damage data.'
      );
    }
  },
};
