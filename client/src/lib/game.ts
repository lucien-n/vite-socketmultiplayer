import { writable, derived } from 'svelte/store';
import { getContext, onMount } from 'svelte';
import type { Writable } from 'svelte/store';

export class Dummy {
	id: string;
	x: number;
	y: number;

	constructor(id: string, x: number, y: number) {
		this.id = id;
		this.x = x;
		this.y = y;
	}
}

export const canvas = writable();
export const context = writable();
export const time = writable(0);
export const pixelRatio = writable(window.devicePixelRatio);
export const width = writable(window.innerWidth);
export const height = writable(window.innerHeight);

export const players: Writable<{ [id: string]: Dummy }> = writable({});

export const props = deriveObject({
	context,
	canvas,
	width,
	height,
	pixelRatio,
	time,
});

export const key = Symbol();

export const renderable = (render) => {
	const api: any = getContext(key);

	const element = {
		ready: false,
		mounted: false,
		render: null,
		setup: null,
	};
	if (typeof render === 'function') element.render = render;
	else if (render) {
		if (render.render) element.render = render.render;
		if (render.setup) element.setup = render.setup;
	}

	api.add(element);
	onMount(() => {
		element.mounted = true;
		return () => {
			api.remove(element);
			element.mounted = false;
		};
	});
};

function deriveObject(obj) {
	const keys = Object.keys(obj);
	const list = keys.map((key) => {
		return obj[key];
	});
	return derived(list, (array) => {
		return array.reduce((dict, value, i) => {
			dict[keys[i]] = value;
			return dict;
		}, {});
	});
}
