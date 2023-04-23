<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';
	import { rooms } from '../game';

	const dispatch = createEventDispatcher();

	let selected_room = $rooms[0][0];
</script>

<Menu>
	<h1>Choose Room</h1>
	{#each $rooms as room}
		<button
			class="room"
			id="room-{room[0]}"
			name="choose-room"
			value={room[0]}
			class:selected={selected_room == room[0]}
			on:click={() => (selected_room = room[0])}
			>{`${room[0]} ${room[1]}/${room[2]}`}</button
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
