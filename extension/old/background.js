let businessId = 1;
let regionId = 1;
let currentTabId = null;
let stopScraping = false;
let scrapingType = null;
let socket = null;

function connectWebSocket() {
  socket = new WebSocket('ws://localhost:3005');

  socket.onopen = () => {
    console.log('Connected to server');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message from server:', message);
    handleCommand(message);
  };

  socket.onclose = () => {
    console.log('Disconnected from server. Attempting to reconnect...');
    setTimeout(connectWebSocket, 5000);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

function handleCommand(command) {
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

function navigateToNext() {
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
          files: ['content.js'],
        });
      }
    });
  });
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startScraping') {
    scrapingType = message.type;
    if (scrapingType === 'business') {
      businessId = message.startId || 1;
    } else if (scrapingType === 'region') {
      regionId = message.startId || 1;
    }
    stopScraping = false;
    navigateToNext();
  }

  if (message.action === 'nextBusiness') {
    businessId += 1;

    // Close the current tab before navigating to the next business
    if (currentTabId) {
      chrome.tabs.remove(currentTabId, () => {
        currentTabId = null;
        navigateToNext();
      });
    } else {
      navigateToNext();
    }
  }

  if (message.action === 'nextRegion') {
    regionId += 1;
    if (currentTabId) {
      chrome.tabs.remove(currentTabId, () => {
        currentTabId = null;
        navigateToNext();
      });
    } else {
      navigateToNext();
    }
  }

  if (
    message.action === 'saveBusinessData' ||
    message.action === 'saveRegionData'
  ) {
    const { data } = message;
    const endpoint =
      message.action === 'saveBusinessData'
        ? '/api/saveBusinessData'
        : '/api/saveRegionData';

    // Send data to the server
    fetch(`http://localhost:3005${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log('Data saved successfully.');
          sendResponse({ success: true });
        } else {
          console.error('Server error:', result.error);
          sendResponse({ success: false, error: result.error });
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Indicates that the response is asynchronous
  }

  if (message.action === 'stop') {
    stopScraping = true; // Stop the scraping process

    if (currentTabId) {
      chrome.tabs.remove(currentTabId, () => {
        currentTabId = null;
        console.log('Scraping stopped and tab closed.');
      });
    }
  }
});

chrome.runtime.onInstalled.addListener(connectWebSocket);

// Ensure connection when Chrome starts
chrome.runtime.onStartup.addListener(connectWebSocket);

// Keep the background script alive
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(connectWebSocket);
