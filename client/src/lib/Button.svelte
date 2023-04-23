<script lang="ts">
	import { renderable } from './game.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let color = 'hsl(0, 0%, 100%)';
	export let align = 'center';
	export let baseline = 'middle';

	export let text = '';
	export let x = 0;
	export let y = 0;

	export let fontSize = 16;
	export let fontFamily = '"Courier New", Courier, monospace';

	renderable((props: any, deltaTime: number) => {
		const context = props;
		if (text) {
			context.fillStyle = color;
			context.font = `${fontSize}px ${fontFamily}`;
			context.textAlign = align;
			context.textBaseline = baseline;
			context.fillText(text, x, y);
		}
	});
</script>

<slot />
