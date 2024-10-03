import { isPageValid } from './utils.js';
import { scrapeBusinessData } from './businessScraper.js';
import { scrapeRegionData } from './regionScraper.js';

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
  }

  if (data) {
    data.url = url;
    chrome.runtime.sendMessage({ action, data });
    chrome.runtime.sendMessage({ action: nextAction });
  }
}
