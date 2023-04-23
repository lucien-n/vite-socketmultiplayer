<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let username = 'Unnamed';
</script>

<section class="menu" id="room-menu">
	<div class="container">
		<h1>Username</h1>
		<input type="text" placeholder="Unnamed" bind:value={username} />
		<hr />
		<button on:click={() => dispatch('select-username', username)}
			>Join</button
		>
	</div>
</section>
