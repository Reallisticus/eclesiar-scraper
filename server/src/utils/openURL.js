async function openUrlAndTriggerScraper(url) {
  // Import 'open' dynamically
  const { default: open } = await import('open');
  console.log('Imported open module successfully.');

  // Open the URL in Edge
  try {
    await open(url, { app: { name: 'msedge' } });
    console.log(`Opened Edge with URL: ${url}`);
  } catch (err) {
    console.error('Error opening Edge:', err);
    throw new Error('Failed to open Edge');
  }
}

module.exports = openUrlAndTriggerScraper;
