/*
Stay in the Light v1.0.0
Last Updated: 2017-November-17
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
		// Create the timer stage to draw on.
		this.containerForTimer = new PIXI.Container();
		// Create the timer stage to draw on.
		this.containerForSoundMute = new PIXI.Container();
		// Create the loading bar stage to draw on.
		this.containerForLoadingBar = new PIXI.Container();
		// Create the start screen stage to draw on.
		this.containerForStartScreen = new PIXI.Container();
		// Create the game over stage to draw on.
		this.containerForGameOverScreen = new PIXI.Container();
		// Difficulty value. 1 => Easy. 2 => Normal. 3 => Extreme
		this.difficulty = 1;
		// Enemies array
		this.enemies = [];
		// Array of characters making up the player's name for scores.
		this.enterScoreInitials = [];
		// First time loading assets, prevents things like loading fog assets
		// to cache twice (causing collision).
		this.firstLoad = true;
		// Fog of war object
		this.fog = {};
		//sound object
		this.sound = {};
		//hover zone
		this.hoverArea = -1;
		//Indicates first frame of main game (tick)
		this.gameStart = false;
		// Don't render certain things if game is over.
		this.gameOver = false;
		// Game over screen object.
		this.gameOverScreen = {};
		// Tile map object
		this.honeycomb = {};
		// Flag to determine if timer should continue to count down.
		this.isCounting = true;
		// Flag to see if loading is done.
		this.isLoaded = false;
		// Flag to have sound playing or not
		this.isSound = true;
		// Did the player win.
		this.isWin = false;
		// Loading Bar object
		this.loadingBar = {};
		// Used when an incremental stage of loading is completed.
		this.loadingCallback;
		// If getScores fails, we assume there's a bad connect. Keep track of offline mode
		this.isOffline = true;
		// Score holder to be used for sending to db after a round.
		this.score = 0;
		// Start Screen object
		this.startScreen = {};
		// Keep track of ticks passed to mod for timing.
		this.tickCounter = 0;
		// Timer to show remaining game time.
		this.timer = {};
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
		// Setup the rendering surface for timer scene.
		this.rendererForTimer = new PIXI.CanvasRenderer(100, 50);
		this.rendererForTimer.transparent = false;
		document.getElementById('timer-stage').appendChild(this.rendererForTimer.view);
		// Setup the rendering surface for timer scene.
		this.rendererForSoundMute = new PIXI.CanvasRenderer(275, 20);
		this.rendererForSoundMute.transparent = false;
		document.getElementById('sound-mute-stage').appendChild(this.rendererForSoundMute.view);
		// Setup the rendering surface for loading bar scene
		this.rendererForLoadingBar = new PIXI.CanvasRenderer(this._width, this._height);
		this.rendererForLoadingBar.transparent = true;
		document.getElementById('loading-stage').appendChild(this.rendererForLoadingBar.view);
		// Setup the rendering surface for start menu scene
		this.rendererForStartScreen = new PIXI.CanvasRenderer(this._width, this._height);
		this.rendererForStartScreen.transparent = true;
		document.getElementById('start-stage').appendChild(this.rendererForStartScreen.view);
		// Setup the rendering surface for game over scene
		this.rendererGameOverScreen = new PIXI.CanvasRenderer(this._width, this._height);
		this.rendererGameOverScreen.transparent = true;
		document.getElementById('game-over-stage').appendChild(this.rendererGameOverScreen.view);

		this.requestAnimationFrame = (window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame).bind(window);

		this.cancelAnimationFrame = (window.cancelAnimationFrame || window.mozCancelAnimationFrame).bind(window);

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

			if(this.firstLoad) {
				document.addEventListener('playerDied', function(e) {
					this.isCounting = false;
					//End game music, call death Sound
					// this.sound.executeSound(0, true, false, false, 0.6);
					this.sound.executeSound(10, true, false, false, 0.6);
					this.sound.executeSound(1, false, true, true, 0.6);
					setTimeout(function() {
						this.endGame(false);
					}.bind(this), 6000);
				}.bind(this));
				document.addEventListener('playerWon', function(e) {
					this.isCounting = false;
					//End game music, play win sound
					this.sound.executeSound(7, true, false, false, 0.6);
					this.sound.executeSound(1, false, true, true, 0.6);
					setTimeout(function() {
						this.endGame(true);
					}.bind(this), 6000);
				}.bind(this));
			}

			// Create game over screen to be ready
			this.setupGameOver();

			// Waits until everything on the DOM has been properly loaded.
			var ensureDOMisLoaded = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(ensureDOMisLoaded);

					// Gives the loading progress from setupBoundaries time to show on loading bar
					setTimeout(function() {
						// Setup the boundaries of the game's arena.
						this.setupBoundaries();

						// Gives the loading progress from setupBoundaries time to show on loading bar
						setTimeout(function() {
							// Create the tilemap, terrain, and linking.
							this.createTileMap();

							// Gives the loading progress from createTileMap time to show on loading bar
							setTimeout(function() {
								// Create an enemy and place it on the map
								this.createEnemies();
								// Gives the loading progress from createEnemies time to show on loading bar
								setTimeout(function() {
									// Draw the fog
									// Dev Mode: comment next line for fog off
									if(!this.firstLoad) {
										this.fog.reset();
									}
									this.drawFog();
									// Dev Mode: for fog off
									// this.honeycomb.expand();

									// Attaches the tilemap to container
									this.drawTileMap();

									// Gets the timer going.
									this.createTimer();

									// Calls out to turn off loading screen
									var loadingStage = document.getElementById('loading-stage');
									var gameStage = document.getElementById('game-stage');
									var timerStage = document.getElementById('timer-stage');
									var soundMuteStage = document.getElementById('sound-mute-stage');

									this.loadingBar.drawLoadingBarProgress(0, true);
									this.rendererForLoadingBar.render(this.containerForLoadingBar);

									// Gives the loading progress from drawFog and drawTileMap time to show on loading bar
									setTimeout(function() {
										loadingStage.style.display = 'none';
										gameStage.style.display = 'block';
										timerStage.style.display = 'block';
										soundMuteStage.style.display = 'block';
										this.honeycomb.activateBoard();
										this.timer.startTimer();

										// Dev Mode: To auto-win the game, uncomment next 3 lines
										// setTimeout(function() {
										// 	this.honeycomb.autoLightAllTiles();
										// }.bind(this), 2000);

										// Begin the first frame.
										this.mainGameAniLoop = this.requestAnimationFrame(this.tick.bind(this));
									}.bind(this), 2000);

								}.bind(this), 2000);
							}.bind(this), 2000);
						}.bind(this), 2000);
					}.bind(this), 2000);
				}
			}.bind(this), 20);
		},

		/**
		 * Returns final game score.
		 */
		calculateScore: function() {
			this.score += this.timer.getTime() * this.difficulty * 500;
		},
		/**
		 * Picks suitable place on tilemap to place enemies
		 */
		createEnemies: function() {
			for(var i = 0; i < this.difficulty; i++) {
				// Sets up variables and function definitions
				var enemy = new EnemyWrapper(this._center, this.honeycomb, i);
				// Move loading bar progress by a small degree.
				this.loadingCallback(5);
				// Places enemy unit on board and creates his attributes.
				enemy.init();
				this.enemies.push(enemy);
			}
			document.addEventListener('enemyDied', function(e) {
				for(var i = 0; i < this.enemies.length; i++) {
					if(this.enemies[i].id === e.enemyId) {
						this.enemies.splice(i, 1);
						//Play enemy death sound
						this.sound.executeSound(5, true, false, false, 0.6);
						break;
					}
				}
				e.stopPropagation();
			}.bind(this));
			// Move loading bar progress by a small degree.
			this.loadingCallback(5);
		},

		/**
		 * Creates the tile map and terrain on which the game is played.
		 */
		createTileMap: function() {
			// Sets up variables and function definitions
			this.honeycomb = new MapWrapper(this._center, this.difficulty);
			// Move loading bar progress by a small degree.
			this.loadingCallback(5);
			// Runs through actual terrain build and recursive checks.
			this.honeycomb.init();
			// Move loading bar progress by a small degree.
			this.loadingCallback(40);
		},

		/**
		 * Creates the timer.
		 */
		createTimer: function() {
			// Sets up variables and function definitions
			this.timer = new TimerWrapper(this._center);
			// Runs through actual terrain build and recursive checks.
			this.timer.init();
			// Adds timerWrapped object to the timer specific container.
			this.containerForTimer.addChild(this.timer.container);
			this.containerForSoundMute.addChild(this.timer.containerMute);
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
				if(this.honeycomb.getBoardActivityStatus()) {
					this.fog.expand(this.honeycomb.getActiveCenter());
					this.honeycomb.expand();
					this.sound.executeSound(2, true, false, false, 0.4);
				}
			}.bind(this));

			Mousetrap.bind('d', function(){
				if(this.honeycomb.getBoardActivityStatus()) {
					this.fog.contract(this.honeycomb.getActiveCenter());
					this.honeycomb.contract();
					this.sound.executeSound(3, true, false, false, 0.6);
				}
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
		 * Gets top-five scores (arcade-style)
		 */
		getScores: function() {
			this.startScreen.getScores();
		},		

		/**
		 * Draws the game over screen and animates until player clicks mouse.
		 */
		end: function() {
			//Play Game over Music
			this.sound.executeSound(9, true, true, false, 0.3);
			this.setupBoundaries(3, 0xCFB53B);

			var interval = 2000;
			var flickeringInterval = function() {
	        	clearInterval(flickeringLightsInterval);

				if(this.gameOverScreen && typeof this.gameOverScreen.drawGameOverScreenWords === 'function') {
					this.gameOverScreen.drawGameOverScreenWords();
				}

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

			var handleKeys = function(e)
			{
				if(this.isWin && this.enterScoreInitials !== null && this.enterScoreInitials.length >= 0
					&& ((e.keyCode >= 65 && e.keyCode <= 122) || (e.which >= 65 && e.which <= 122) || (e.keyCode === 32 || e.which === 32))) {
					if(!this.isOffline && this.enterScoreInitials.length < 10 && typeof this.gameOverScreen.changeName === 'function')
					{
						this.sound.executeSound(4, true, false, false, 0.6);
						this.enterScoreInitials.push(e.keyCode ? String.fromCharCode(e.keyCode).toUpperCase() : String.fromCharCode(e.which).toUpperCase());
						this.gameOverScreen.changeName(this.enterScoreInitials);
					}
				} else if(this.isWin && this.enterScoreInitials !== null && this.enterScoreInitials.length >= 0
					&& ((e.keyCode === 46 || e.which === 46) || (e.keyCode === 8 || e.which === 8))) {
					if(!this.isOffline && typeof this.gameOverScreen.changeName === 'function')
					{
						this.sound.executeSound(4, true, false, false, 0.6);
						this.enterScoreInitials.pop();
						this.gameOverScreen.changeName(this.enterScoreInitials);
					}
				}
			}.bind(this);

			var mouseClickHandler = function(e) {
				if(this.isWin && !this.isOffline && this.enterScoreInitials !== null && this.enterScoreInitials.length >= 0) {
					clearInterval(flickeringLightsInterval);
					// Removes listeners to make way for new ones.
					document.removeEventListener('keyup', handleKeys);
					document.removeEventListener('click', mouseClickHandler);
					if(typeof this.gameOverScreen.killProcesses === 'function') {
						//Kill menu loop music
						this.sound.executeSound(9, false, false, false, 0.3);
						this.gameOverScreen.killProcesses();
					}
					this.sendScore(this.enterScoreInitials);
				} else {
					if(this.gameOverAniLoop) {
						//kill GameOver Music
						this.sound.executeSound(9, false, true, false, 0.6);
						var id = this.cancelAnimationFrame(this.gameOverAniLoop);
						this.gameOverAniLoop = undefined;
					}
					// Removes listeners to make way for new ones.
					document.removeEventListener('keyup', handleKeys);
					document.removeEventListener('click', mouseClickHandler);
					if(typeof this.gameOverScreen.killProcesses === 'function') {
						this.gameOverScreen.killProcesses();
					}
					var gameOverStage = document.getElementById('game-over-stage');
					var startStage = document.getElementById('start-stage');
					gameOverStage.style.display = 'none';
					startStage.style.display = 'block';
					// Destroy old game over content.
					this.gameOverScreen = {};
					this.containerForGameOverScreen = new PIXI.Container();
					this.gameOver = false;
					this.firstLoad = false;
					// Return to start screen.
					this.start();
				}
			}.bind(this);

			// Captures click of mouse and passes on to handler.
			setTimeout(function() {
				document.addEventListener('keyup', handleKeys, false);
				document.addEventListener('click', mouseClickHandler, false);
			}, 1000);

			// Begin the first frame.
			this.gameOverAniLoop = this.requestAnimationFrame(this.tickGameOverScreen.bind(this));
		},

		/**
		 * Goes through end game sequence
		 */
		endGame: function(isWin) {
			Mousetrap.unbind('a');
			Mousetrap.unbind('d');
			this.isWin = isWin;
			this.gameStart = false;
			this.sound.executeSound(1, false, true, true, 0.3);
			if(this.isWin) {
				this.calculateScore();
				this.gameOverScreen.setScore(this.score);
			}
			this.gameOver = true;
			document.getElementById('game-stage').style.display = 'none';
			document.getElementById('game-over-stage').style.display = 'block';
			if(this.mainGameAniLoop) {
				var id = this.cancelAnimationFrame(this.mainGameAniLoop);
				this.mainGameAniLoop = undefined;
			}
			this.end();
		},

		/*
		 * Sends the users name to score db
		 */
		sendScore: function()
		{
			if(this.enterScoreInitials && this.enterScoreInitials.length)
			{
				var scorePackage = {
					initials: '',
					score: this.score
				};
				for(var i = 0; i < this.enterScoreInitials.length; i++) {
					scorePackage.initials += this.enterScoreInitials[i];
				}
				for(var i = 0; i < 10 - this.enterScoreInitials.length; i++) {
					scorePackage.initials += ' ';
				}
			}

			$.ajax({
				type:'POST',
				url:'https://tenaciousteal.com/games/stay-in-the-light/actions/insert.php',
				data: JSON.stringify(scorePackage),
				contentType:'application/x-www-form-urlencoded; charset=utf-8',
				dataType:'text',
				crossDomain: true,
				async: true,
				success:function(data)
				{
					if(window.DEBUG_MODE) { console.log(data); }
					restart();
				},
				error:function(error)
				{
					if(window.DEBUG_MODE) { console.log(error); }
					this.isOffline = true;
				}
			});

			var restart = function() {
				if(this.gameOverAniLoop) {
					var id = this.cancelAnimationFrame(this.gameOverAniLoop);
					this.gameOverAniLoop = undefined;
				}
				var gameOverStage = document.getElementById('game-over-stage');
				var startStage = document.getElementById('start-stage');
				gameOverStage.style.display = 'none';
				startStage.style.display = 'block';
				// Destroy old game over content.
				this.gameOverScreen = {};
				this.containerForGameOverScreen = new PIXI.Container();
				this.gameOver = false;
				this.firstLoad = false;
				// Return to start screen.
				this.start();
			}.bind(this);
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
			} else if(stage === 3) {
				this.containerForGameOverScreen.addChild(walls);
			} else {
				this.container.addChild(walls);
				// Move loading bar progress by a small degree.
				this.loadingCallback(20);
			}
		},

		/**
		 * Prepares the game over screen for immediate use when game ends
		 */
		setupGameOver: function() {
			this.gameOverScreen = new GameOverScreenWrapper(this._center);
			this.gameOverScreen.init();
			this.containerForGameOverScreen.addChild(this.gameOverScreen.container);

			this.gameOverScreen.toggleOffline(this.isOffline);

			// Move loading bar progress by a small degree.
			this.loadingCallback(10);
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
			// Sets up ability to toggle sound on and off.
			if(this.firstLoad) {
				// Initialize sound object for sound playing (Potential delay here?)
				this.sound = new SoundWrapper();
				this.sound.init();
			}

			this.startScreen = new StartScreenWrapper(this._center);
			this.startScreen.init();
			this.containerForStartScreen.addChild(this.startScreen.container);
			this.setupBoundaries(2, 0xCFB53B);

			this.startScreen.getScores();
			// Sets up ability to toggle sound on and off.
			if(this.firstLoad) {
				document.addEventListener('toggleSound', function(e) {
					this.isSound = !this.isSound;
					// User toggles sound.
					if(this.isSound) {
						this.sound.unMuteSounds();
					} else {
						this.sound.muteSounds();
					}
				}.bind(this));
				Mousetrap.bind('*', function(){
					var event = new Event('toggleSound');
    				document.dispatchEvent(event);
				}.bind(this));
				document.addEventListener('onlineDetected', function(e) {
					this.isOffline = false;
					if(this.startScreen && typeof this.startScreen.toggleOffline === 'function') {
						this.startScreen.toggleOffline(this.isOffline);
					}
					if(this.gameOverScreen && typeof this.gameOverScreen.toggleOffline === 'function') {
						this.gameOverScreen.toggleOffline(this.isOffline);
					}
				}.bind(this));
				document.addEventListener('offlineDetected', function(e) {
					this.isOffline = true;
					if(window.DEBUG_MODE) { console.log('offline Detected'); }
					if(this.startScreen && typeof this.startScreen.toggleOffline === 'function') {
						this.startScreen.toggleOffline(this.isOffline);
					}
					if(this.gameOverScreen && typeof this.gameOverScreen.toggleOffline === 'function') {
						this.gameOverScreen.toggleOffline(this.isOffline);
					}
				}.bind(this));
			}

			//Start Main menu music
			this.sound.executeSound(6, true, true, false, 0.1);

			var interval = 2000;
			var flickeringInterval = function() {
	        	clearInterval(flickeringLightsInterval);

				this.startScreen.drawStartScreenWords();

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

			var newHoverDetector = function(buttonArea){
				if(this.hoverArea !== buttonArea && buttonArea !== 3){
					this.sound.executeSound(8, true, false, false, 0.8);
					this.hoverArea = buttonArea;
				} else if(buttonArea === 3) {
					this.hoverArea = buttonArea;
				}
			}.bind(this);
			// Detects when the mouse moves and calculates which start screen option player is hovering over.
			var mouseMoveHandler = function(e) {
				var mX = e.pageX;
				var mY = e.pageY;
				if(mX >= 10 && mX <= 1270) {
					if(mY >= 300 && mY <= 425) {
						this.startScreen.drawOptions(0);
						newHoverDetector(0);
					} else if(mY >= 430 && mY <= 505) {
						this.startScreen.drawOptions(1, this.difficulty, mX);
						newHoverDetector(1);
					} else if(mY >= 505 && mY <= 700) {
						this.startScreen.drawOptions(2);
						newHoverDetector(2);
					} else {
						this.startScreen.drawOptions();
						newHoverDetector(3);
					}
				} else {
					this.startScreen.drawOptions();
				}
			}.bind(this);
			var mouseClickHandler = function(e) {
				var mX = e.pageX;
				var mY = e.pageY;
				if(mX >= 10 && mX <= 1270) {
					if(mY >= 300 && mY <= 425) {
						if(this.startScreenAniLoop) {
							this.sound.executeSound(4, true, false, false, 0.6);
							var id = this.cancelAnimationFrame(this.startScreenAniLoop);
							this.startScreenAniLoop = undefined;
						}
						clearInterval(flickeringLightsInterval);
						// Removes click of mouse handler to make way for new one.
						document.removeEventListener('click', mouseClickHandler);
						// Removes move of mouse handler to make way for new one.
						document.removeEventListener('mousemove', mouseMoveHandler);
						if(typeof this.startScreen.killProcesses === 'function') {
							//Kill menu loop music
							this.sound.executeSound(6, false, false, false, 0.1);
							this.startScreen.killProcesses();
						}
						var loadingStage = document.getElementById('loading-stage');
						var startStage = document.getElementById('start-stage');
						startStage.style.display = 'none';
						loadingStage.style.display = 'block';
						// Destroy the old start screen before moving on.
						this.startScreen = {};
						this.containerForStartScreen = new PIXI.Container();
						// Destroy the old loading bar screen before moving on.
						this.loadingBar = {};
						this.containerForLoadingBar = new PIXI.Container();
						// Destroy the old everything else before moving on.
						this.container = new PIXI.Container();
						this.containerForTimer = new PIXI.Container();
						this.containerForSoundMute = new PIXI.Container();
						this.enemies = [];
						// Cleans up tilemap related event listeners
						if(this.honeycomb.playerIsAlive !== undefined) {
							this.honeycomb.destroy();							
						}
						this.honeycomb = {};
						this.isCounting = true;
						this.isLoaded = false;
						this.isWin = false;
						this.loadingCallback = null;
						this.score = 0;
						this.timer = {};
						// Start the actual game.
						this.build();
					} else if(mY > 435 && mY <= 505) {
						//Play click sound
						this.sound.executeSound(4, true, false, false, 0.6);
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
					}
				}
			}.bind(this);

			setTimeout(function() {
				// Captures click of mouse and passes on to handler.
				document.addEventListener('click', mouseClickHandler, false);
				// Captures movement of mouse and passes on to handler.
				document.addEventListener('mousemove', mouseMoveHandler, false);
			}, 500);

			// Begin the first frame.
			this.startScreenAniLoop = this.requestAnimationFrame(this.tickStartScreen.bind(this));
		},

		/**
		 * Fires at the end of the gameloop to reset and redraw the canvas.
		 */
		tick: function() {
			this.tickCounter++;
			// Render the stage for the current frame.
			this.renderer.render(this.container);
			this.rendererForLoadingBar.render(this.containerForLoadingBar);
			// Render the timer stage on top of the game stage.
			this.rendererForTimer.render(this.containerForTimer);
			this.rendererForSoundMute.render(this.containerForSoundMute);
			//Update Fog Sprite creation for overlay
			// Dev Mode: comment next 3 lines for fog off
			if(!this.gameStart){
				this.gameStart = true;
				//Start game loop music
				this.sound.executeSound(1, true, true, false, 0.3);
			}

			if(this.isLoaded) {
				this.fog.renderFog();
			}
			var enemySpeedModifier = 130 - ((this.difficulty + this.fog.getExpansionLevel() + 1) * 10);
			if((this.tickCounter % enemySpeedModifier) === 0) {
				for(var i = 0; i < this.enemies.length; i++) {
					this.enemies[i].takeTurn();
				}
			}
			// Updates the HUD game timer used both for scoring and ending game when it runs out.
			if(this.tickCounter % 60 === 0 && this.isCounting) {
				this.timer.tickTimer();
			}

			if(!this.gameOver) {
				// Begin the next frame.
				this.mainGameAniLoop = this.requestAnimationFrame(this.tick.bind(this));
			}

			if(this.tickCounter % 2 === 0 && !this.isCounting){
				//Decrease fog to oblivion
				this.fog.expandControled(this.honeycomb.getActiveCenter(), 3);
			}
			// Move all animations forward one tick.
			this.honeycomb.runAnimations();
		},

		/**
		 * Fires at the end of the gameloop to reset and redraw the canvas.
		 */
		tickGameOverScreen: function() {
			if(this.gameOver) {
				// Render the stage for the current frame.
				this.rendererGameOverScreen.render(this.containerForGameOverScreen);
				// Begin the next frame.
				this.gameOverAniLoop = this.requestAnimationFrame(this.tickGameOverScreen.bind(this));
			}
		},

		/**
		 * Fires at the end of the gameloop to reset and redraw the canvas.
		 */
		tickStartScreen: function() {
			// Render the stage for the current frame.
			this.rendererForStartScreen.render(this.containerForStartScreen);
			// Begin the next frame.
			this.startScreenAniLoop = this.requestAnimationFrame(this.tickStartScreen.bind(this));
		}
	};
	// Sets the game in motion.
	var game = new Game();
};