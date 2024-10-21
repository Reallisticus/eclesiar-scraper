// commands/dailyDamage.js
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'dailydamage',
    description: 'Display daily damage statistics',
    options: [
      {
        name: 'country',
        type: 3, // '3' represents string type
        description: 'The country you want to see damage for (optional)',
        required: false,
      },
      {
        name: 'day',
        type: 3, // '3' represents string type, can use a formatted date string
        description:
          'The specific day you want to see (optional, default is last day)',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const country = interaction.options.getString('country');
    const day = interaction.options.getString('day');

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

          // Wait for scraping to complete (you may need to implement this)
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Temporary 10-second wait

          // Fetch the updated data
          const updatedResponse = await axios.get(
            'http://localhost:3005/api/getDailyDamage',
            {
              params: { country, day },
            }
          );

          if (updatedResponse.data.success) {
            const embed = createDailyDamageEmbed(
              updatedResponse.data.data,
              country,
              day
            );
            await interaction.editReply({
              content: 'Daily damage statistics (updated data):',
              embeds: [embed],
            });
          } else {
            await interaction.editReply(
              'Failed to fetch updated data after scraping.'
            );
          }
        } else {
          const embed = createDailyDamageEmbed(
            response.data.data,
            country,
            day
          );
          await interaction.editReply({
            content: 'Daily damage statistics:',
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

function createDailyDamageEmbed(data, country, day) {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Daily Damage Statistics')
    .setTimestamp();

  if (day) {
    embed.setDescription(`Damage statistics for ${day}`);
  } else {
    embed.setDescription('Damage statistics for the last recorded day');
  }

  if (country) {
    const countryData = data.find(
      (item) => item.country_name.toLowerCase() === country.toLowerCase()
    );
    if (countryData) {
      embed.addFields({
        name: countryData.country_name,
        value: countryData.damage.toLocaleString(),
      });
    } else {
      embed.setDescription(`No data found for ${country}`);
    }
  } else {
    const top10 = data.slice(0, 10);
    top10.forEach((item, index) => {
      embed.addFields({
        name: `${index + 1}. ${item.country_name}`,
        value: item.damage.toLocaleString(),
      });
    });
  }

  return embed;
}
