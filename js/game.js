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
	// Create the main stage to draw on.
	this.container = new PIXI.Container();

	this.build();
};

Game.prototype = {
	/**
	 * Build the scene and begin animating.
	 */
	build: function() {
		// Create loading bar
		// this.setupLoadingBar();

		var loadScreen = document.getElementById('loading-screen');
		var gameStage = document.getElementById('game-stage');

		document.addEventListener('loaded', function(e) {
			console.log('LOADED!!!');
			setTimeout(function() {
				loadScreen.style.display = 'none';
				gameStage.style.display = 'block';
			}, 3000);
		}.bind(this));

		var ensureDOMisLoaded = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				clearInterval(ensureDOMisLoaded);
				// Setup the boundaries of the game's arena.
				this.setupBoundaries();

				// TODO:  Send to webworker
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

				// Begin the first frame.
				requestAnimationFrame(this.tick.bind(this));
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
	},

	/**
	 * Creates the tile map and terrain on which the game is played.
	 */
	createTileMap: function() {
		this.honeycomb = new MapWrapper(this._center);
		this.honeycomb.init();
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
	 * Draws the tile map onto the stage.
	 */
	drawTileMap: function() {
		this.container.addChild(this.honeycomb.container);
		// Removes the loading bar and triggers the fog drawing iteration
		this.container.removeChild(this.loadingBar.container);
		this.isLoaded = true;
		// Calls out to turn off loading screen
		var event = new Event('loaded');
    	document.dispatchEvent(event);
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
	},

	/**
	 * Draw the loading bar and activate progress listeners.
	 */
	setupLoadingBar: function() {
		this.loadingBar = new LoadingBarWrapper(this._center);
		this.loadingBar.init();
		this.container.addChild(this.loadingBar.container);
	},

	/**
	 * Fires at the end of the gameloop to reset and redraw the canvas.
	 */
	tick: function() {
		this.tickCounter++;
		// Render the stage for the current frame.
		this.renderer.render(this.container);
		//Update Fog Sprite creation for overlay
		// Dev Mode: comment next line for fog off
		if(this.isLoaded) {
			this.fog.renderFog();
		}
		// Begin the next frame.
		requestAnimationFrame(this.tick.bind(this));
	}
};