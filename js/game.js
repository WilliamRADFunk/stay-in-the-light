/*
Stay in the Light v0.0.8
Last Updated: September-09
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/
// Wraps the Game object to prevent anyone from accessing its functions, or variables.
var GameWrapper = function() {
	var Game = function() {
		/*
		 * Variables global to the game object. Only accessible inside game's subunits
		 * if passed into the subunit's create function or various public functions.
		 */

		// Create the main stage to draw on.
		this.container = new PIXI.Container();
		// Create the loading bar stage to draw on.
		this.containerForLoadingBar = new PIXI.Container();
		// Create the loading bar stage to draw on.
		this.containerForStartScreen = new PIXI.Container();
		// Difficulty value. 1 => Easy. 2 => Normal. 3 => Extreme
		this.difficulty = 1;
		// Enemies array
		this.enemies = [];
		// Fog of war object
		this.fog = {};
		// Tile map object
		this.honeycomb = {};
		// Flag to see if loading is done.
		this.isLoaded = false;
		// Loading Bar object
		this.loadingBar = {};
		// Used when an incremental stage of loading is completed.
		this.loadingCallback;
		// Start Screen object
		this.startScreen = {};
		// Keep track of ticks passed to mod for timing.
		this.tickCounter = 0;
		// Set the width and height of the scene.
		this._width = 1280;
		this._height = 720;
		this._center = {
			x: this._width / 2,
			y: this._height / 2,
		};
		
		/*
		 * Variables global to the game object that require the established values above,
		 * but otherwise the same description applies as the above.
		 */

		// Setup the rendering surface for main game scene.
		this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
		this.renderer.transparent = true;
		document.getElementById('game-stage').appendChild(this.renderer.view);
		// Setup the rendering surface for loading bar scene
		this.rendererForLoadingBar = new PIXI.CanvasRenderer(this._width, this._height);
		this.rendererForLoadingBar.transparent = true;
		document.getElementById('loading-stage').appendChild(this.rendererForLoadingBar.view);
		// Setup the rendering surface for loading bar scene
		this.rendererForStartScreen = new PIXI.CanvasRenderer(this._width, this._height);
		this.rendererForStartScreen.transparent = true;
		document.getElementById('start-stage').appendChild(this.rendererForStartScreen.view);

		/*
		 * Function call that sets everything in motion, launching the start screen.
		 */
		this.start();
	};

	Game.prototype = {
		/**
		 * Build the scene and begin animating.
		 */
		build: function() {
			// Create loading bar
			this.setupLoadingBar();

			// Waits until everything on the DOM has been properly loaded.
			var ensureDOMisLoaded = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(ensureDOMisLoaded);

					// Gives the loading progress from setupBoundaries to show on loading bar
					setTimeout(function() {
						// Setup the boundaries of the game's arena.
						this.setupBoundaries();

						// Gives the loading progress from setupBoundaries to show on loading bar
						setTimeout(function() {
							// Create the tilemap, terrain, and linking.
							this.createTileMap();

							// Gives the loading progress from createTileMap to show on loading bar
							setTimeout(function() {
								// Create an enemy and place it on the map
								this.createEnemies();

								// Gives the loading progress from createEnemies to show on loading bar
								setTimeout(function() {
									// Draw the fog
									// Dev Mode: comment next line for fog off
									this.drawFog();
									// Dev Mode: for fog off
									// this.honeycomb.expand();

									// Attaches the tilemap to container
									this.drawTileMap();

									// Calls out to turn off loading screen
									var loadingStage = document.getElementById('loading-stage');
									var gameStage = document.getElementById('game-stage');

									this.loadingBar.drawLoadingBarProgress(0, true);
									this.rendererForLoadingBar.render(this.containerForLoadingBar);

									// Gives the loading progress from drawFog and drawTileMap to show on loading bar
									setTimeout(function() {
										loadingStage.style.display = 'none';
										gameStage.style.display = 'block';

										// Begin the first frame.
										requestAnimationFrame(this.tick.bind(this));
									}.bind(this), 2000);

								}.bind(this), 2000);
							}.bind(this), 2000);
						}.bind(this), 2000);
					}.bind(this), 2000);
				}
			}.bind(this), 20);
		},

		/**
		 * Picks suitable place on tilemap to place enemies
		 */
		createEnemies: function() {
			// Sets up variables and function definitions
			var enemy = new EnemyWrapper(this._center, this.honeycomb);
			// Move loading bar progress by a small degree.
			this.loadingCallback(5);
			// Places enemy unit on board and creates his attributes.
			enemy.init();
			this.enemies.push(enemy);
			// Move loading bar progress by a small degree.
			this.loadingCallback(5);
		},

		/**
		 * Creates the tile map and terrain on which the game is played.
		 */
		createTileMap: function() {
			// Sets up variables and function definitions
			this.honeycomb = new MapWrapper(this._center);
			// Move loading bar progress by a small degree.
			this.loadingCallback(5);
			// Runs through actual terrain build and recursive checks.
			this.honeycomb.init();
			// Move loading bar progress by a small degree.
			this.loadingCallback(40);
		},

		/**
		 * Draw the fog of war onto the maco
		 */
		drawFog: function() {
			// Sets up variables and function definitions
			this.fog = new FogWrapper(this.container, this._center, this.honeycomb.container, this.renderer);
			// Move loading bar progress by a small degree.
			this.loadingCallback(5);
			// Loads fog as mask to main container.
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
			this.loadingCallback(15);
		},

		/**
		 * Draws the tile map onto the stage.
		 */
		drawTileMap: function() {
			this.container.addChild(this.honeycomb.container);
			this.isLoaded = true;
			this.honeycomb.addPlayer();
		},

		/**
		 * Draw the boundaries of the tile mapped world.
		 */
		setupBoundaries: function(stage=0, color=0xFFFFFF) {
			var walls = new PIXI.Graphics();
			walls.beginFill(color, 0.5);
			walls.drawRect(0, 0, this._width, 10);
			walls.drawRect(this._width - 10, 10, 10, this._height - 10);
			walls.drawRect(0, this._height - 10, this._width, 10);
			walls.drawRect(0, 10, 10, this._height - 20);
			walls.endFill();
			// Attach the walls to the stage.
			if(stage === 1) {
				this.containerForLoadingBar.addChild(walls);
			} else if(stage === 2) {
				this.containerForStartScreen.addChild(walls);
			} else {
				this.container.addChild(walls);
				// Move loading bar progress by a small degree.
				this.loadingCallback(20);
			}
		},

		/**
		 * Draw the loading bar and activate progress listeners.
		 */
		setupLoadingBar: function() {
			this.loadingBar = new LoadingBarWrapper(this._center);
			this.loadingBar.init();
			this.containerForLoadingBar.addChild(this.loadingBar.container);

			var loadingStage = document.getElementById('loading-stage');
			var gameStage = document.getElementById('game-stage');

			this.loadingCallback = function(amount) {
				this.loadingBar.drawLoadingBarProgress(amount);
				this.rendererForLoadingBar.render(this.containerForLoadingBar);
			}.bind(this);

			this.loadingBar.drawBaseLoadingBar();
			this.setupBoundaries(1, 0xCFB53B);
			this.rendererForLoadingBar.render(this.containerForLoadingBar);

			// Move loading bar progress by a small degree.
			this.loadingCallback(15);
		},

		/**
		 * Draws the start screen and animates until player clicks play.
		 */
		start: function() {
			this.startScreen = new StartScreenWrapper(this._center);
			this.startScreen.init();
			this.containerForStartScreen.addChild(this.startScreen.container);
			this.setupBoundaries(2, 0xCFB53B);
			this.rendererForStartScreen.render(this.containerForStartScreen);

			var interval = 2000;
			var flickeringInterval = function() {
	        	clearInterval(flickeringLightsInterval);

				this.startScreen.drawStartScreenWords();
				this.rendererForStartScreen.render(this.containerForStartScreen);

				if(interval === 2000) {
					interval = 150;
				} else if(interval === 150) {
					interval = 100;
				} else if(interval === 100) {
					interval = 105;
				} else {
					interval = 2000;
				}

				flickeringLightsInterval = setInterval(flickeringInterval, interval);
			}.bind(this);


			var flickeringLightsInterval = setInterval(flickeringInterval, interval);

			this.startScreen.drawOptions();
			this.rendererForStartScreen.render(this.containerForStartScreen);

			// Detects when the mouse moves and calculates which hex-rant player is hovering over.
			var mouseMoveHandler = function(e) {
				var mX = e.pageX;
				var mY = e.pageY;
				if(mX >= 10 && mX <= 1270) {
					if(mY >= 400 && mY <= 420) {
						this.startScreen.drawOptions(0);
					} else if(mY >= 420 && mY <= 480) {
						this.startScreen.drawOptions(1, this.difficulty, mX);
					} else if(mY >= 480 && mY <= 500) {
						this.startScreen.drawOptions(2);
					} else {
						this.startScreen.drawOptions();
					}
				} else {
					this.startScreen.drawOptions();
				}
				this.rendererForStartScreen.render(this.containerForStartScreen);
			}.bind(this);
			var mouseClickHandler = function(e) {
				var mX = e.pageX;
				var mY = e.pageY;
				if(mX >= 10 && mX <= 1270) {
					if(mY >= 400 && mY <= 420) {
						var loadingStage = document.getElementById('loading-stage');
						var startStage = document.getElementById('start-stage');
						startStage.style.display = 'none';
						loadingStage.style.display = 'block';
						// Removes click of mouse handler to make way for new one.
						document.removeEventListener('click', mouseClickHandler);
						// Removes move of mouse handler to make way for new one.
						document.removeEventListener('mousemove', mouseMoveHandler);
						// Start the actual game.
						this.build();
					} else if(mY > 420 && mY <= 480) {
						if(mX >= 800 && mX < 830) {
							this.difficulty = 1;
							mouseMoveHandler({pageX: mX, pageY: mY});
						} else if(mX >= 845 && mX < 875) {
							this.difficulty = 2;
							mouseMoveHandler({pageX: mX, pageY: mY});
						} else if(mX >= 890 && mX < 930) {
							this.difficulty = 3;
							mouseMoveHandler({pageX: mX, pageY: mY});
						}
					} else if(mY >= 480 && mY <= 500) {
						// this.startScreen.drawOptions(2);
					}
				}
			}.bind(this);
			// Captures click of mouse and passes on to handler.
			document.addEventListener('click', mouseClickHandler);
			// Captures movement of mouse and passes on to handler.
			document.addEventListener('mousemove', mouseMoveHandler);
		},

		/**
		 * Fires at the end of the gameloop to reset and redraw the canvas.
		 */
		tick: function() {
			this.tickCounter++;
			// Render the stage for the current frame.
			this.renderer.render(this.container);
			this.rendererForLoadingBar.render(this.containerForLoadingBar);
			this.rendererForStartScreen.render(this.containerForStartScreen);
			//Update Fog Sprite creation for overlay
			// Dev Mode: comment next line for fog off
			if(this.isLoaded) {
				this.fog.renderFog();
			}
			// Begin the next frame.
			requestAnimationFrame(this.tick.bind(this));
		}
	};
	// Sets the game in motion.
	var game = new Game();
};