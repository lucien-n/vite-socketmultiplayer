export class InputHandler {
	keys: Array<string>;
	controls: Array<string>;
	constructor() {
		this.keys = [];
		this.controls = ['z', 'q', 's', 'd'];
		window.addEventListener('keydown', (e) => {});

		window.addEventListener('keyup', (e) => {});
	}

	keyDown(key: string) {
		key = key.toLowerCase();
		if (this.controls.includes(key) && !this.pressed(key)) {
			this.press(key);
		}
	}

	keyUp(key: string) {
		key = key.toLowerCase();
		if (this.controls.includes(key)) {
			this.release(key);
		}
	}

	pressed(key: string) {
		return this.keys.indexOf(key) !== -1;
	}

	press(key: string) {
		this.keys.push(key);
	}

	release(key: string) {
		this.keys.splice(this.keys.indexOf(key), 1);
	}
}
