console.log('Content script executed');

import { isPageValid } from './utils.js';
import { scrapeBusinessData } from './businessScraper.js';
import { scrapeRegionData } from './regionScraper.js';
import { scrapeBattleData } from './battleScraper.js';

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
    data = scrapeBattleData();
    action = 'saveBattleData';
    nextAction = 'nextBattle';

    console.log(`Scraped battle data: ${JSON.stringify(data)}`);
  }

  if (data) {
    data.url = url;
    chrome.runtime.sendMessage({ action, data }, (response) => {
      console.log('Data sent to background, response:', response);
    });
    chrome.runtime.sendMessage({ action: nextAction });
  }
}

chrome.runtime.sendMessage({ action, data }, (response) => {
  console.log('Data sent to background, response:', response);
});
