<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const urlParams = new URLSearchParams(window.location.search);
	const hasIp = urlParams.has('ip');

	let ip;
	if (hasIp) {
		ip = urlParams.get('ip');
	}
</script>

<section id="menu">
	<div class="container">
		<h1>Socket Multiplayer</h1>
		<input type="text" bind:value={ip} placeholder="localhost" />
		<hr />
		<button on:click={() => dispatch('connect', ip)}>Join</button>
	</div>
</section>

<style scoped>
	#menu {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.container {
		width: 50%;
		height: 50%;
		border-radius: 0.3em;
		border: 2px solid rgba(255, 255, 255, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: xx-large;

		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	}

	h1 {
		font-family: 'Courier New', Courier, monospace;
		color: white;
	}

	input {
		outline: none;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-radius: 0.3em;
		font-size: xx-large;
		width: 65%;
		text-align: center;
		padding: 0.3em;
		background-color: rgba(255, 255, 255, 0.05);
		color: white;
		transition: 100ms ease-in-out;
		font-family: 'Courier New', Courier, monospace;
	}

	input:focus {
		border-color: rgba(255, 255, 255, 0.8);
	}

	button {
		outline: none;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-radius: 0.3em;
		font-size: x-large;
		padding: 0.3em;
		background-color: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.5);
		transition: 100ms ease-in-out;
		padding-left: 0.7em;
		padding-right: 0.7em;
		font-family: 'Courier New', Courier, monospace;
	}

	button:hover {
		color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
		border-color: rgba(255, 255, 255, 0.8);
	}

	hr {
		width: 20%;
	}
</style>
