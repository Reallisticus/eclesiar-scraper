import { getElementText, getElementAttribute } from './utils.js';

export function scrapeBattlePlayers() {
  const playersData = [];
  const isBattleOver = !!document.querySelector(
    'div.war-content-area__war_over'
  );

  if (isBattleOver) {
    const attackerRowsSelector =
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.war-info.mt-1 > div > div > div.war-content-area__extra > div.w-100.war-content-area__extra--stats.war-content-area__round-filtered.war-content-area__round-filtered-resume.d-flex.flex-wrap > div.col-lg-6.text-center.attack > table > tbody > tr';
    const defenderRowsSelector =
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.war-info.mt-1 > div > div > div.war-content-area__extra > div.w-100.war-content-area__extra--stats.war-content-area__round-filtered.war-content-area__round-filtered-resume.d-flex.flex-wrap > div.col-lg-6.text-center.defend > table > tbody > tr';

    // Helper function to process each side
    function processPlayers(rows, side) {
      for (let i = 1; i < rows.length; i++) {
        // Skip the first row (header)
        const row = rows[i];

        // Select each column specifically
        const position = row.querySelector('td:nth-child(1) > div').innerText; // Position/ranking
        const countryFlag = row.querySelector('td:nth-child(2) > img').src; // Country flag (image src URL)
        const playerName = row.querySelector(
          'td:nth-child(3) > a > div'
        ).innerText; // Player name
        const totalDamage = parseInt(
          row
            .querySelector('td:nth-child(4)')
            .innerText.trim()
            .replace(',', ''),
          10
        ); // Total damage (remove commas and convert to number)
        const isHero = row.querySelector('td:nth-child(5)').innerText === '1'; // Round hero status (if it says '1', they are a hero)

        // Build the player object
        const playerData = {
          position,
          countryFlag,
          playerName,
          totalDamage,
          isHero,
          side, // Add the side: 'attacker' or 'defender'
        };

        playersData.push(playerData);
      }
    }

    // Scrape attacker players
    const attackerRows = document.querySelectorAll(attackerRowsSelector);
    processPlayers(attackerRows, 'attacker');

    // Scrape defender players
    const defenderRows = document.querySelectorAll(defenderRowsSelector);
    processPlayers(defenderRows, 'defender');

    console.log('Scraped player data (attacker + defender):', playersData);

    return playersData;
  }

  // Selectors for attacker and defender tables
}
