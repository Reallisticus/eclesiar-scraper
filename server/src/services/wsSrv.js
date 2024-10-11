// wsSrv.js
let extensionSocket = null;

function setSocket(socket) {
  extensionSocket = socket;
}

function triggerScraping(action, type, startId) {
  if (extensionSocket && extensionSocket.readyState === WebSocket.OPEN) {
    console.log(`Sending command to extension: ${action}, ${type}, ${startId}`);
    extensionSocket.send(JSON.stringify({ action, type, startId }));
    return { success: true, message: 'Scraping triggered' };
  } else {
    console.error('Extension is not connected or WebSocket is not open');
    return {
      success: false,
      message: 'Extension not connected or WebSocket not open',
    };
  }
}

module.exports = {
  setSocket,
  triggerScraping,
};
