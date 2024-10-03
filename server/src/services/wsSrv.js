let extensionSocket = null;

function setSocket(socket) {
  extensionSocket = socket;
}

function triggerScraping(action, type, startId) {
  if (extensionSocket) {
    extensionSocket.send(JSON.stringify({ action, type, startId }));
    return { success: true, message: 'Scraping triggered' };
  } else {
    return { success: false, message: 'Extension not connected' };
  }
}

module.exports = {
  setSocket,
  triggerScraping,
};
