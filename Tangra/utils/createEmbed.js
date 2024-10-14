const countryFlagMap = require('./countryFlags');

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

module.exports = createBattleSummaryEmbed;
