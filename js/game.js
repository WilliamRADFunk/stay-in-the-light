/*
Stay in the Light v0.0.7
Last Updated: September-04
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
	// Keep track of ticks passed to mod for timing.
	this.tickCounter = 0;
	// Loading Bar object
	this.loadingBar = {};
	// Flag to see if loading is done.
	this.isLoaded = false;
	// Enemies array
	this.enemies = [];
	// Fog of war object
	this.fog = {};
	// Tile map object
	this.honeycomb = {};

	// Setup the rendering surface.
	this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
	this.renderer.transparent = true;
	document.getElementById('game-stage').appendChild(this.renderer.view);
	// Setup the rendering surface.
	this.renderer2 = new PIXI.CanvasRenderer(this._width, this._height);
	this.renderer2.transparent = true;
	document.getElementById('loading-stage').appendChild(this.renderer2.view);
	// Create the main stage to draw on.
	this.container = new PIXI.Container();
	// Create the main stage to draw on.
	this.container2 = new PIXI.Container();
	// Used when an incremental stage of loading is completed.
	this.loadingEvent = new Event('loading');

	this.build();
};

Game.prototype = {
	/**
	 * Build the scene and begin animating.
	 */
	build: function() {
		// Create loading bar
		this.setupLoadingBar();

		var ensureDOMisLoaded = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				clearInterval(ensureDOMisLoaded);
				// Setup the boundaries of the game's arena.
				this.setupBoundaries();

				// Create the tilemap, terrain, and linking.
				this.createTileMap();

				// Create an enemy and place it on the map
				this.createEnemies();

				// Draw the fog
				// Dev Mode: comment next line for fog off
				this.drawFog();
				// Dev Mode: for fog off
				// this.honeycomb.expand();

				// Attaches the tilemap to container
				this.drawTileMap();

				// Calls out to turn off loading screen
				var event = new Event('loaded');
				document.dispatchEvent(event);
			}
		}.bind(this), 20);
	},

	/**
	 * Picks suitable place on tilemap to place enemies
	 */
	createEnemies: function() {
		var enemy = new EnemyWrapper(this._center, this.honeycomb);
		enemy.init();
		this.enemies.push(enemy);
		// Move loading bar progress by a small degree.
		document.dispatchEvent(this.loadingEvent);
	},

	/**
	 * Creates the tile map and terrain on which the game is played.
	 */
	createTileMap: function() {
		this.honeycomb = new MapWrapper(this._center);
		this.honeycomb.init();
		// Move loading bar progress by a small degree.
		document.dispatchEvent(this.loadingEvent);
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

		// Move loading bar progress by a small degree.
		document.dispatchEvent(this.loadingEvent);
	},

	/**
	 * Draws the tile map onto the stage.
	 */
	drawTileMap: function() {
		this.container.addChild(this.honeycomb.container);
		// Removes the loading bar and triggers the fog drawing iteration
		// this.container.removeChild(this.loadingBar.container);
		this.isLoaded = true;
		// Move loading bar progress by a small degree.
		document.dispatchEvent(this.loadingEvent);
	},

	/**
	 * Draw the boundaries of the tile mapped world.
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
		// Move loading bar progress by a small degree.
		document.dispatchEvent(this.loadingEvent);
	},

	/**
	 * Draw the loading bar and activate progress listeners.
	 */
	setupLoadingBar: function() {
		this.loadingBar = new LoadingBarWrapper(this._center);
		this.loadingBar.init();
		this.container2.addChild(this.loadingBar.container);

		var loadingStage = document.getElementById('loading-stage');
		var gameStage = document.getElementById('game-stage');

		document.addEventListener('loaded', function(e) {
			console.log('LOADED!!!');
			this.loadingBar.drawLoadingBarProgress(true);
			this.renderer2.render(this.container2);
			setTimeout(function() {
				loadingStage.style.display = 'none';
				gameStage.style.display = 'block';

				// Begin the first frame.
				requestAnimationFrame(this.tick.bind(this));
			}.bind(this), 2000);
		}.bind(this));

		document.addEventListener('loading', function(e) {
			console.log('loading!!!');
			this.loadingBar.drawLoadingBarProgress();
			this.renderer2.render(this.container2);
		}.bind(this));

		this.loadingBar.drawBaseLoadingBar();
		this.renderer2.render(this.container2);

		// Move loading bar progress by a small degree.
		document.dispatchEvent(this.loadingEvent);
	},

	/**
	 * Fires at the end of the gameloop to reset and redraw the canvas.
	 */
	tick: function() {
		this.tickCounter++;
		// Render the stage for the current frame.
		this.renderer.render(this.container);
		this.renderer2.render(this.container2);
		//Update Fog Sprite creation for overlay
		// Dev Mode: comment next line for fog off
		if(this.isLoaded) {
			this.fog.renderFog();
		}
		// Begin the next frame.
		requestAnimationFrame(this.tick.bind(this));
	}
};