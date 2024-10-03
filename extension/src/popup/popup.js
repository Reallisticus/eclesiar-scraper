document.getElementById('scrapeBusiness').addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'startScraping',
    type: 'business',
    startId: 1,
  });
  document.getElementById('status').innerText = 'Business scraping started...';
});

document.getElementById('scrapeRegion').addEventListener('click', () => {
  chrome.runtime.sendMessage({
    action: 'startScraping',
    type: 'region',
    startId: 1,
  });
  document.getElementById('status').innerText = 'Region scraping started...';
});

document.getElementById('stopScraping').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
  document.getElementById('status').innerText = 'Scraping stopped.';
});
