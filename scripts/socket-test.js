const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiamFpbWVAdGVzdC5jb20iLCJpYXQiOjE3Nzc3NjI5ODIsImV4cCI6MTc3ODM2Nzc4Mn0.1mlVkgRPWB3-o2zwreie64QrYoIe8VA5vNbA3xy9PYc',
  },
});

socket.on('connect', () => {
  console.log('Connected to gateway with id:', socket.id);
});

socket.on('new-offer', (offer) => {
  console.log('Received new-offer:', offer);
});

socket.on('disconnect', () => {
  console.log('Disconnected from gateway');
});
