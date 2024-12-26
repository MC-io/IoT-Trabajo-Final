const WebSocket = require('ws');
const { PubSub } = require('@google-cloud/pubsub');

// Google Cloud Pub/Sub configuration

const pubsub = new PubSub({
    keyFilename: 'god-eyes-444201-8e39103944e3.json', // path to the downloaded key file
    projectId: 'god-eyes-444201',
});

const projectId = 'god-eyes-444201';
const subscriptionName = 'projects/god-eyes-444201/subscriptions/frames-sub';

const subscription = pubsub.subscription(subscriptionName);

const wss = new WebSocket.Server({
    host: '0.0.0.0', 
    port: 8080,
    verifyClient: (info, cb) => {
        cb(true); // Accept connection
    }
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Listen for messages from Pub/Sub
subscription.on('message', (message) => {
    console.log(`Received message: ${message.data.toString()}`);
    
    // Broadcast the message to all connected WebSocket clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.data.toString());
        }
    });

    message.ack(); // Acknowledge the message
});

console.log('WebSocket server is running on ws://localhost:8080');