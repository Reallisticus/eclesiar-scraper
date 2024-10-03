# Eclesiar Scraper Chrome Extension

## Description

Eclesiar Scraper is a Chrome extension designed to extract business and region data from the Eclesiar website. It automates the process of navigating through pages, scraping relevant information, and storing it in a database.

## Features

- Scrape business data including name, quality, type, region, and employees
- Scrape region data including name, country, resource type, and pollution levels
- Automated navigation through multiple pages
- Real-time data saving to a backend server
- WebSocket integration for remote control

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/eclesiar-scraper.git
   ```
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project directory

## Usage

1. Click on the extension icon in Chrome
2. Choose to start scraping businesses or regions
3. The extension will automatically navigate through pages and collect data
4. Data is sent to the backend server in real-time

## Project Structure

```
eclesiar-scraper/
├── src/
│   ├── background/
│   │   ├── background.js
│   │   └── scraping.js
│   ├── content/
│   │   ├── content.js
│   │   ├── businessScraper.js
│   │   ├── regionScraper.js
│   │   └── utils.js
│   ├── popup/
│   │   ├── popup.html
│   │   └── popup.js
│   ├── utils/
│   │   └── websocket.js
│   └── services/
│       └── api.js
├── assets/
│   └── icons/
├── config/
│   └── config.js
├── manifest.json
└── README.md
```

## Development

To modify the extension:

1. Make changes to the relevant files in the `src/` directory
2. If adding new permissions or content scripts, update `manifest.json`
3. Reload the extension in Chrome to see your changes

## Backend Setup

Ensure you have a Node.js server running to receive and store the scraped data. The server should have endpoints for `/api/saveBusinessData` and `/api/saveRegionData`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
