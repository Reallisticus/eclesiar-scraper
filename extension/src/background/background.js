import { connectWebSocket } from '../utils/ws.js';
import { saveData } from '../services/api.js';
import {
  handleCommand,
  navigateToNext,
  nextBusiness,
  nextRegion,
  nextBattle,
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
    case 'nextBattle': // Add this
      nextBattle();
      break;
    case 'saveBusinessData':
    case 'saveRegionData':
    case 'saveBattleData': // Add this
      saveData('saveBattleData', message.data).then((response) => {
        console.log(
          `Battle data sent to middleware: ${JSON.stringify(response)}`
        );
        sendResponse(response);
      });
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
