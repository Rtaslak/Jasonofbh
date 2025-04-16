
# RFID WebSocket Bridge

This server acts as a bridge between your MQTT broker (connected to RFID readers) and WebSocket clients (your web application). It receives RFID tag events from the MQTT broker and forwards them to all connected web clients in real-time.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on the `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your MQTT broker details.

4. Start the server:
   ```
   npm start
   ```

## Development

For development with automatic restarts:
```
npm run dev
```

## API Endpoints

- `GET /health` - Check server health
- `GET /api/config` - Get current MQTT configuration
- `POST /api/config` - Update MQTT configuration

## WebSocket Events

### Client to Server:
- `subscribe` - Subscribe to MQTT topics with a specific prefix
  ```js
  socket.emit('subscribe', { topicPrefix: 'jewelry/rfid/' });
  ```

### Server to Client:
- `rfid_event` - RFID tag event
  ```js
  socket.on('rfid_event', (event) => {
    console.log('RFID event:', event);
    // event = { tagId, stationId, timestamp, rssi }
  });
  ```

## Configuration

The server can be configured using environment variables:

- `PORT` - HTTP server port (default: 8000)
- `HOST` - HTTP server host (default: localhost)
- `MQTT_BROKER_URL` - MQTT broker URL (default: localhost)
- `MQTT_PORT` - MQTT broker port (default: 1883)
- `MQTT_USERNAME` - MQTT broker username
- `MQTT_PASSWORD` - MQTT broker password
- `MQTT_TOPIC_PREFIX` - MQTT topic prefix (default: jewelry/rfid/)
- `MQTT_USE_TLS` - Use TLS for MQTT connection (default: false)
- `DEBUG` - Enable debug logging (default: false)
