require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectMqtt } = require('./mqtt');
const { setupApiRoutes } = require('./routes/setupApiRoutes');
const { logInfo, logDebug, logError } = require('./utils/logger');
const { handleMqttMessage } = require('./mqtt/messageHandler');
const { setupSocketHandlers } = require('./socket');

// Configuration
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// ✅ Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE','PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users'); // ✅ Add this
app.use('/api/users', userRoutes);          // ✅ And this

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['polling', 'websocket']
});

// Setup API and WebSocket logic
setupApiRoutes(app, io);
setupSocketHandlers(io);

// Connect to MQTT and broadcast status
const mqttClient = connectMqtt(io);
if (mqttClient) {
  mqttClient.on('message', (topic, message) => {
    handleMqttMessage(topic, message, mqttClient.options.topicPrefix || 'jewelry/rfid/', io);
  });

  const isConnected = mqttClient.connected;
  io.emit('mqtt_status', {
    connected: isConnected,
    message: isConnected ? 'Connected to MQTT broker' : 'Connecting to MQTT broker...'
  });

  mqttClient.on('connect', () => {
    io.emit('mqtt_status', { connected: true, message: 'Connected to MQTT broker' });
  });

  mqttClient.on('close', () => {
    io.emit('mqtt_status', { connected: false, message: 'Disconnected from MQTT broker' });
  });

  mqttClient.on('error', (err) => {
    io.emit('mqtt_status', { connected: false, message: `Error: ${err.message}` });
  });
} else {
  io.emit('mqtt_status', { connected: false, message: 'Failed to connect to MQTT broker' });
}

// Health check
app.get('/health', (req, res) => {
  const mqttStatus = mqttClient && mqttClient.connected ? 'connected' : 'disconnected';
  res.status(200).send({
    status: 'ok',
    mqtt: mqttStatus,
    uptime: process.uptime()
  });
});

// Start server
server.listen(PORT, HOST, () => {
  logInfo(`Server running at http://${HOST}:${PORT}`);
});
