import { createServer } from 'http';
import { Server } from 'socket.io';
import { info, error, warn, success } from './logger.js';
import express from 'express';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

app.use(cors());

let clients = {};

io.on('connection', (socket) => {
	info('Client connected:', socket.id);
	socket.emit('clients', Object.keys(clients));

	clients[socket.id] = socket;

	socket.broadcast.emit('client-connected', socket.id);

	socket.on('client-move', (x, y) => {
		socket.broadcast.emit('client-move', socket.id, x, y);
	});

	socket.on('disconnect', () => {
		info('Client disconnected:', socket.id);
		socket.broadcast.emit('client-disconnected', socket.id);
		delete clients[socket.id];
	});
});

server.listen(3000, () => {
	success('Server listening on port 3000');
});
