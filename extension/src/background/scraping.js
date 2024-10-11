let businessId = 1;
let regionId = 1;
let currentTabId = null;
let stopScraping = false;
let scrapingType = null;
let battleId = 1; // Track the current battle ID

export function handleCommand(command) {
  console.log(`Received command: ${JSON.stringify(command)}`); // Add logging here
  if (command.action === 'startScraping') {
    scrapingType = command.type;
    console.log(`scrapingType set to: ${scrapingType}`);

    if (scrapingType === 'business') {
      businessId = command.startId || 1;
    } else if (scrapingType === 'region') {
      regionId = command.startId || 1;
    } else if (scrapingType === 'battle') {
      battleId = command.battleId || 1; // Add battleId handling
      console.log(`Starting scraping for battle ID: ${battleId}`);
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
  console.log(`navigateToNext called with scrapingType: ${scrapingType}`);

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
  } else if (scrapingType === 'battle') {
    url = `https://eclesiar.com/war/${battleId}`; // Adjust with the real battle URL
    console.log(`Navigating to URL: ${url}`); // Add logging here
  } else {
    console.error(`Invalid scraping type: ${scrapingType}`);
    return;
  }

  chrome.tabs.create({ url }, (tab) => {
    currentTabId = tab.id;
    console.log(`Created new tab with ID: ${currentTabId}`);

    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === currentTabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        console.log(`Tab ${tabId} loaded. Injecting content script.`);
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTabId },
            files: ['dist/content.bundle.js'],
          },
          () => {
            console.log('Content script injected successfully');
          }
        );
      }
    });
  });
}

export function nextBusiness() {
  businessId += 1;
  closeTabAndNavigate();
}

export function nextBattle() {
  battleId += 1; // Increment battle ID
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
