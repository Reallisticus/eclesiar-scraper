import {
  getElementText,
  getElementAttribute,
  getElementCount,
} from './utils.js';

export function scrapeBattleData() {
  const data = {};

  // Check if battle is over
  data.isBattleOver = !!document.querySelector(
    'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.war-info.mt-1 > div > div > div.war-content-area__war_over > h3'
  );

  if (data.isBattleOver) {
    // Scrape total number of rounds
    data.totalRounds = getElementCount(
      'body > div.wrapper > div > section > div > div > div.row.mt-2 > div.col-lg-9.col-md-12.col-12 > div > div > div > div.war-info.mt-1 > div > div > div.war-content-area__extra > div.w-100.d-flex.flex-wrap.justify-content-center.text-center.pt-2.pb-2',
      'button.war-content-area__round-filter'
    );
  } else {
    // Scrape current round number if battle is ongoing
    data.currentRound = getElementText(
      'body > div.wrapper > div > section > div > div > div.row.mt-2.usable-area > div.col-lg-9.col-md-12.col-12.expandable-main-area > div > div > div > div.war-info.mt-1 > div > div.war-content-area.forest > div.war-content-area__header.attacker-side > div.col-12.d-flex.flex-wrap.justify-content-center.mt-2.pb-3 > div.d-flex.timer-and-roundscore-area > div > div.war-content-area__header--time-area > span'
    );
  }

  // Add more scraping logic here as needed (e.g., player stats, country info)
  console.log('Scraping battle data:', data); // Log scraped data

  return data;
}