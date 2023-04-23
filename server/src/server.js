import { createServer } from 'http';
import { Server } from 'socket.io';
import { info, error, warn, success } from './logger.js';
import express from 'express';
import cors from 'cors';
import { Room } from './room.js';
import { Client } from './client.js';

const app = express();
app.use(
	cors({
		origin: '*',
	})
);
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

const rooms = {
	alpha: new Room('alpha', 10),
	beta: new Room('beta', 10),
	gamma: new Room('gamma'),
};

io.on('connection', (socket) => {
	let client = new Client(socket.id);
	info('Client connected:', socket.id);

	socket.on('send-info', (client_username) => {
		client.name = client_username;
	});

	info('Sending rooms to client:', client.id);
	socket.emit(
		'rooms',
		Object.values(rooms).map((room) => room.repr())
	);

	socket.on('join-room', (room, client_username) => {
		socket.join(room);

		client.in_room = room;
		client.name = client_username;

		// Add the client to the room
		if (!Object.keys(rooms).includes(room)) {
			socket.emit('error', 'room-not-found', room);
			return;
		}

		rooms[room].addClient(client);

		// Send the already connected clients to the client
		socket.emit('clients-in-room', rooms[room].getClients());

		// Send the client to the already connected clients
		socket.broadcast.emit('client-joined', client.id, client.name);
	});

	socket.on('leave-room', () => {
		rooms[client.in_room].removeClient(client);
		socket.broadcast.emit('client-left', client.id);
	});

	socket.on('client-move', (x, y) => {
		socket.broadcast.emit('client-move', client.id, x, y);
	});

	socket.on('disconnect', () => {
		info('Client disconnected:', socket.id);
		rooms[client.in_room].removeClient(client);
		socket.broadcast.emit('client-left', client.id);
	});
});

server.listen(3000, () => {
	success(`Server listening on port 3000`);
});
