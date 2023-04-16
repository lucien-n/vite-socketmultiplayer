<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import { width, height, renderable } from './game';
	import Text from './Text.svelte';

	export let socket: Socket;

	export let startX = $width / 2;
	export let startY = $height / 2;
	export let speed = 2;

	export let color: string = '#99ff99';
	export let size = 50;

	let x: number = startX;
	let y: number = startY;

	let prev_x: number = x;
	let prev_y: number = y;

	let keys: Array<string> = [];
	let controls: Array<string> = ['z', 'q', 's', 'd'];

	let pos_text;
	let name_text;

	renderable((props: any, deltaTime: number) => {
		const context = props;

		// Update
		prev_x = x;
		prev_y = y;

		if (pressed('z')) {
			y -= speed;
		}
		if (pressed('q')) {
			x -= speed;
		}
		if (pressed('s')) {
			y += speed;
		}
		if (pressed('d')) {
			x += speed;
		}

		socket.emit('client-move', x, y);

		pos_text.$set({
			text: `(${x}, ${y})`,
			x: $width - 10,
			y: 10,
		});
		name_text.$set({
			text: `You`,
			x: x + 4,
			y: y - 4,
		});

		// Draw
		context.beginPath();
		context.fillStyle = color;
		context.fillRect(x, y, size, size);
	});

	function keyDown(key: string) {
		key = key.toLowerCase();
		if (controls.includes(key) && !pressed(key)) {
			keys.push(key);
		}
	}

	function keyUp(key: string) {
		key = key.toLowerCase();
		if (controls.includes(key)) {
			keys.splice(keys.indexOf(key), 1);
		}
	}

	function pressed(key: string) {
		return keys.indexOf(key) !== -1;
	}
</script>

<svelte:window
	on:keydown={(e) => keyDown(e.key)}
	on:keyup={(e) => keyUp(e.key)}
/>
<Text fontSize={20} baseline="top" align="end" bind:this={pos_text} />
<Text fontSize={20} baseline="bottom" align="start" bind:this={name_text} />
<slot />
