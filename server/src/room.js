import { info, warn, error, success } from './logger.js';

export class Room {
	name = 'default';
	clients = {};
	max_clients = 10;

	constructor(name, max_clients) {
		this.name = name;
		this.max_clients = max_clients === undefined ? 8 : max_clients;
	}

	addClient(client) {
		info(`Added client '${client.id}' to room '${this.name}'`);
		this.clients[client.id] = client;
	}

	removeClient(client) {
		delete this.clients[client.id];
	}

	getClients() {
		return Object.keys(this.clients);
	}

	getNumberOfClients() {
		return Object.keys(this.clients).length;
	}

	getMaxClients() {
		return this.max_clients;
	}

	repr() {
		return [this.name, this.getNumberOfClients(), this.getMaxClients()];
	}
}
