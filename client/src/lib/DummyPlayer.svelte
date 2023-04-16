<script lang="ts">
	import { width, height, renderable } from './game';
	import Text from './Text.svelte';

	export let id: string;

	export let x: number = $width / 2;
	export let y: number = $height / 2;

	export let color: string = '#9999ff';

	export let size = 50;

	let name_text;
	let pos_text;

	renderable((props: any) => {
		const context = props;

		pos_text.$set({
			text: `(${x}, ${y})`,
			x: x + size / 2,
			y: y,
		});
		name_text.$set({
			text: `${id}`,
			x: x + size / 2,
			y: y + size,
		});

		// Draw
		context.beginPath();
		context.fillStyle = color;
		context.fillRect(x, y, size, size);
	});
</script>

<Text fontSize={16} baseline="bottom" align="center" bind:this={pos_text} />
<Text fontSize={16} baseline="top" align="center" bind:this={name_text} />
<slot />
