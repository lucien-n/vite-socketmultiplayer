<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';

	const dispatch = createEventDispatcher();

	const urlParams = new URLSearchParams(window.location.search);
	const hasIp = urlParams.has('host');

	let host;
	if (hasIp) {
		host = urlParams.get('host');
	}
</script>

<Menu>
	<h1>Socket Multiplayer</h1>
	<input
		type="text"
		bind:value={host}
		id="host-input"
		placeholder="localhost"
	/>
	<hr />
	<button on:click={() => dispatch('connect', host)}>Connect</button>
</Menu>
