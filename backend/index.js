const express = require('express');
const axios = require('axios');
const cors = require('cors');
const WebSocket = require('ws');
const FyersSocket = require('fyers-api-v3').fyersDataSocket;

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Create a WebSocket server attached to your Express server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  // Handle incoming WebSocket connections
  ws.on('message', (message) => {
    // Handle messages from the frontend if needed
  });
});

// Attach the WebSocket server to the existing Express server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

var fyersdata = new FyersSocket(
  '6BQQUK21RL-100:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MDgwNjQ1MjcsImV4cCI6MTcwODEyOTgwNywibmJmIjoxNzA4MDY0NTI3LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbHp2OFBCM3R5c3NROTlrUk5IQWRtZW4wYS1LenNzZzdWYU5LMXc0Nkd5VHJubEQwOUcyWGUzZnNQc05tdXpXVmVEN04zeHQ4ZmxRM2hjNDRmS3FRbzJnbENFUkp5ZVZndEFUR1pzOWlxREtJTDk2OD0iLCJkaXNwbGF5X25hbWUiOiJKQVRJTiBHVVBUQSIsIm9tcyI6IksxIiwiaHNtX2tleSI6ImVjNzUwNjdiMmQzYjZiMjQ5N2YwZDRjNGNhMmQ1ZWUyZmI3OGZiYTAzZGE3ZmUwOWNiNjA4MTkwIiwiZnlfaWQiOiJZSjAwODU3IiwiYXBwVHlwZSI6MTAwLCJwb2FfZmxhZyI6Ik4ifQ.5ezGd-VPpVoXmXtKdIlUpBrRHYmKyDgxUR_VZubjXpA'
);

function onmsg(message) {
  // Send the received message to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function onconnect() {
  fyersdata.subscribe([
    'MCX:GOLDM24MARFUT',
    'NSE:SBIN-EQ',
    'NSE:IDEA-EQ',
    'BSE:BAJAJFINSV-A',
    'BSE:SENSEX-INDEX',
  ]);
  fyersdata.autoreconnect();
}
//MCX:GOLDM24FEB64000CE
//'NSE:GOLDM24MARFUT' , 'MCX:GOLD24MARFUT' ,
//NSE:SBIN-EQ','NSE:IDEA-EQ'
//'BSE:SENSEX-INDEX' , 'BSE:BAJAJFINSV-A'

function onerror(err) {
  console.log(err);
}

function onclose() {
  console.log('socket closed');
}

fyersdata.on('message', onmsg);
fyersdata.on('connect', onconnect);
fyersdata.on('error', onerror);
fyersdata.on('close', onclose);

fyersdata.connect();
