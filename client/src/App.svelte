<script lang="ts">
	import Canvas from './lib/Canvas.svelte';
	import Player from './lib/Player.svelte';
	import DummyPlayer from './lib/DummyPlayer.svelte';
	import Text from './lib/Text.svelte';
	import io from 'socket.io-client';
	import { players, Dummy } from './lib/game';

	const socket = io('http://localhost:3000');

	socket.on('connect', () => {
		console.log('Connected to the server');
	});

	socket.on('clients', (clients_ids: Array<string>) => {
		clients_ids.forEach((client_id: string) => {
			$players[client_id] = new Dummy(client_id, 0, 0);
		});
	});

	socket.on('client-connected', (client_id: string) => {
		$players[client_id] = new Dummy(client_id, 0, 0);
	});

	socket.on('client-disconnected', (client_id: string) => {
		delete $players[client_id];
	});

	socket.on('client-move', (client_id: string, x: number, y: number) => {
		if (!$players[client_id]) {
			return;
		}

		$players[client_id].x = x;
		$players[client_id].y = y;
	});
</script>

<Canvas>
	{#each Object.values($players) as player}
		<DummyPlayer x={player.x} y={player.y} id={player.id} size={32} />
	{/each}
	<Player size={48} {socket} />
	<Text
		text="Multiplayer Socket"
		fontSize={24}
		align="start"
		baseline="top"
		x={10}
		y={10}
	/>
</Canvas>
