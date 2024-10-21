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
  if (!message.action) {
    console.error('Received message with undefined action:', message);
    return;
  }

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
    case 'saveBattleData':
      console.log('Saving battle data:', message.data);
      saveData('saveBattleData', message.data).then((response) => {
        console.log(`Battle data response: ${JSON.stringify(response)}`);
        if (response.success && response.battleId) {
          if (message.data.players && message.data.players.length > 0) {
            console.log(`Saving players for battle ID: ${response.battleId}`);
            // Update the battleId in player data
            const playerData = {
              battleId: response.battleId,
              players: message.data.players,
            };
            saveData('savePlayersData', playerData)
              .then((playerResponse) => {
                console.log(
                  `Players saved successfully: ${JSON.stringify(
                    playerResponse
                  )}`
                );
                sendResponse({ success: true });
              })
              .catch((error) => {
                console.error('Error saving players:', error);
                sendResponse({ success: false, error: error.message });
              });
          } else {
            console.log('No players to save');
            sendResponse({ success: true });
          }
        } else {
          console.error('Failed to save battle data:', response.error);
          sendResponse({ success: false, error: response.error });
        }
      });
      return true; // Indicates that the response is asynchronous
    case 'saveDailyDamage':
      console.log('Saving daily damage data:', message.data);
      saveData('saveDailyDamage', message.data).then((response) => {
        console.log(`Daily damage data response: ${JSON.stringify(response)}`);
        if (response.success) {
          console.log('Daily damage data saved successfully');
          sendResponse({ success: true });
        } else {
          console.error('Failed to save daily damage data:', response.error);
          sendResponse({ success: false, error: response.error });
        }
      });
      return true; // Indicates that the response is asynchronous
    case 'stop':
      stopScrapingProcess();
      break;
    default:
      console.error('Unknown action:', message.action);
      break;
  }
});

chrome.runtime.onInstalled.addListener(() => connectWebSocket(handleCommand));
chrome.runtime.onStartup.addListener(() => connectWebSocket(handleCommand));

chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(() => connectWebSocket(handleCommand));
