import { writable } from 'svelte/store';

export const canvas = writable(null);
export const context = writable(null);
export const time = writable(0);
export const pixelRatio = writable(window.devicePixelRatio);
export const width = writable(window.innerWidth);
export const height = writable(window.innerHeight);
