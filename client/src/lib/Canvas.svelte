<script lang="ts">
	import { onMount, setContext } from 'svelte';

	import {
		canvas as canvasStore,
		context as contextStore,
		time,
		key,
		pixelRatio,
		width,
		height,
		props,
	} from './game';

	export let killLoopOnError = true;

	let listeners = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let frame;

	onMount(() => {
		ctx = canvas.getContext('2d');
		canvasStore.set(canvas);
		contextStore.set(ctx);

		return createLoop((elapsed: number, deltaTime: number) => {
			time.set(elapsed);
			render(deltaTime);
		});
	});

	setContext(key, {
		add(fn) {
			this.remove(fn);
			listeners.push(fn);
		},
		remove(fn) {
			const idx = listeners.indexOf(fn);
			if (idx >= 0) listeners.splice(idx, 1);
		},
	});

	function render(deltaTime: number) {
		ctx.fillStyle = '#1a1a1a';
		ctx.fillRect(0, 0, $width, $height);
		ctx.save();
		ctx.scale($pixelRatio, $pixelRatio);

		listeners.forEach((entity) => {
			try {
				if (entity.mounted && entity.ready) {
					entity.render(ctx);
				}
			} catch (err) {
				console.error(err);
				if (killLoopOnError) {
					cancelAnimationFrame(frame);
					console.warn('Animation frame cancelled');
				}
			}
		});
		ctx.restore();
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
			// setup entities
			listeners.forEach(async (entity) => {
				if (entity.setup) {
					let p = entity.setup($props);
					if (p && p.then) await p;
				}
				entity.ready = true;
			});

			frame = requestAnimationFrame(loop);
			const beginTime = performance.now();
			const deltaTime = (beginTime - lastTime) / 1_000;
			lastTime = beginTime;
			elapsed += deltaTime;
			fn(elapsed, deltaTime);
		})();
		return () => {
			cancelAnimationFrame(frame);
		};
	}
</script>

<canvas
	bind:this={canvas}
	width={$width * $pixelRatio}
	height={$height * $pixelRatio}
	style="width: {$width}px; height: {$height}px;"
/>
<svelte:window on:resize|passive={handleResize} />
<slot />
