console.log('Content script executed');

import { isPageValid } from './utils.js';
import { scrapeBusinessData } from './businessScraper.js';
import { scrapeRegionData } from './regionScraper.js';
import { scrapeBattleData } from './battleScraper.js';
import { scrapeBattlePlayers } from './battlePlayersScraper.js';
import { scrapeDailyDamage } from './dailyDmgScraper.js'; //

if (!isPageValid()) {
  chrome.runtime.sendMessage({ action: 'stop' });
} else {
  const url = window.location.href;
  let data, action, nextAction;

  if (url.includes('/business/')) {
    data = scrapeBusinessData();
    action = 'saveBusinessData';
    nextAction = 'nextBusiness';
  } else if (url.includes('/region/') && url.includes('/details')) {
    data = scrapeRegionData();
    action = 'saveRegionData';
    nextAction = 'nextRegion';
  } else if (url.includes('/war/')) {
    data = scrapeBattleData(); // Should return an object with isBattleOver and totalRounds
    const players = scrapeBattlePlayers();
    data.players = players; // Attach players to the battle data

    console.log('Scraped battle data:', data);

    action = 'saveBattleData';
  } else if (url.includes('/statistics/country/damage')) {
    console.log('test daily dmg');
    data = scrapeDailyDamage();
    action = 'saveDailyDamage';
  }

  if (data && action) {
    data.url = url;
    // Send the scraped data to the background script for saving
    chrome.runtime.sendMessage({ action, data }, (response) => {
      console.log('Data sent to background, response:', response);
    });
    // Trigger the next action (for navigation)
    if (nextAction) {
      chrome.runtime.sendMessage({ action: nextAction });
    }
  }
}
