<script lang="ts">
	import io from 'socket.io-client';
	import { Player, DummyPlayer } from './lib/player';
	import { InputHandler } from './lib/input_handler';
	import { onMount } from 'svelte';
	import {
		width,
		height,
		canvas as canvasStore,
		context as contextStore,
		time,
		pixelRatio,
	} from './lib/store';

	let killLoopOnError = true;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let frame: any;
	let input_handler = new InputHandler();

	let player = new Player();
	let players: { [id: string]: DummyPlayer } = {};

	const socket = io('http://localhost:3000');

	socket.on('connect', () => {
		console.log('Connected to the server');
	});

	socket.on('clients', (clients: Array<string>) => {
		clients.forEach((client: string) => {
			players[client] = new DummyPlayer(client);
		});
		console.log('already connected clients: ', clients);
	});

	socket.on('client-connected', (client_id: string) => {
		players[client_id] = new DummyPlayer(client_id);
		console.log('new client: ', client_id);
		console.log(players);
	});

	socket.on('client-disconnected', (client_id: string) => {
		delete players[client_id];
	});

	socket.on('client-move', (client_id: string, x: number, y: number) => {
		if (!players[client_id]) {
			console.log(`${client_id} wasn't found in <players>`);
			return;
		}

		players[client_id].x = x;
		players[client_id].y = y;
	});

	onMount(async () => {
		context = canvas.getContext('2d');

		canvasStore.set(canvas);
		contextStore.set(context);

		context.font = `24px "Segoe UI", Helvetica, Arial, sans-serif`;

		return createLoop((elapsed, dt) => {
			time.set(elapsed);
			update();
			render(dt);
		});
	});

	function update() {
		player.update(input_handler.keys);

		if (player.prev_x != player.x || player.prev_y != player.y) {
			socket.emit('client-move', player.x, player.y);
		}
	}

	function render(dt) {
		context.save();
		context.scale($pixelRatio, $pixelRatio);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText(socket.id, 10, 30);

		player.draw($contextStore);

		Object.values(players).forEach((player: DummyPlayer) => {
			try {
				player.draw($contextStore);
			} catch (err) {
				console.error(err);
				if (killLoopOnError) {
					cancelAnimationFrame(frame);
					console.warn('Animation loop stopped due to an error');
				}
			}
		});

		context.restore();
	}

	function handleResize() {
		width.set(window.innerWidth);
		height.set(window.innerHeight);
		pixelRatio.set(window.devicePixelRatio);
	}

	function createLoop(fn) {
		let elapsed = 0;
		let lastTime = performance.now();
		(function loop() {
			if (!canvas) return;

			frame = requestAnimationFrame(loop);
			const beginTime = performance.now();
			const dt = (beginTime - lastTime) / 1000;
			lastTime = beginTime;
			elapsed += dt;
			fn(elapsed, dt);
		})();
		return () => {
			cancelAnimationFrame(frame);
		};
	}
</script>

<svelte:window
	on:resize|passive={handleResize}
	on:keydown={(e) => input_handler.keyDown(e.key)}
	on:keyup={(e) => input_handler.keyUp(e.key)}
/>
<main>
	<canvas
		id="game"
		bind:this={canvas}
		width={$width * $pixelRatio}
		height={$height * $pixelRatio}
		style="width: {$width}px; height: {$height}px;"
	/>
</main>
