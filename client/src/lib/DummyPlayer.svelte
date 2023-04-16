<script lang="ts">
	import { width, height, renderable, Dummy } from './game';
	import Text from './Text.svelte';

	export let dummy: Dummy;

	export let color: string = '#9999ff';
	export let size = 48;

	let name_text;
	let pos_text;

	renderable((props: any) => {
		const context = props;

		pos_text.$set({
			text: `(${dummy.x}, ${dummy.y})`,
			x: dummy.x + size / 2,
			y: dummy.y,
		});
		name_text.$set({
			text: dummy.username,
			x: dummy.x + size / 2,
			y: dummy.y + size,
		});

		// Draw
		context.beginPath();
		context.fillStyle = color;
		context.fillRect(dummy.x, dummy.y, size, size);
	});
</script>

<Text fontSize={16} baseline="bottom" align="center" bind:this={pos_text} />
<Text fontSize={16} baseline="top" align="center" bind:this={name_text} />
<slot />
