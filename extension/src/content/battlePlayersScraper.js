import { getElementText, getElementAttribute } from './utils.js';

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error('Element not found within timeout'));
      }
    }, 100);
  });
}

export function scrapeBattlePlayers() {
  const playersData = [];
  const isBattleOver = !!document.querySelector(
    'div.war-content-area__war_over'
  );

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
        row.querySelector('td:nth-child(4)').innerText.trim().replace(',', ''),
        10
      ); // Total damage (remove commas and convert to number)
      const isHero = row.querySelector('td:nth-child(5)').innerText === '1'; // Round hero status (if it says '1', they are a hero)

      const existingPlayer = playersData.find(
        (player) => player.playerName === playerName && player.side === side
      );

      if (existingPlayer) {
        // Sum the damage if player already exists
        existingPlayer.totalDamage += totalDamage;
      } else {
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
  }

  if (isBattleOver) {
    const attackerRowsSelector =
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.war-info.mt-1 > div > div > div.war-content-area__extra > div.w-100.war-content-area__extra--stats.war-content-area__round-filtered.war-content-area__round-filtered-resume.d-flex.flex-wrap > div.col-lg-6.text-center.attack > table > tbody > tr';
    const defenderRowsSelector =
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.war-info.mt-1 > div > div > div.war-content-area__extra > div.w-100.war-content-area__extra--stats.war-content-area__round-filtered.war-content-area__round-filtered-resume.d-flex.flex-wrap > div.col-lg-6.text-center.defend > table > tbody > tr';

    // Helper function to process each side

    // Scrape attacker players
    const attackerRows = document.querySelectorAll(attackerRowsSelector);
    processPlayers(attackerRows, 'attacker');

    // Scrape defender players
    const defenderRows = document.querySelectorAll(defenderRowsSelector);
    processPlayers(defenderRows, 'defender');

    console.log('Scraped player data (attacker + defender):', playersData);

    return playersData;
  } else {
    console.log(
      'Battle is ongoing - Scraping data for all rounds without clicking buttons'
    );
    // Battle is ongoing - Scrape data for all rounds without clicking buttons
    const lastRoundButton = document.querySelector(
      'body > div.wrapper > div > section > div > div > div.row.mt-2.usable-area > div.col-lg-9.col-md-12.col-12.expandable-main-area > div > div > div > div.war-info.mt-1 > div > div.war-content-area__extra > div.war-content-area__extra--stats.menu-tab.menu-top.d-flex.flex-wrap > div.w-100.text-center.pt-2.pb-2 > button.war-content-area__round-filter.active'
    );
    if (!lastRoundButton) {
      console.error('No rounds found for ongoing battle.');
      return playersData; // Exit if there are no rounds
    }
    const lastRoundIndex = parseInt(lastRoundButton.innerText.trim(), 10) - 1;

    for (let roundIndex = 0; roundIndex <= lastRoundIndex; roundIndex++) {
      // Selector for attacker and defender rows for the current round
      const attackerRowsSelector = `body > div.wrapper > div > section > div > div > div.row.mt-2.usable-area > div.col-lg-9.col-md-12.col-12.expandable-main-area > div > div > div > div.war-info.mt-1 > div > div.war-content-area__extra > div.war-content-area__extra--stats.menu-tab.menu-top.flex-wrap.d-flex > div.w-100.war-content-area__round-filtered.war-content-area__round-filtered-${roundIndex}.d-flex.flex-wrap > div.col-lg-6.text-center.attack > table > tbody > tr`;
      const defenderRowsSelector = `body > div.wrapper > div > section > div > div > div.row.mt-2.usable-area > div.col-lg-9.col-md-12.col-12.expandable-main-area > div > div > div > div.war-info.mt-1 > div > div.war-content-area__extra > div.war-content-area__extra--stats.menu-tab.menu-top.flex-wrap.d-flex > div.w-100.war-content-area__round-filtered.war-content-area__round-filtered-${roundIndex}.d-flex.flex-wrap > div.col-lg-6.text-center.defend > table > tbody > tr`;

      // Scrape attacker players
      const attackerRows = document.querySelectorAll(attackerRowsSelector);
      processPlayers(attackerRows, 'attacker');

      // Scrape defender players
      const defenderRows = document.querySelectorAll(defenderRowsSelector);
      processPlayers(defenderRows, 'defender');

      console.log(
        `Scraped player data (attacker + defender) for round ${
          roundIndex + 1
        }:`,
        playersData
      );
    }

    return playersData;
  }

  // Selectors for attacker and defender tables
}
