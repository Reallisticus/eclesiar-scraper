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
    console.log('Received message from extension:', message);
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
