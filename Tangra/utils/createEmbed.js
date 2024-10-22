const countryFlagMap = require('./countryFlags');
const { EmbedBuilder } = require('discord.js'); // Ensure EmbedBuilder is imported

function createBattleSummaryEmbed(battleId, battleSummary) {
  const attackerColor =
    battleSummary.winner === battleSummary.attackerName ? '🟢' : '🔴';
  const defenderColor =
    battleSummary.winner === battleSummary.defenderName ? '🟢' : '🔴';
  const url = battleSummary.url;
  // Get the flag emojis for attacker and defender
  const attackerFlag = countryFlagMap[battleSummary.attackerName] || '';
  const defenderFlag = countryFlagMap[battleSummary.defenderName] || '';

  const title = `Battle Summary: ${attackerFlag} ** ${battleSummary.attackerName} ${attackerColor}** vs ${defenderFlag} ** ${battleSummary.defenderName} ${defenderColor}**`;
  const description = `[Click here to view the battle](${url})`;

  return {
    color: 0x0099ff,
    title: title,
    description: description,
    fields: [
      {
        name: `Attacker: (${battleSummary.totalAttackerDamage}dmg)`,
        value: battleSummary.attackerSummary || 'No data',
        inline: true,
      },
      {
        name: `Defender (${battleSummary.totalDefenderDamage}dmg)`,
        value: battleSummary.defenderSummary || 'No data',
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: {
      text: 'Battle data provided by Eclesiar Scraper',
    },
  };
}

function createDailyDamageEmbed(data, country, day) {
  const latestDay = day || (data[0] && data[0].day_number) || 'Unknown Day';
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`[D${latestDay}] Daily Damage Statistics`)
    .setTimestamp();

  embed.setDescription(
    `Damage statistics for Day ${latestDay}. The daily damage is for the previous day, i.e Day ${
      latestDay - 1
    }.`
  );

  if (country && day) {
    const countryData = data.find(
      (item) => item.country_name.toLowerCase() === country.toLowerCase()
    );
    if (countryData) {
      const countryFlag = countryFlagMap[countryData.country_name] || '';

      embed.addFields(
        {
          name: `Country: ${countryFlag} ${countryData.country_name}`,
          value: `Total Damage (Day ${day}): ${countryData.total_damage.toLocaleString()} damage`,
          inline: true,
        },
        {
          name: 'Daily Damage',
          value: `Daily Damage (Day ${day}): ${countryData.daily_damage.toLocaleString()} damage`,
          inline: true,
        }
      );
    } else {
      embed.setDescription(
        `No data found for ${country} on Day ${day || 'the latest day'}`
      );
    }
  } else {
    const top10 = data.slice(0, 7);
    embed.addFields([
      {
        name: 'Country',
        value: ' ',
        inline: true,
      },
      {
        name: 'Total Damage',
        value: ' ',
        inline: true,
      },
      {
        name: `[D${latestDay - 1}] Daily Damage`,
        value: ' ',
        inline: true,
      },
    ]);
    top10.forEach((item, index) => {
      const countryFlag = countryFlagMap[item.country_name] || ''; // Fetch flag for the country
      embed.addFields([
        {
          name: ` `,
          value: `${countryFlag} ${item.country_name}`,
          inline: true,
        },
        {
          name: ` `,
          value: `${Number(item.total_damage).toLocaleString()} damage`,
          inline: true,
        },
        {
          name: ` `,
          value: ` ${item.daily_damage.toLocaleString()} damage`,
          inline: true,
        },
      ]);
    });
  }

  return embed;
}

module.exports = { createBattleSummaryEmbed, createDailyDamageEmbed };
