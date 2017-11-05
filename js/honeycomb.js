/* 
Stay in the Light v0.0.24
Last Updated: 2017-November-04
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped tile map object
var MapWrapper = function(center, difficulty) {
	// Publicly accessible functionality.
	var tileMap = {};
	tileMap.playerIsAlive = true;

	/*** Internal Variables ***/
	var enemies = [];
	var playerWon = false;

	// Dev Mode: uncomment next line for forced enemy death
	// var tempCounter = 0;

	for(var i = 0; i < difficulty; i++) {
		// create a new Sprite from an image path
		var enemy1 = PIXI.Sprite.fromImage('./images/enemy_N.png');
		var enemy2 = PIXI.Sprite.fromImage('./images/enemy_NE.png');
		var enemy3 = PIXI.Sprite.fromImage('./images/enemy_SE.png');
		var enemy4 = PIXI.Sprite.fromImage('./images/enemy_S.png');
		var enemy5 = PIXI.Sprite.fromImage('./images/enemy_SW.png');
		var enemy6 = PIXI.Sprite.fromImage('./images/enemy_NW.png');

		// center the sprite's anchor point
		enemy1.anchor.set(0.5);
		enemy1.scale.x = 0.4;
		enemy1.scale.y = 0.4;
		enemy2.anchor.set(0.5);
		enemy2.scale.x = 0.4;
		enemy2.scale.y = 0.4;
		enemy3.anchor.set(0.5);
		enemy3.scale.x = 0.4;
		enemy3.scale.y = 0.4;
		enemy4.anchor.set(0.5);
		enemy4.scale.x = 0.4;
		enemy4.scale.y = 0.4;
		enemy5.anchor.set(0.5);
		enemy5.scale.x = 0.4;
		enemy5.scale.y = 0.4;
		enemy6.anchor.set(0.5);
		enemy6.scale.x = 0.4;
		enemy6.scale.y = 0.4;

		var enemyFaces = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];

		enemies.push(enemyFaces);
	}

	// create a new Sprite from an image path
	var player1 = PIXI.Sprite.fromImage('./images/player_N.png');
	var player2 = PIXI.Sprite.fromImage('./images/player_NE.png');
	var player3 = PIXI.Sprite.fromImage('./images/player_SE.png');
	var player4 = PIXI.Sprite.fromImage('./images/player_S.png');
	var player5 = PIXI.Sprite.fromImage('./images/player_SW.png');
	var player6 = PIXI.Sprite.fromImage('./images/player_NW.png');
	// center the sprite's anchor point
	player1.anchor.set(0.5);
	player1.scale.x = 0.4;
	player1.scale.y = 0.4;
	player2.anchor.set(0.5);
	player2.scale.x = 0.4;
	player2.scale.y = 0.4;
	player3.anchor.set(0.5);
	player3.scale.x = 0.4;
	player3.scale.y = 0.4;
	player4.anchor.set(0.5);
	player4.scale.x = 0.4;
	player4.scale.y = 0.4;
	player5.anchor.set(0.5);
	player5.scale.x = 0.4;
	player5.scale.y = 0.4;
	player6.anchor.set(0.5);
	player6.scale.x = 0.4;
	player6.scale.y = 0.4;

	var players = [player1, player2, player3, player4, player5, player6];
	var currentPlayerGraphic;

	var activeCenter = center;
	// Player's current tile. Used to determine directionality of mouse placement.
	var activeTile = null;
	// Contains an array of all tiles to better cycle through them (ie. remove hidden on all tiles).
	var allTiles = [];
	// Array of passable nodes. Used for quick check of game over, no islands, and win scenario.
	var freeNodes = [];
	// Prevents the procedural recursion from going too far.
	var hexDepth = 6;
	// Tracks current hextant player is hovering near
	var hextant = 4;
	// Keeps track if board is active and able to receive mouse input.
	var isBoardActive = false;
	// Keeps track of last mouse move event for the reuse of mouseMoveHandler.
	var lastMouseMoveEvent = {
		pageX: 600,
		pageY: 500
	};
	var level = 1;
	// Used to keep track of the nodes eligible for autofill during recursion.
	var nodesToBeFilled = [];
	// Prevents the procedural unhide recursion from going too far.
	var revealDepth = 1;
	// Hash table of all tiles in map.
	var tileTable = {};

	/*** Internal constructors ***/
	// Tile creator
	var Tile = function(cX, cY) {
		// Base tile.
		var hexagon = new PIXI.Graphics();
		// Additional opacity layer to highlight player's current tile.
		var hoverLayer = new PIXI.Graphics();
		// Additional border to show player's direction focus.
		var hoverLine = new PIXI.Graphics();
		// Additional hidden layer with opacity to partially conceal time.
		var hiddenLayer = new PIXI.Graphics();
		// Additional dark layer
		var darkLayer = new PIXI.Graphics();
		// Additional death layer
		var deathLayer = new PIXI.Graphics();
		// Additional light layer
		var lightLayer = new PIXI.Graphics();
		// Constant size of the hex tile.
		var size = 25;
		var drawTerrain = function(tileInstance) {
			if(tileInstance.type === 'forest') {
				// The base tile without hover borders.
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(0x006400);
				hexagon.lineStyle(3, 0x006400, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
				// preset ones to ensure a decent look.
				var treeRoot = [
					[0, 0], [2, 2], [-3, -3], [-7, -7], [10, 10],
					[-3, 3], [5, -5], [-7, 7], [10, -10], [9, 14],
					[14, 9], [14, 9], [18, 0], [6, 17], [-6, 17]
				];
				// Adds a few random ones.
				for(var i = 0; i < 5; i ++) {
					var entry = [];
					for(var j = 0; j < 2; j ++) {
						var num = Math.floor(Math.random() * 18);
						num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
						entry[j] = num;
					}
					treeRoot.push(entry);
				}
				hexagon.lineStyle(0.5, 0x000000, 1);
				for(var i = 0; i < treeRoot.length; i++) {
					hexagon.moveTo(cX + treeRoot[i][0], cY + treeRoot[i][1]);
					hexagon.lineTo(cX + treeRoot[i][0], cY + treeRoot[i][1] - 10);
					hexagon.lineTo(cX + treeRoot[i][0] - 1, cY + treeRoot[i][1] - 7);
					hexagon.moveTo(cX + treeRoot[i][0], cY + treeRoot[i][1] - 10);
					hexagon.lineTo(cX + treeRoot[i][0] + 1, cY + treeRoot[i][1] - 7);
					hexagon.moveTo(cX + treeRoot[i][0], cY + treeRoot[i][1] - 5);
					hexagon.lineTo(cX + treeRoot[i][0] - 2, cY + treeRoot[i][1] - 5);
					hexagon.moveTo(cX + treeRoot[i][0], cY + treeRoot[i][1] - 5);
					hexagon.lineTo(cX + treeRoot[i][0] + 2, cY + treeRoot[i][1] - 5);
					hexagon.moveTo(cX + treeRoot[i][0], cY + treeRoot[i][1] - 2);
					hexagon.lineTo(cX + treeRoot[i][0] - 3, cY + treeRoot[i][1] - 2);
					hexagon.moveTo(cX + treeRoot[i][0], cY + treeRoot[i][1] - 2);
					hexagon.lineTo(cX + treeRoot[i][0] + 3, cY + treeRoot[i][1] - 2);
				}
			} else if(tileInstance.type === 'desert') {
				// The base tile without hover borders.
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(0xEDC9AF);
				hexagon.lineStyle(3, 0xEDC9AF, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
				// preset ones to ensure a decent look.
				var cactus = [
					[0, 0], [-7, -7], [-9, 14],
					[6, 17], [-6, 17], [6, -12],
				];
				// Adds a few random ones.
				for(var i = 0; i < 3; i ++) {
					var entry = [];
					for(var j = 0; j < 2; j ++) {
						var num = Math.floor(Math.random() * 16);
						num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
						entry[j] = num;
					}
					cactus.push(entry);
				}
				hexagon.lineStyle(0.5, 0x006400, 1);
				for(var k = 0; k < cactus.length; k++) {
					hexagon.moveTo(cX + cactus[k][0], cY + cactus[k][1]);
					hexagon.lineTo(cX + cactus[k][0], cY + cactus[k][1] - 10);
					hexagon.moveTo(cX + cactus[k][0] - 1, cY + cactus[k][1] - 10);
					hexagon.lineTo(cX + cactus[k][0] + 1, cY + cactus[k][1] - 10);
					hexagon.lineTo(cX + cactus[k][0], cY + cactus[k][1] - 8);
					hexagon.moveTo(cX + cactus[k][0] - 1, cY + cactus[k][1] - 8);
					hexagon.lineTo(cX + cactus[k][0] + 1, cY + cactus[k][1] - 8);
					hexagon.lineTo(cX + cactus[k][0], cY + cactus[k][1] - 6);
					hexagon.moveTo(cX + cactus[k][0] - 1, cY + cactus[k][1] - 6);
					hexagon.lineTo(cX + cactus[k][0] + 1, cY + cactus[k][1] - 6);
					hexagon.lineTo(cX + cactus[k][0], cY + cactus[k][1] - 4);
					hexagon.moveTo(cX + cactus[k][0] - 1, cY + cactus[k][1] - 4);
					hexagon.lineTo(cX + cactus[k][0] + 1, cY + cactus[k][1] - 4);
					hexagon.lineTo(cX + cactus[k][0], cY + cactus[k][1] - 2);
					hexagon.moveTo(cX + cactus[k][0] - 1, cY + cactus[k][1] - 2);
					hexagon.lineTo(cX + cactus[k][0] + 1, cY + cactus[k][1] - 2);
					hexagon.lineTo(cX + cactus[k][0], cY + cactus[k][1]);
					hexagon.moveTo(cX + cactus[k][0] - 1, cY + cactus[k][1]);
					hexagon.lineTo(cX + cactus[k][0] + 1, cY + cactus[k][1]);
					hexagon.moveTo(cX + cactus[k][0] - 3, cY + cactus[k][1] - 5);
					hexagon.lineTo(cX + cactus[k][0] + 3, cY + cactus[k][1] - 5);
					hexagon.moveTo(cX + cactus[k][0] - 4, cY + cactus[k][1] - 7);
					hexagon.lineTo(cX + cactus[k][0] - 2, cY + cactus[k][1] - 7);
					hexagon.moveTo(cX + cactus[k][0] - 4, cY + cactus[k][1] - 9);
					hexagon.lineTo(cX + cactus[k][0] - 2, cY + cactus[k][1] - 9);
					hexagon.moveTo(cX + cactus[k][0] + 4, cY + cactus[k][1] - 7);
					hexagon.lineTo(cX + cactus[k][0] + 2, cY + cactus[k][1] - 7);
					hexagon.moveTo(cX + cactus[k][0] + 4, cY + cactus[k][1] - 9);
					hexagon.lineTo(cX + cactus[k][0] + 2, cY + cactus[k][1] - 9);
				}
			} else if(tileInstance.type === 'mountains') {
				// The base tile without hover borders.
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(0x968D99);
				hexagon.lineStyle(3, 0x968D99, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
				// preset ones to ensure a decent look.
				var mountainPeak = [
					[0, 0], [-3, -13], [15, 5], [-7, -7], [-10, 12],
					[10, 10], [5, -5], [-20, 0], [-16, 4], [-10, -16]
				];
				// Adds a few random ones.
				for(var i = 0; i < 4; i ++) {
					var entry = [];
					for(var j = 0; j < 2; j ++) {
						var num = Math.floor(Math.random() * 12);
						num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
						entry[j] = num;
					}
					mountainPeak.push(entry);
				}
				hexagon.lineStyle(0.5, 0x000000, 1);
				for(var i = 0; i < mountainPeak.length; i++) {
					hexagon.moveTo(cX + mountainPeak[i][0], cY + mountainPeak[i][1]);
					hexagon.lineTo(cX + mountainPeak[i][0] + 5, cY + mountainPeak[i][1] - 5);
					hexagon.lineTo(cX + mountainPeak[i][0] + 10, cY + mountainPeak[i][1]);
					hexagon.beginFill(0xFFFFFF);
					hexagon.moveTo(cX + mountainPeak[i][0] + 2.5, cY + mountainPeak[i][1] - 2.5);
					hexagon.lineTo(cX + mountainPeak[i][0] + 7.5, cY + mountainPeak[i][1] - 2.5);
					hexagon.lineTo(cX + mountainPeak[i][0] + 5, cY + mountainPeak[i][1] - 5);
					hexagon.lineTo(cX + mountainPeak[i][0] + 2.5, cY + mountainPeak[i][1] - 2.5);
					hexagon.endFill();
				}
			} else if(tileInstance.type === 'pit') {
				// The base tile without hover borders.
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(0x654321);
				hexagon.lineStyle(3, 0x654321, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
				// preset ones to ensure a decent look.
				var pits = [
					[12, 2], [-16, -3], [-7, 15], [-7, -13], [6, -16]
				];
				// Adds a few random ones.
				for(var i = 0; i < 2; i ++) {
					var entry = [];
					for(var j = 0; j < 2; j ++) {
						var num = Math.floor(Math.random() * 4);
						num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
						entry[j] = num;
					}
					pits.push(entry);
				}
				hexagon.lineStyle(0.5, 0x000000, 1);
				// Math.sqrt(100 - x2)
				for(var i = 0; i < pits.length; i++) {
					hexagon.moveTo(cX + pits[i][0], cY + pits[i][1] + Math.sqrt(-75));
					for(var j = -9; j <= 10; j++) {
						hexagon.lineTo(cX + pits[i][0] + j, cY + pits[i][1] + Math.sqrt(25 - (j * j)));
					}
					for(var j = 10; j >= -10; j--) {
						hexagon.lineTo(cX + pits[i][0] + j, cY + pits[i][1] - Math.sqrt(25 - (j * j)));
					}
				}
			} else if(tileInstance.type === 'water') {
				// The base tile without hover borders.
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(0x40A4DF);
				hexagon.lineStyle(3, 0x40A4DF, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
				var waves = [
					[3, 0], [-22, 0], [-10, 15], [-10, -15]
				];
				hexagon.lineStyle(0.5, 0x000000, 1);
				for(var i = 0; i < waves.length; i++) {
					hexagon.moveTo(cX + waves[i][0], cY + waves[i][1]);
					for(var j = 0; j < 20; j++) {
						hexagon.lineTo(cX + waves[i][0] + j, cY + waves[i][1] + (3 * Math.sin(j)));
					}
				}
			} else {
				// Null space
				// The base tile without hover borders.
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(0x000000);
				hexagon.lineStyle(3, 0x333333, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
			}
			if(tileInstance.state.isHidden) {
				// Layer to illustrate a fog of war effect.
				hiddenLayer.clear();
				hiddenLayer.moveTo(cX + size, cY);
				hiddenLayer.beginFill(0x999999, 0.95);
				hiddenLayer.lineStyle(3, 0xA9A9A9, 0.95);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hiddenLayer.lineTo(x_k, y_k);
				}
				hiddenLayer.endFill();
			} else {
				hiddenLayer.clear();
			}
			if(tileInstance.state.isPlayer && tileMap.playerIsAlive) {
				// Layer to illustrate player occupied tile.
				hoverLayer.clear();
				hoverLayer.moveTo(cX + size, cY);
				hoverLayer.beginFill(0xFFFF00, 0.5);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hoverLayer.lineTo(x_k, y_k);
				}
				hoverLayer.endFill();
			} else {
				hoverLayer.clear();
			}
		};

		return {
			addEnemy: function(graphicPackage, enemyId) {
				this.state.isEnemy = true;
				this.currentEnemyGraphic = graphicPackage;
				this.enemyId = enemyId;
				this.draw(9);
			},
			animate: function() {
				// Animation counter. Modding against it is used to control speed of animation.
				if(!this.animationCounter || this.animationCounter === 300) {
					this.animationCounter = 1;
				} else {
					this.animationCounter++;
				}

				// Checks to see if all the free nodes on the board have been converted to light nodes.
				if(tileMap.getFreeNodes().length <= tileMap.getLightNodes().length && !playerWon) {
					console.log('Player Wins');
					var event = new Event('playerWon');
    				document.dispatchEvent(event);
    				playerWon = true;
    				showAllTiles();
				}

				// Darkness spreading and light receding.
				if(this.state.isDark) {
					if(this.lightAnimationCounter) {
						lightLayer.clear();
						this.lightAnimation(false);
					}
					this.darkAnimation(true);
				}
				// Lightness spreading and dark receding.
				if(this.state.isLight) {
					if(this.darkAnimationCounter) {
						darkLayer.clear();
						this.darkAnimation(false);
					}
					this.lightAnimation(true);
				}
				// Death spreading and then receding.
				if(this.state.isDeath && this.deathAnimationCounter >= 0) {
					deathLayer.clear();
					this.deathAnimation();
				} else if(this.state.isDeath && this.deathAnimationCounter < 0) {
					deathLayer.clear();
				}
				// Enemy units jump up and down when player is dead
				if(this.state.isEnemy && !tileMap.playerIsAlive) {
					// Set enemy graphic to face down
					if(this.enemyDirection !== 3) {
						this.setEnemyDirection(3);
						this.draw(9);
					}
					// Progress the animation every other tick
					if(this.animationCounter % 2) {
						if(!this.state.jumpSequencePosition) {
							this.state.jumpSequencePosition = 1;
						} else {
							this.state.jumpSequencePosition++;
						}
						if(Math.floor(this.state.jumpSequencePosition/5) % 2 === 0) {
							this.currentEnemyGraphic[this.enemyDirection].y = cY - 5 + (this.state.jumpSequencePosition % 10);
						} else {
							this.currentEnemyGraphic[this.enemyDirection].y = cY - 5 - (this.state.jumpSequencePosition % 10);
						}
					}
				}
				// Players jumps up and down when it's a win scenario
				if(playerWon && this.state.isPlayer) {
					if(currentPlayerGraphic) {
						tileMap.hoverContainer.removeChild(currentPlayerGraphic);
					}
					if(hextant !== 4) {
						hextant = 4;
					}
					currentPlayerGraphic = players[hextant - 1];
					currentPlayerGraphic.x = cX;
					// Progress the animation every other tick
					if(this.animationCounter % 2 || !this.state.jumpSequencePosition) {
						if(!this.state.jumpSequencePosition) {
							this.state.jumpSequencePosition = 1;
						} else {
							this.state.jumpSequencePosition++;
						}
						if(Math.floor(this.state.jumpSequencePosition/5) % 2 === 0) {
							currentPlayerGraphic.y = cY - 5 + (this.state.jumpSequencePosition % 10);
						} else {
							currentPlayerGraphic.y = cY - 5 - (this.state.jumpSequencePosition % 10);
						}
					}
					tileMap.hoverContainer.addChild(currentPlayerGraphic);
				}
			},
			// Sets up the basic tile info, and determines (based off neighbors) what it is.
			build: function(id, terrain, isPlayer=false, isDark=false, isHidden=true, isEnemy=false, isPassable=true) {
				this.id = id;
				this.state.isPlayer = isPlayer;
				this.state.passable = isPassable;
				this.state.isDark = isDark;
				this.state.isHidden = isHidden;
				this.state.isEnemy = isEnemy;
				this.type = terrain;
				if(terrain === 'pit' || terrain === 'water' || terrain === null) {
					this.passable = false;
				}
				if(this.state.isPlayer) {
					activeTile = this;
				}
				// Runs drawing functionality.
				this.draw(9);
				// Attach the tile to the stage.
				tileMap.terrainContainer.addChild(hexagon);
				// Attach hidden opacity layer.
				tileMap.hiddenLayerContainer.addChild(hiddenLayer);
				// Attach dark-tile layer.
				tileMap.darkLayerContainer.addChild(darkLayer);
				// Attach death-tile layer.
				tileMap.deathLayerContainer.addChild(deathLayer);
				// Attach light-tile layer.
				tileMap.lightLayerContainer.addChild(lightLayer);
				// Lets graphic be accessible from Tile object.
				this.graphique = hexagon;

				if(this.state.isPlayer) {
					this.goLight();
				}
			},
			// Holds the current graphic of the enemy.
			currentEnemyGraphic: null,
			// A counter to keep track of where in the darkness animation sequence the tile is
			darkAnimationCounter: 0,
			// An darkness spreading animation to run run every tick when tile is infected.
			darkAnimation: function(isGrowing) {
				var tempSize = Math.floor(this.darkAnimationCounter / 5);
				if(tempSize > size) {
					tempSize = size;
				}
				// Layer to illustrate a spreading darkness effect.
				darkLayer.clear();
				darkLayer.moveTo(this.position.x + tempSize, this.position.y);
				darkLayer.beginFill(0x008080, 0.8);
				darkLayer.lineStyle(3, 0x00A0A0, 0.6);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = this.position.x + tempSize * Math.cos(angle);
					var y_k = this.position.y + tempSize * Math.sin(angle);
					darkLayer.lineTo(x_k, y_k);
				}
				darkLayer.endFill();

				if(isGrowing && tempSize < size) {
					this.darkAnimationCounter++;
				} else if(!isGrowing && this.darkAnimationCounter > 0) {
					this.darkAnimationCounter--;
				}
			},
			// A counter to keep track of where in the death animation sequence the tile is
			deathAnimationCounter: 0,
			// A direction boolean to keep track of which way the death splash is animating.
			deathAnimationGrowing: true,
			// A death spreading animation to run run every tick when tile is infected.
			deathAnimation: function() {
				var tempSize = Math.floor(this.deathAnimationCounter / 7);
				if(tempSize > size) {
					tempSize = size;
				}
				// Layer to illustrate a death effect.
				deathLayer.clear();
				deathLayer.moveTo(this.position.x + tempSize, this.position.y);
				deathLayer.beginFill(0x990000, 0.8);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = this.position.x + tempSize * Math.cos(angle);
					var y_k = this.position.y + tempSize * Math.sin(angle);
					deathLayer.lineTo(x_k, y_k);
				}
				deathLayer.endFill();

				if(this.deathAnimationGrowing) {
					this.deathAnimationCounter++;
				} else if(!this.deathAnimationGrowing) {
					this.deathAnimationCounter--;
				}
				// Swap directions if the end is reached.
				if(tempSize >= size) {
					this.deathAnimationGrowing = false;
				// If fully receded, reset variables and kill animation.
				} else if(tempSize < 0) {
					this.deathAnimationGrowing = true;
					this.setDeath(false);
				}
			},
			// Draws the tile and its outline boundary.
			draw: function(line, col) {
				if(col === undefined) {
					col = 0x00FF00;
				}
				hexagon.clear();
				hoverLine.clear();
				hoverLayer.clear();
				drawTerrain(this);
				// Removes the enemy graphic if there was one, and places the enemy anew.
				if(this.state.isEnemy && this.currentEnemyGraphic) {
					flushEnemyGraphics(this.currentEnemyGraphic);
					this.currentEnemyGraphic[this.enemyDirection].x = cX;
					this.currentEnemyGraphic[this.enemyDirection].y = cY - 5;
					tileMap.enemyLayerContainer.addChild(this.currentEnemyGraphic[this.enemyDirection]);
				}
				var lineConvert = line - 2;
				if(lineConvert <= 0) {
					lineConvert += 6;
				}
				// If hoverline redraw thicker boundary, with one hextant as green.
				if(lineConvert > 0 && lineConvert <= 6) {
					hoverLine.moveTo(cX + size, cY);
					for (var k = 0; k <= 6; k++) {
						if(k === lineConvert) {
							hoverLine.lineStyle(4, col, 2);
						} else {
							hoverLine.lineStyle(4, 0x000000, 2);
						}
						var angle = 2 * Math.PI / 6 * k;
						var x_k = cX + size * Math.cos(angle);
						var y_k = cY + size * Math.sin(angle);
						hoverLine.lineTo(x_k, y_k);
					}
					// Attach the hoverLine and hoverLayer to the stage.
					tileMap.hoverContainer.addChild(hoverLine);
					tileMap.hoverContainer.addChild(hoverLayer);
					if(line && tileMap.playerIsAlive) {
						if(currentPlayerGraphic) {
							tileMap.hoverContainer.removeChild(currentPlayerGraphic);
						}
						currentPlayerGraphic = players[line - 1];
						currentPlayerGraphic.x = cX;
						currentPlayerGraphic.y = cY - 5;
						tileMap.hoverContainer.addChild(currentPlayerGraphic);
					} else if(!tileMap.playerIsAlive && currentPlayerGraphic) {
						tileMap.hoverContainer.removeChild(currentPlayerGraphic);
					}
				}
			},
			enemyDirection: 3,
			enemyId: null,
			hide: function() {
				this.state.isHidden = true;
				this.draw(9);
			},
			id: '',
			goDark: function() {
				this.state.isDark = true;
				this.state.isLight = false;
				this.draw(9);
			},
			goLight: function() {
				this.state.isDark = false;
				this.state.isLight = true;
				this.draw(9);
			},
			graphique: null,
			// A counter to keep track of where in the lightness animation sequence the tile is
			lightAnimationCounter: 0,
			// An light spreading animation to run run every tick when tile isLight.
			lightAnimation: function(isGrowing) {
				var tempSize = Math.floor(this.lightAnimationCounter / 5);
				if(tempSize > size) {
					tempSize = size;
				}

				lightLayer.clear();
				lightLayer.moveTo(this.position.x + tempSize, this.position.y);
				lightLayer.beginFill(0xCFB53B, 0.6);
				lightLayer.lineStyle(3, 0xC0C0C0, 0.6);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = this.position.x + tempSize * Math.cos(angle);
					var y_k = this.position.y + tempSize * Math.sin(angle);
					lightLayer.lineTo(x_k, y_k);
				}
				lightLayer.endFill();

				if(isGrowing && tempSize < size) {
					this.lightAnimationCounter++;
				} else if(!isGrowing && this.lightAnimationCounter > 0) {
					this.lightAnimationCounter--;
				}
			},
			link1: null,
			link2: null,
			link3: null,
			link4: null,
			link5: null,
			link6: null,
			passable: true,
			position: {
				x: cX,
				y: cY
			},
			removeEnemy: function(enemyId) {
				this.state.isEnemy = false;
				if(this.currentEnemyGraphic) {
					tileMap.enemyLayerContainer.removeChild(this.currentEnemyGraphic[this.enemyDirection]);
					this.currentEnemyGraphic = null;
				}
				this.enemyId = null;
				this.draw(9);
			},
			removePlayer: function() {
				this.state.isPlayer = false;
				if(currentPlayerGraphic) {
					tileMap.hoverContainer.removeChild(currentPlayerGraphic);
				}
				tileMap.playerIsAlive = false;
				showAllTiles();
				this.draw(9);
				this.setDeath(true);
				var event = new Event('playerDied');
    			document.dispatchEvent(event);
			},
			setActive: function() {
				this.state.isPlayer = true;
				activeTile = this;
				this.draw(9);
			},
			setDeath: function(isDying) {
				this.state.isDeath = isDying;
			},
			setEnemyDirection: function(dir) {
				this.enemyDirection = dir;
			},
			setInactive: function() {
				this.state.isPlayer = false;
				activeTile = null;
				this.draw(9);
			},
			show: function() {
				this.state.isHidden = false;
				this.draw(9);
				activeTile.draw(hextant, 0x000000);
			},
			state: {
				isDark: false,
				isDeath: false,
				isEnemy: false,
				isHidden: false,
				isLight: false,
				isPlayer: false,
			},
			type: null
		};
	};

	/*** Internal functions ***/
	// Creates center node and passes it into the procedurally recursive function.
	var buildLevel = function(level) {
		// Loop to find suitable tilemap, and avoid islands.
		while(true) {
			// Create first hex node.
			var startNode = new Tile(center.x, center.y, true);
			startNode.build(
				center.x + '-' + center.y,
				pickTileTerrain(true),
				true,
				false,
				false,
				false,
				true
			);
			tileTable[center.x + '-' + center.y] = startNode;

			freeNodes.push(startNode);
			allTiles.push(startNode);

			makeNeighborNodes(startNode, 0);

			showTiles(activeTile, 0);

			if(checkForIslands(startNode)) {
				break;
			} else {
				console.log('Islands found! Trying again.');
				tileTable = [];
				allTiles = [];
				freeNodes = [];
				tileMap.terrainContainer = new PIXI.Container();
				tileMap.darkLayerContainer = new PIXI.Container();
				tileMap.lightLayerContainer = new PIXI.Container();
				tileMap.deathLayerContainer = new PIXI.Container();
				tileMap.enemyLayerContainer = new PIXI.Container();
				tileMap.hiddenLayerContainer = new PIXI.Container();
				tileMap.hoverContainer = new PIXI.Container();
			}
		};
		activeTile.goLight();
	};
	// Starts from the center node and verifies that all passable nodes are reachable
	// from the center. If the center can reach them all, then any other passable node
	// can reach any other passable node.
	var checkForIslands = function(startNode) {
		var initialFreeNodesLength = freeNodes.length;
		var tempFreeNodes = [];
		for(var i = 0; i < initialFreeNodesLength; i++) {
			tempFreeNodes.push(freeNodes[i]);
		}

		while(tempFreeNodes.length) {
			if(hasReachablePath(startNode, tempFreeNodes[0], 0)) {
				var percentComplete = Math.ceil((1 - (tempFreeNodes.length/initialFreeNodesLength)) * 100);
				tempFreeNodes.splice(0, 1);
			} else {
				return false;
			}
		}
			
		return true;
	};
	// Picks, at random, a tile in the tileTable where an enemy might start.
	// This spot makes sure it isn't on the player, isn't adjacent to the player,
	// and isn't on an impassable tile.
	var findEnemyTile = function(enemyIndex) {
		var tileTableArray = Object.keys(tileTable);
		var isTileFound = false;
		var tile = null;
		do {
			var tileKey = tileTableArray[Math.floor(Math.random() * tileTableArray.length)];
			tile = tileTable[tileKey];
			isTileFound = isPassable(tile) && isNotNearPlayer(tile);
		} while(!isTileFound);
		tile.addEnemy(enemies[enemyIndex]);
		return tile;
	};
	// Flushes enemy graphics from the container before new graphics can be placed.
	var flushEnemyGraphics = function(graphicPackage) {
		if(graphicPackage) {
			for(var i = 0; i < graphicPackage.length; i++) {
				tileMap.enemyLayerContainer.removeChild(graphicPackage[i]);
			}
		}
	};
	// Recursive function that seeks out a path to find a single node in the freenode array.
	var hasReachablePath = function(startNode, endNode, depth) {
		// If the link passed in was empty, an impassable node, or too far down the recursive path, then fail it.
		if(startNode === undefined || startNode === null || startNode.passable === false || depth >= 10) {
			return false;
		}
		// The passed in node was a success.
		if(startNode.id == endNode.id) {
			return true;
		}
		for(var i = 1 ; i < 7; i++) {
			// One of this nodes links has a path to the end node, continue to pass along the true value.
			if(hasReachablePath(startNode['link' + i], endNode, depth + 1)) {
				return true;
			}
		}
		// If this point was reached, there was no path this way.
		return false;
	};
	// Sweeps through and hides all tiles; a sort of refresh.
	var hideTiles = function() {
		var tiles = Object.keys(tileTable);
		for(var i = 0; i < tiles.length; i++) {
			if(tileTable[tiles[i]]) {
				tileTable[tiles[i]].hide();
			}
		}
	};
	// Checks if param tile constains or is adjacent to a tile that contains the player.
	var isNotNearPlayer = function(tile) {
		if(tile.state.isPlayer) {
			return false;
		}
		for(var i = 1; i < 7; i++) {
			if(tile['link' + i] && tile['link' + i].state.isPlayer) {
				return false;
			}
		}
		return true;
	};
	// Checks if param tile passable or not,
	var isPassable = function(tile) {
		return tile.passable;
	};
	// Procedural generator of the tiles, which connects them through links.
	var makeNeighborNodes = function(centerNode, count) {
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node directly above, so make one.
		if(count < hexDepth
			&& centerNode.link1 === null
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y - 46)] === undefined
		) {
			var node = new Tile(centerNode.position.x, (centerNode.position.y - 46));
			node.build(centerNode.position.x + '-' + (centerNode.position.y - 46), pickTileTerrain());
			tileTable[centerNode.position.x + '-' + (centerNode.position.y - 46)] = node;
			allTiles.push(node);
			if(node.passable) {
				freeNodes.push(node);
			}
			centerNode.link1 = node;
			node.link4 = centerNode;
		// There already exists a node directly above, but the above node doesn't know it.
		// Connect them.
		} else if(centerNode.link1 !== null
			&& (centerNode.link1).link4 === null
		) {
			(centerNode.link1).link4 = centerNode;
		// A node was made above this one at some other point, but this node doesn't know it.
		// Connect them.
		} else if(centerNode.link1 === null
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y - 46)] !== undefined
		) {
			centerNode.link1 = tileTable[centerNode.position.x + '-' + (centerNode.position.y - 46)];
			tileTable[centerNode.position.x + '-' + (centerNode.position.y - 46)].link4 = centerNode;
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node to the upper right, so make one.
		if(count < hexDepth
			&& centerNode.link2 === null
			&& tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 23)] === undefined
		) {
			var node = new Tile((centerNode.position.x + 39), (centerNode.position.y - 23));
			node.build((centerNode.position.x + 39) + '-' + (centerNode.position.y - 23), pickTileTerrain());
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 23)] = node;
			allTiles.push(node);
			if(node.passable) {
				freeNodes.push(node);
			}
			centerNode.link2 = node;
			node.link5 = centerNode;
		// There already exists a node to the upper right, but the above node doesn't know it.
		// Connect them.
		} else if(centerNode.link2 !== null
			&& (centerNode.link2).link5 === null
		) {
			(centerNode.link2).link5 = centerNode;
		// A node was made above this one at some other point, but this node doesn't know it.
		// Connect them.
		} else if(centerNode.link2 === null
			&& tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 23)] !== undefined
		) {
			centerNode.link2 = tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 23)];
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 23)].link5 = centerNode;
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node to the lower right, so make one.
		if(count < hexDepth
			&& centerNode.link3 === null
			&& tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y + 23)] === undefined
		) {
			var node = new Tile((centerNode.position.x + 39), (centerNode.position.y + 23));
			node.build((centerNode.position.x + 39) + '-' + (centerNode.position.y + 23), pickTileTerrain());
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y + 23)] = node;
			allTiles.push(node);
			if(node.passable) {
				freeNodes.push(node);
			}
			centerNode.link3 = node;
			node.link6 = centerNode;
		// There already exists a node to the lower right, but the above node doesn't know it.
		// Connect them.
		} else if(centerNode.link3 !== null
			&& (centerNode.link3).link6 === null
		) {
			(centerNode.link3).link6 = centerNode;
		// A node was made above this one at some other point, but this node doesn't know it.
		// Connect them.
		} else if(centerNode.link3 === null
			&& tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y + 23)] !== undefined
		) {
			centerNode.link3 = tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y + 23)];
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y + 23)].link6 = centerNode;
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node directly below, so make one.
		if(count < hexDepth
			&& centerNode.link4 === null
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y + 46)] === undefined
		) {
			var node = new Tile(centerNode.position.x, (centerNode.position.y + 46));
			node.build(centerNode.position.x + '-' + (centerNode.position.y + 46), pickTileTerrain());
			tileTable[centerNode.position.x + '-' + (centerNode.position.y + 46)] = node;
			allTiles.push(node);
			if(node.passable) {
				freeNodes.push(node);
			}
			centerNode.link4 = node;
			node.link1 = centerNode;
		// There already exists a node directly below, but the above node doesn't know it.
		// Connect them.
		} else if(centerNode.link4 !== null
			&& (centerNode.link4).link1 === null
		) {
			(centerNode.link4).link1 = centerNode;
		// A node was made above this one at some other point, but this node doesn't know it.
		// Connect them.
		} else if(centerNode.link4 === null
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y + 46)] !== undefined
		) {
			centerNode.link4 = tileTable[centerNode.position.x + '-' + (centerNode.position.y + 46)];
			tileTable[centerNode.position.x + '-' + (centerNode.position.y + 46)].link1 = centerNode;
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node to the lower left, so make one.
		if(count < hexDepth
			&& centerNode.link5 === null
			&& tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y + 23)] === undefined
		) {
			var node = new Tile((centerNode.position.x - 39), (centerNode.position.y + 23));
			node.build((centerNode.position.x - 39) + '-' + (centerNode.position.y + 23), pickTileTerrain());
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y + 23)] = node;
			allTiles.push(node);
			if(node.passable) {
				freeNodes.push(node);
			}
			centerNode.link5 = node;
			node.link2 = centerNode;
		// There already exists a node to the lower left, but the above node doesn't know it.
		// Connect them.
		} else if(centerNode.link5 !== null
			&& (centerNode.link5).link2 === null
		) {
			(centerNode.link5).link2 = centerNode;
		// A node was made above this one at some other point, but this node doesn't know it.
		// Connect them.
		} else if(centerNode.link5 === null
			&& tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y + 23)] !== undefined
		) {
			centerNode.link5 = tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y + 23)];
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y + 23)].link2 = centerNode;
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node to the upper left, so make one.
		if(count < hexDepth
			&& centerNode.link6 === null
			&& tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 23)] === undefined
		) {
			var node = new Tile((centerNode.position.x - 39), (centerNode.position.y - 23));
			node.build((centerNode.position.x - 39) + '-' + (centerNode.position.y - 23), pickTileTerrain());
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 23)] = node;
			allTiles.push(node);
			if(node.passable) {
				freeNodes.push(node);
			}
			centerNode.link6 = node;
			node.link3 = centerNode;
		// There already exists a node to the upper left, but the above node doesn't know it.
		// Connect them.
		} else if(centerNode.link6 !== null
			&& (centerNode.link6).link3 === null
		) {
			(centerNode.link6).link3 = centerNode;
		// A node was made above this one at some other point, but this node doesn't know it.
		// Connect them.
		} else if(centerNode.link6 === null
			&& tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 23)] !== undefined
		) {
			centerNode.link6 = tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 23)];
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 23)].link3 = centerNode;
		}

		if(count === hexDepth) return;

		// Now to recursively build out from this node's neighbors
		for(var i = 1; i <= 6; i++) {
			makeNeighborNodes(centerNode['link' + i], count + 1);
		}
	};
	// Detects when the mouse clicks and moves player to new tile.
	var mouseClickHandler = function(e) {
		if(isBoardActive && activeTile && tileMap.playerIsAlive && !playerWon) {
			var oldActive = activeTile;
			if(oldActive['link' + hextant] && oldActive['link' + hextant].passable) {
				oldActive.setInactive();
				oldActive['link' + hextant].setActive();
				// Make it light.
				oldActive['link' + hextant].goLight();
				// If enemy present, game over
				if(oldActive['link' + hextant].state.isEnemy) {
					console.log('Collision with enemy. Player loses.');
					oldActive['link' + hextant].goDark();
					oldActive.removePlayer();
				}
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(hextant, 0x00FF00);
				} else {
					activeTile.draw(hextant, 0xFF0000);
				}
				activeCenter = {
					x: activeTile.position.x,
					y: activeTile.position.y
				};
				hideTiles();
				showTiles(activeTile, 0);
				var event = new Event('playerMove');
    			document.dispatchEvent(event);
    			mouseMoveHandler(lastMouseMoveEvent);
    			checkAutoFillLight(activeTile);
			}
		}
	};
	/*
	 * Checks tiles around enemy's new tile for possible autofill scenarios. Instigates recursive check.
	*/
	var checkAutoFillDark = function(curTile) {
		for(var i = 1; i < 7; i++) {
			if(!curTile['link' + i] || !curTile['link' + i].passable || curTile['link' + i].state.isDark) {
				continue; // Tile is either nonexistent, impassable, or already light.
			}
			if(checkPotentialEnclosedDark(curTile, curTile['link' + i], 0)) {
				encompassTilesDark();
			}
		}
	};
	/*
	 * Checks tiles around player's new tile for possible autofill scenarios. Instigates recursive check.
	*/
	var checkAutoFillLight = function(curTile) {
		for(var i = 1; i < 7; i++) {
			if(!curTile['link' + i] || !curTile['link' + i].passable || curTile['link' + i].state.isLight) {
				continue; // Tile is either nonexistent, impassable, or already light.
			}
			if(checkPotentialEnclosedLight(curTile, curTile['link' + i], 0)) {
				encompassTilesLight();
			}
		}
	};
	/*
	 * Recursive check to find all the dark encompassed tiles adjacent to enemiy's last move.
	*/
	var checkPotentialEnclosedDark = function(prevTile, curTile, depth) {
		if(!curTile || !curTile.passable || depth > 3) {
			return false;
		}
		for(var i = 1; i < 7; i++) {
			if(!curTile['link' + i]) {
				// No node exists here, breaking the encompassed.
				return false;
			} else if(prevTile.id === curTile['link' + i].id) {
				continue; // Already been there. No need to check it again.
			} else if(curTile['link' + i].state.isDark) {
				continue; // Already light, leaning toward encompassed.
			}
			var isEnclosed = checkPotentialEnclosedDark(curTile, curTile['link' + i], depth + 1);
			if(!isEnclosed) {
				return false;
			}
		}
		// To have made it this means the node must be enclosed.
		if(!curTile.state.isDark) {
			nodesToBeFilled.push(curTile);
		}
		// If this node is encclosed, let the calling node know.
		return true;
	};
	/*
	 * Recursive check to find all the light encompassed tiles adjacent to player's last move.
	*/
	var checkPotentialEnclosedLight = function(prevTile, curTile, depth) {
		if(!curTile || !curTile.passable || depth > 3) {
			return false;
		}
		for(var i = 1; i < 7; i++) {
			if(!curTile['link' + i]) {
				// No node exists here, breaking the encompassed.
				return false;
			} else if(prevTile.id === curTile['link' + i].id) {
				continue; // Already been there. No need to check it again.
			} else if(curTile['link' + i].state.isLight) {
				continue; // Already light, leaning toward encompassed.
			}
			var isEnclosed = checkPotentialEnclosedLight(curTile, curTile['link' + i], depth + 1);
			if(!isEnclosed) {
				return false;
			}
		}
		// To have made it this means the node must be enclosed.
		if(!curTile.state.isLight) {
			nodesToBeFilled.push(curTile);
		}
		// If this node is encclosed, let the calling node know.
		return true;
	};
	/*
	 * Fills encompassed tiles with dark and kills player on an enclosed tile.
	*/
	var encompassTilesDark = function() {
		for(var i = 0; i < nodesToBeFilled.length; i++) {
			console.log('Tile ' + nodesToBeFilled[i].id + ' has been autofilled with DARK!');
			nodesToBeFilled[i].goDark();

			if(nodesToBeFilled[i].state.isPlayer) {
				console.log('Player dies by being surrounded by darkness.')
				nodesToBeFilled[i].setDeath(true);
				var event = new Event('playerDied');
				document.dispatchEvent(event);

				nodesToBeFilled[i].removePlayer();
			}
		}
		nodesToBeFilled = [];
	};
	/*
	 * Fills encompassed tiles with light and kills any enemy on an enclosed tile.
	*/
	var encompassTilesLight = function() {
		for(var i = 0; i < nodesToBeFilled.length; i++) {
			console.log('Tile ' + nodesToBeFilled[i].id + ' has been autofilled with LIGHT!');
			nodesToBeFilled[i].goLight();

			if(nodesToBeFilled[i].state.isEnemy) {
				var event = new Event('enemyDied');
				nodesToBeFilled[i].setDeath(true);
				event.enemyId = nodesToBeFilled[i].enemyId;
				document.dispatchEvent(event);

				nodesToBeFilled[i].removeEnemy(nodesToBeFilled[i].enemyId);
			}
		}
		nodesToBeFilled = [];
	};
	// Detects when the mouse moves and calculates which hex-rant player is hovering over.
	var mouseMoveHandler = function(e) {
		lastMouseMoveEvent = e;
		if(activeTile && tileMap.playerIsAlive && !playerWon) {
			var xDiff = activeTile.position.x - e.pageX;
			var yDiff = activeTile.position.y - e.pageY;
			var angle = Math.atan2(yDiff, xDiff);
			angle += Math.PI;
			angle = angle * 180 / Math.PI;
			// Redraws tile with one border highlighted.
			if(angle >= 0 && angle < 60) {
				hextant = 3;
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(3, 0x00FF00);
				} else {
					activeTile.draw(3, 0xFF0000);
				}
			} else if(angle >= 60 && angle < 120) {
				hextant = 4;
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(4, 0x00FF00);
				} else {
					activeTile.draw(4, 0xFF0000);
				}
			} else if(angle >= 120 && angle < 180) {
				hextant = 5;
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(5, 0x00FF00);
				} else {
					activeTile.draw(5, 0xFF0000);
				}
			} else if(angle >= 180 && angle < 240) {
				hextant = 6;
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(6, 0x00FF00);
				} else {
					activeTile.draw(6, 0xFF0000);
				}
			} else if(angle >= 240 && angle < 300) {
				hextant = 1;
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(1, 0x00FF00);
				} else {
					activeTile.draw(1, 0xFF0000);
				}
			} else if(angle >= 300 && angle < 360) {
				hextant = 2;
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(2, 0x00FF00);
				} else {
					activeTile.draw(2, 0xFF0000);
				}
			}
		}
	};
	var pickTileTerrain = function(isStarter) {
		var rando = Math.random() * 100;

		if(isStarter || rando < 80) {
			if(rando >= 0 && rando < 45) return 'forest';
			else if(rando >= 45 && rando < 70) return 'desert';
			else return 'mountains';
		} else {
			if(rando >= 80 && rando < 85) return 'pit';
			else if(rando >= 85 && rando < 90) return 'water';
			else return null;
		}
	};
	var showAllTiles = function() {
		for(var i = 0; i < allTiles.length; i++) {
			allTiles[i].show();
		}
	};
	var showTiles = function(tile, layer) {
		if(tile && layer <= revealDepth) {
			tile.show();
			for(var i = 1; i < 7; i++) {
				showTiles(tile['link' + i], layer + 1);
			}
		} else {
			return;
		}
	};
	// Used to kill player a setoff endgame reaction when timer runs out.
	var timeoutHandler = function() {
		activeTile.removePlayer();
	};

	/*** Publicly accessible variables ***/
	tileMap.container = new PIXI.Container();
	tileMap.enemyLayerContainer = new PIXI.Container();
	tileMap.terrainContainer = new PIXI.Container();
	tileMap.hoverContainer = new PIXI.Container();
	tileMap.hiddenLayerContainer = new PIXI.Container();
	tileMap.darkLayerContainer = new PIXI.Container();
	tileMap.deathLayerContainer = new PIXI.Container();
	tileMap.lightLayerContainer = new PIXI.Container();

	tileMap.enemiesPlaced = 0;

	/*** Publicly accessible functions ***/
	tileMap.activateBoard = function() {
		isBoardActive = true;
	};
	tileMap.addPlayer = function() {
		activeTile.draw(4, 0x00FF00);
	};
	tileMap.runAnimations = function() {
		for(var i = 0; i < freeNodes.length; i++) {
			freeNodes[i].animate();
		}
	};
	tileMap.contract = function() {
		revealDepth -= 1;
		if(revealDepth < 1) {
			revealDepth = 1;
		}
		hideTiles();
		showTiles(activeTile, 0);
	};
	tileMap.expand = function() {
		revealDepth += 1;
		// Max size if too many keypresses.
		if(revealDepth > 3) {
			revealDepth = 3;
		}
		// Dev Mode: for fog off
		// revealDepth = 6;
		showTiles(activeTile, 0);
	};
	tileMap.getActiveCenter = function() {
		return activeCenter;
	};
	tileMap.getBoardActivityStatus = function() {
		return isBoardActive;
	}
	tileMap.getFreeNodes = function() {
		return freeNodes;
	};
	tileMap.getLightNodes = function() {
		var lightNodes = [];
		for(var i = 0; i < freeNodes.length; i++) {
			if(freeNodes[i].state.isLight) {
				lightNodes.push(freeNodes[i]);
			}
		}
		return lightNodes;
	};
	tileMap.getNonDarkNodes = function() {
		var nonDarkNodes = [];
		for(var i = 0; i < freeNodes.length; i++) {
			if(!freeNodes[i].state.isDark) {
				nonDarkNodes.push(freeNodes[i]);
			}
		}
		return nonDarkNodes;
	};
	// Called after instantiation in order to build the map and all it's connected to.
	tileMap.init = function() {
		// Create map instance here
		// Place center hole at center screen
		buildLevel(level);
		tileMap.terrainContainer.cacheAsBitmap = true;
		tileMap.container.addChild(tileMap.terrainContainer);
		tileMap.container.addChild(tileMap.darkLayerContainer);
		tileMap.container.addChild(tileMap.lightLayerContainer);
		tileMap.container.addChild(tileMap.deathLayerContainer);
		tileMap.container.addChild(tileMap.enemyLayerContainer);
		tileMap.container.addChild(tileMap.hiddenLayerContainer);
		tileMap.container.addChild(tileMap.hoverContainer);
	};
	// Called to increase move enemy from param1 tile to param2 tile.
	tileMap.moveEnemy = function(oldTile, newTile, enemyId) {
		//if player died, stop moving around
		if(!tileMap.playerIsAlive || playerWon) {
			return false;
		}
		if(oldTile === newTile) {
			// Enemy has decided not to move
			console.log('Enemy stands still');
			return false;
		}
		else if(!newTile) {
			return false;
		}
		else if(newTile.state.isPlayer) {
			// Game over. Player loses.
			console.log('Enemy has found and killed player');
			var graphicPackage = oldTile.currentEnemyGraphic;
			for(var i = 1; i <= 6; i++) {
				if(oldTile['link' + i] && oldTile['link' + i].id === newTile.id) {
					newTile.setEnemyDirection(i - 1);
					break;
				}
			}
			oldTile.removeEnemy(enemyId);
			newTile.goDark();
			newTile.removePlayer();
			newTile.addEnemy(graphicPackage, enemyId);
			return true;
		} else if(!newTile.passable || newTile.state.isEnemy) {
			// Invalid choice in movement.
			// Can't move to impassable tile, can't share tile with other enemy.
			console.log(
				'Already Dark: ' + newTile.state.isDark,
				'Not passable: ' + !newTile.passable,
				'Enemy already here: ' + newTile.state.isEnemy);
			return false;
		} else {
			var graphicPackage = oldTile.currentEnemyGraphic;
			for(var i = 1; i <= 6; i++) {
				if(oldTile['link' + i] && oldTile['link' + i].id === newTile.id) {
					newTile.setEnemyDirection(i - 1);
					break;
				}
			}
			oldTile.removeEnemy(enemyId);
			newTile.goDark();
			newTile.addEnemy(graphicPackage, enemyId);
			checkAutoFillDark(newTile);
			// Dev Mode: uncomment next 10 lines for forced enemy death
			// if(tempCounter >= 3) {
			// 	var event = new Event('enemyDied');
			// 	newTile.setDeath(true);
			// 	event.enemyId = newTile.enemyId;
			// 	document.dispatchEvent(event);

			// 	newTile.removeEnemy(newTile.enemyId);
			// } else {
			// 	tempCounter++;
			// }
			return true;
		}
	};
	// Called to increase level...and rebuild map.
	tileMap.nextLevel = function() {
		// Increases level by one, and instigates a rebuild of the map.
		level++;
		buildLevel(level);
	};
	// Called by enemy instantiator to place an enemy. A tile will be returned, where the enemy exists
	tileMap.placeEnemy = function() {
		var enemyTile = findEnemyTile(tileMap.enemiesPlaced);
		tileMap.enemiesPlaced++;
		enemyTile.goDark();
		return enemyTile;
	};
	// Called to perform the necessary cleanups before reset.
	tileMap.destroy = function() {
		document.removeEventListener('click', mouseClickHandler);
		document.removeEventListener('mousemove', mouseMoveHandler);
		document.removeEventListener('timeout', timeoutHandler);
	};
	// Dev Mode: auto Light all the tiles for testing win scenarios. Uncomment next 5 lines.
	// tileMap.autoLightAllTiles = function() {
	// 	for(var i = 0; i < allTiles.length; i++) {
	// 		allTiles[i].goLight();
	// 	}
	// }

	/*** Document level event listeners ***/
	// Captures click of mouse and passes on to handler.
	document.addEventListener('click', mouseClickHandler);
	// Captures movement of mouse and passes on to handler.
	document.addEventListener('mousemove', mouseMoveHandler);
	// Captures timer running out event and passes it to handler.
	document.addEventListener('timeout', timeoutHandler);

	// Pass publically accessible functionality back to main wrapper.
	return tileMap;
};