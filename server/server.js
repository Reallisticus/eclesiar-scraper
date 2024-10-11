require('dotenv').config();
const app = require('./src/app');
const WebSocket = require('ws');
const websocketService = require('./src/services/wsSrv');
const pool = require('./src/config/db');

const port = process.env.PORT || 3005;

const server = app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(
      'Database connected successfully. Current time:',
      result.rows[0].now
    );
  } catch (err) {
    console.error('Database connection error:', err);
  }
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Extension connected');
  websocketService.setSocket(ws);

  ws.on('message', (message) => {
    try {
      const decodedMessage = message.toString('utf8'); // Convert buffer to string
      const parsedMessage = JSON.parse(decodedMessage); // Parse the string into JSON

      console.log('Received message from extension:', parsedMessage);

      // Handle the received message, for example:
      if (
        parsedMessage.action === 'startScraping' &&
        parsedMessage.type === 'battle'
      ) {
        console.log(
          `Scraping initiated for battle ID: ${parsedMessage.battleId}`
        );
        // Here you could pass battle data back to the client, log it, etc.
        // This is the place to ensure that the scraping results get handled.
      } else if (parsedMessage.action === 'saveBattleData') {
        // Handle the message when the extension sends battle data to save
        console.log(
          `Received battle data from extension: ${JSON.stringify(
            parsedMessage.data
          )}`
        );
        // Save battle data to the database or process as needed
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
  ws.on('close', () => {
    console.log('Extension disconnected');
    websocketService.setSocket(null);
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
