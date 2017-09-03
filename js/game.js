/*
Stay in the Light v0.0.5
Last Updated: 2017-August-13
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/
var Game = function() {
	// Set the width and height of the scene.
	this._width = 1280;
	this._height = 720;
	this._center = {
		x: this._width / 2,
		y: this._height / 2,
	};
	// Enemies array
	this.enemies = [];
	// Fog of war object
	this.fog = {};
	// Tile map object
	this.honeycomb = {};
	this.counter = 0;

	// Setup the rendering surface.
	this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
	this.renderer.transparent = true;
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
		this.drawFog();

		// Setup the boundaries of the game's arena.
		this.setupBoundaries();

		// Create an enemy and place it on the map
		this.createEnemies();

		// Begin the first frame.
		requestAnimationFrame(this.tick.bind(this));

	},
	createEnemies: function() {
		var enemy = new EnemyWrapper(this._center, this.honeycomb);
		enemy.init();
		this.enemies.push(enemy);
	},

	/**
	 * Draw the fog of war onto the maco
	 */
	drawFog: function() {
		this.fog = new FogWrapper(this.container, this._center, this.honeycomb.container, this.renderer);
		this.fog.init();


		Mousetrap.bind('a', function(){
			this.fog.expand(this.honeycomb.getActiveCenter());
			this.honeycomb.expand();
		}.bind(this));


		Mousetrap.bind('d', function(){
			this.fog.contract(this.honeycomb.getActiveCenter());
			this.honeycomb.contract();
		}.bind(this));

		document.addEventListener('playerMove', function(e) {
			this.fog.move(this.honeycomb.getActiveCenter());
		}.bind(this));
	},

	/**
	 * Draw the field of stars behind all of the action.
	 */
	drawTileMap: function() {
		this.honeycomb = new MapWrapper(this._center);
		this.honeycomb.init();
		this.container.addChild(this.honeycomb.container);
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
		walls.endFill();

		// Attach the walls to the stage.
		this.container.addChild(walls);
	},

	/**
	 * Fires at the end of the gameloop to reset and redraw the canvas.
	 */
	tick: function() {
		// Render the stage for the current frame.
		this.renderer.render(this.container);
		//Update Fog Sprite creation for overlay
		this.fog.renderFog();
		// Begin the next frame.
		requestAnimationFrame(this.tick.bind(this));

		//LOOP to allow enemy to make a move
		// this.counter++;
		// if(this.counter > 300)
		// {
		// 	this.counter = 0;
		// 	this.enemies[0].takeTurn();
		// }
	}
};