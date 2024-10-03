# Eclesiar Scraper

This monorepo contains both the Chrome extension for scraping Eclesiar data and the backend server for storing and managing the scraped data.

## Project Structure

- `extension/`: Contains the Chrome extension code
- `server/`: Contains the backend server code

## Setup

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/eclesiar-scraper.git
   cd eclesiar-scraper
   ```

2. Install dependencies for both projects:

   ```
   npm run install:all
   ```

3. Set up environment variables:
   - For the server, copy `server/.env.local` to `server/.env` and update the values.

## Running the Projects

1. Start the backend server:

   ```
   npm run start:server
   ```

2. Load the Chrome extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/` directory

## Development

- To build the extension: `npm run build:extension`
- To run tests: `npm test`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
