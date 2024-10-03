import { connectWebSocket } from '../utils/websocket.js';
import { saveData } from '../services/api.js';
import {
  handleCommand,
  navigateToNext,
  nextBusiness,
  nextRegion,
  stopScrapingProcess,
} from './scraping.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startScraping':
      handleCommand(message);
      break;
    case 'nextBusiness':
      nextBusiness();
      break;
    case 'nextRegion':
      nextRegion();
      break;
    case 'saveBusinessData':
    case 'saveRegionData':
      saveData(message.action, message.data).then(sendResponse);
      return true; // Indicates that the response is asynchronous
    case 'stop':
      stopScrapingProcess();
      break;
  }
});

chrome.runtime.onInstalled.addListener(() => connectWebSocket(handleCommand));
chrome.runtime.onStartup.addListener(() => connectWebSocket(handleCommand));

chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(() => connectWebSocket(handleCommand));
