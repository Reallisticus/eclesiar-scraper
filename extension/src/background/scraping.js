let businessId = 1;
let regionId = 1;
let currentTabId = null;
let stopScraping = false;
let scrapingType = null;

export function handleCommand(command) {
  if (command.action === 'startScraping') {
    scrapingType = command.type;
    if (scrapingType === 'business') {
      businessId = command.startId || 1;
    } else if (scrapingType === 'region') {
      regionId = command.startId || 1;
    }
    stopScraping = false;
    navigateToNext();
  } else if (command.action === 'stop') {
    stopScraping = true;
    if (currentTabId) {
      chrome.tabs.remove(currentTabId, () => {
        currentTabId = null;
        console.log('Scraping stopped and tab closed.');
      });
    }
  }
}

export function navigateToNext() {
  if (stopScraping) {
    console.log('Scraping stopped.');
    return;
  }

  let url;
  if (scrapingType === 'business') {
    url = `https://eclesiar.com/business/${businessId}`;
  } else if (scrapingType === 'region') {
    if (regionId > 292) {
      console.log('Region scraping completed.');
      stopScraping = true;
      if (currentTabId) {
        chrome.tabs.remove(currentTabId);
      }
      return;
    }
    url = `https://eclesiar.com/region/${regionId}/details`;
  } else {
    console.error('Invalid scraping type');
    return;
  }

  chrome.tabs.create({ url }, (tab) => {
    currentTabId = tab.id;

    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === currentTabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          files: ['src/content/content.js'],
        });
      }
    });
  });
}

export function nextBusiness() {
  businessId += 1;
  closeTabAndNavigate();
}

export function nextRegion() {
  regionId += 1;
  closeTabAndNavigate();
}

function closeTabAndNavigate() {
  if (currentTabId) {
    chrome.tabs.remove(currentTabId, () => {
      currentTabId = null;
      navigateToNext();
    });
  } else {
    navigateToNext();
  }
}

export function stopScrapingProcess() {
  stopScraping = true;
  if (currentTabId) {
    chrome.tabs.remove(currentTabId, () => {
      currentTabId = null;
      console.log('Scraping stopped and tab closed.');
    });
  }
}
