<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import { width, height, renderable, Vector2 } from './game';
	import Text from './Text.svelte';

	export let socket: Socket;

	export let startX = $width / 2;
	export let startY = $height / 2;
	export let speed = 300;

	export let color: string = '#99ff99';
	export let size = 50;

	let pos: Vector2 = new Vector2(startX, startY);

	let prev_pos: Vector2 = new Vector2(pos.x, pos.y);

	let keys: Array<string> = [];
	let controls: Array<string> = ['z', 'q', 's', 'd'];

	let text;

	renderable((props: any, deltaTime: number) => {
		const context = props;

		// Update
		prev_pos.set(pos);

		let velocity = new Vector2(0, 0);

		if (pressed('z')) {
			velocity.y = -(speed * deltaTime);
		}
		if (pressed('q')) {
			velocity.x = -(speed * deltaTime);
		}
		if (pressed('s')) {
			velocity.y = speed * deltaTime;
		}
		if (pressed('d')) {
			velocity.x = speed * deltaTime;
		}

		pos.add(velocity);

		pos.round(1);

		socket.emit('client-move', pos.x, pos.y);

		text.$set({
			text: `(${pos.x}, ${pos.y})`,
			x: pos.x + size / 2,
			y: pos.y,
		});

		// Draw
		context.beginPath();
		context.fillStyle = color;
		context.fillRect(pos.x, pos.y, size, size);
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
<Text fontSize={20} baseline="bottom" align="center" bind:this={text} />
<slot />
