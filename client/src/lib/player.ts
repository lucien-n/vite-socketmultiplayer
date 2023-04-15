export class Player {
	prev_x: number;
	prev_y: number;
	x: number;
	y: number;
	speed: number;

	width: number;
	height: number;

	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 50;
		this.height = 50;
		this.speed = 3;
	}

	update(keys: Array<string>) {
		this.prev_x = this.x;
		this.prev_y = this.y;

		if (keys.includes('z')) {
			this.y -= this.speed;
		}
		if (keys.includes('q')) {
			this.x -= this.speed;
		}
		if (keys.includes('s')) {
			this.y += this.speed;
		}
		if (keys.includes('d')) {
			this.x += this.speed;
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

export class DummyPlayer {
	id: string;

	x: number;
	y: number;

	width: number;
	height: number;

	constructor(socket_id: string) {
		this.id = socket_id;
		this.x = 0;
		this.y = 0;
		this.width = 50;
		this.height = 50;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}
