let socket = null;

export function connectWebSocket(handleCommand) {
  socket = new WebSocket('ws://localhost:3005');

  socket.onopen = () => {
    console.log('Connected to server');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message from middleware:', message);
    handleCommand(message); // Pass message to handleCommand function
  };

  socket.onclose = () => {
    console.log('Disconnected from server. Attempting to reconnect...');
    setTimeout(() => connectWebSocket(handleCommand), 5000);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}
