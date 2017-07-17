var Game = function() {
	// Set the width and height of the scene.
	this._width = 1280;
	this._height = 720;
	this.fog = {};

	// Setup the rendering surface.
	this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
	document.body.appendChild(this.renderer.view);

	// Create the main stage to draw on.
	this.container = new PIXI.Container();

	// Start running the game.
	this.build();
};

Game.prototype = {
	/**
	 * Build the scene and begin animating.
	 */
	 build: function() {
	 	// Draw the star-field in the background.
	 	this.drawTileMap();

	 	// Draw the fog
	 	this.drawFog()

	 	// Setup the boundaries of the game's arena.
	 	this.setupBoundaries();

	 	// Begin the first frame.
	 	requestAnimationFrame(this.tick.bind(this));
	 },

	 /**
	 * Draw the fog of war onto the maco
	 */
	drawFog: function() {
		this.fog = new FogWrapper(this.container);
	},

	/**
	 * Draw the field of stars behind all of the action.
	 */
	drawTileMap: function() {
		// Draw randomly positioned stars.
		for(var i = 0; i < 1500; i++) {
			// Generate random parameters for the stars.
			var x = Math.round(Math.random() * this._width);
			var y = Math.round(Math.random() * this._height);
			var rad = Math.ceil(Math.random() * 2);
			var alpha = Math.min(Math.random() * 0.25, 1);

			// Draw the star.
			var star = new PIXI.Graphics();
			star.beginFill(0xFFFFFF, alpha);
			star.drawCircle(x, y, rad);
			star.endFill();

			// Attach the star to the stage.
			this.container.addChild(star);
		}
	},

	/**
	 * Draw the boundaries of the space arena.
	 */
	setupBoundaries: function() {
		var walls = new PIXI.Graphics();
		walls.beginFill(0xFFFFFF, 0.5);
		walls.drawRect(0, 0, this._width, 10);
		walls.drawRect(this._width - 10, 10, 10, this._height - 10);
		walls.drawRect(0, this._height - 10, this._width, 10);
		walls.drawRect(0, 10, 10, this._height - 20);

		// Attach the walls to the stage.
		this.container.addChild(walls);
	},

	/**
	 * Fires at the end of the gameloop to reset and redraw the canvas.
	 */
	tick: function() {
		// Render the stage for the current frame.
		this.renderer.render(this.container);

		// Begin the next frame.
		requestAnimationFrame(this.tick.bind(this));
	}
};