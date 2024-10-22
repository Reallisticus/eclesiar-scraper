const axios = require('axios');
const { waitForScrapingToComplete } = require('../utils/dbOps');
const getBattleSummary = require('../utils/getBattleSumm');
const createBattleSummaryEmbed =
  require('../utils/createEmbed').createBattleSummaryEmbed;

module.exports = {
  data: {
    name: 'scrapebattle',
    description: 'Scrape and display battle information',
  },
  async execute(interaction) {
    const battleId = interaction.options.getString('battle_id');

    // Validate the battle ID
    if (!battleId || isNaN(battleId)) {
      await interaction.reply({
        content: 'Please provide a valid battle ID.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: false });

    try {
      // Send the battle ID to the Node.js backend via HTTP POST
      const response = await axios.post(
        'http://localhost:3005/api/scrapeBattle',
        {
          battleId: battleId,
        }
      );

      // Check the response from the middleware
      if (response.data.success) {
        if (response.data.needsScraping) {
          console.log(
            `Scraping initiated for battle ID: ${battleId}. Waiting for completion...`
          );

          await waitForScrapingToComplete(battleId, 120000, 5000);

          // Retrieve the updated battle summary from the database
          const battleSummary = await getBattleSummary(battleId);

          // Send the battle summary as an embed
          const embed = createBattleSummaryEmbed(battleId, battleSummary);

          await interaction.editReply({
            content: 'Battle summary (updated data):',
            embeds: [embed],
          });
        } else {
          console.log(
            `Battle data already exists for battle ID: ${battleId}. Fetching from database...`
          );

          const battleSummary = await getBattleSummary(battleId);

          // Send the battle summary as an embed
          const embed = createBattleSummaryEmbed(battleId, battleSummary);

          await interaction.editReply({
            content: 'Battle summary (from cached data):',
            embeds: [embed],
          });
        }
      } else {
        await interaction.editReply({
          content: `Failed to initiate scraping: ${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Error sending request to middleware:', error);
      await interaction.editReply({
        content: 'An error occurred while initiating scraping.',
      });
    }
  },
};
