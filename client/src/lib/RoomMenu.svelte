<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';

	export let rooms;

	const dispatch = createEventDispatcher();

	let selected_room = rooms[0];
</script>

<Menu>
	<h1>Choose Room</h1>
	{#each rooms as room}
		<button
			class="room"
			id="room-{room}"
			name="choose-room"
			value={room}
			placeholder={room}
			class:selected={selected_room == room}
			on:click={() => (selected_room = room)}>{room}</button
		>
	{/each}
	<hr />
	<button on:click={() => dispatch('select-room', selected_room)}>Join</button
	>
</Menu>

<style>
	button.room {
		width: 20%;
		margin-top: 1em;
	}

	button.selected {
		text-decoration: underline;
		font-weight: bold;
		color: white;
		outline-offset: 2px;
		outline: 1px solid white;
	}
</style>
