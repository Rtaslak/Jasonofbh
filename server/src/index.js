require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectToMqtt } = require('./mqtt/connection');
const { setupSocketHandlers } = require('./socket');
const { logInfo } = require('./utils/logger');

// Config
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// Express setup
const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Optional: Define routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  const mqttStatus = global.latestMqttStatus || { connected: false, message: 'Unknown' };
  res.status(200).json({
    status: 'ok',
    mqtt: mqttStatus.connected ? 'connected' : 'disconnected',
    message: mqttStatus.message,
    uptime: process.uptime()
  });
});

// HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true }
});

// WebSocket setup
setupSocketHandlers(io);

// ✅ Connect to MQTT and pass in WebSocket
const mqttClient = connectToMqtt(io);
if (!mqttClient) {
  console.error('❌ MQTT client failed to connect.');
}

// Start server
server.listen(PORT, HOST, () => {
  logInfo(`🚀 Server running at http://${HOST}:${PORT}`);
});
