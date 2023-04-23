<script lang="ts">
	import Canvas from './lib/Canvas.svelte';
	import Player from './lib/Player.svelte';
	import DummyPlayer from './lib/DummyPlayer.svelte';
	import Text from './lib/Text.svelte';
	import io from 'socket.io-client';
	import { players, Dummy } from './lib/game';
	import RoomMenu from './lib/menus/RoomMenu.svelte';
	import ServerMenu from './lib/menus/ServerMenu.svelte';
	import UsernameMenu from './lib/menus/UsernameMenu.svelte';
	import { rooms } from './lib/game';

	// 0 -> Server Menu
	// 1 -> Room Selection Menu
	// 2 -> Username Menu
	// 3 -> In Game
	let gameState = 0;

	let socket;

	let selected_room = 'alpha';
	let selected_username = 'Scaffus';

	function connect(event: any) {
		let ip = event.detail;
		if (ip === '' || ip === null || ip === 'localhost') {
			ip = 'http://localhost:3000';
		}

		socket = io(ip);

		socket.on('connect', () => {
			gameState = 1;
		});

		// Received available rooms from server
		socket.on('rooms', (rooms) => {
			$rooms = rooms;
		});

		socket.on('clients-in-room', (clients: Array<object>) => {
			clients.forEach((client: any) => {
				if (client === socket.id) return;
				$players[client.id] = new Dummy(client.name, client[1], 0, 0);
			});
		});

		// A client joined
		socket.on('client-joined', (client_id: string, client_name: string) => {
			$players[client_id] = new Dummy(client_id, client_name, 0, 0);
		});

		// A client left
		socket.on('client-left', (client_id: string) => {
			delete $players[client_id];
		});

		// A client moved
		socket.on('client-move', (client_id: string, x: number, y: number) => {
			if (!$players[client_id]) {
				return;
			}

			$players[client_id].x = x;
			$players[client_id].y = y;
		});

		// Handle errors
		socket.on('error', (error, data) => {
			switch (error) {
				case 'room-not-found':
					console.error(data, 'is not a room');
					break;
				default:
					console.error(error, 'Data: ', data);
			}
		});
	}

	function selectRoom(event) {
		selected_room = event.detail;
		gameState = 2;
	}

	function selectUsername(event) {
		selected_username = event.detail;
		socket.emit('join-room', selected_room, selected_username);
		gameState = 3;
	}
</script>

{#if gameState === 0}
	<!-- Join server -->
	<ServerMenu on:connect={connect} />
{:else if gameState === 1}
	<!-- Pick Room -->
	<RoomMenu on:select-room={selectRoom} />
{:else if gameState === 2}
	<!-- Pick username -->
	<UsernameMenu on:select-username={selectUsername} />
{:else}
	<!-- Play -->
	<Canvas>
		{#each Object.values($players) as player}
			<DummyPlayer dummy={player} size={32} />
		{/each}
		<Player size={48} {socket} />
		<Text
			text="Multiplayer Socket | In room {selected_room}"
			fontSize={24}
			align="start"
			baseline="top"
			x={10}
			y={10}
		/>
	</Canvas>
{/if}
