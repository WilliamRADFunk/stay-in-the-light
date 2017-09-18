/* 
Stay in the Light v0.0.12
Last Updated: 2017-September-17
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped tile map object
var MapWrapper = function(center) {
	// Publicly accessible functionality.
	var tileMap = {};

	/*** Internal Variables ***/
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

	var enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];
	var currentEnemyGraphic;

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
	// Prevents the procedural recursion from going too far.
	var hexDepth = 6;
	// Tracks current hextant player is hovering near
	var hextant = null;
	// Keeps track of last mouse move event for the reuse of mouseMoveHandler.
	var lastMouseMoveEvent = null;
	var level = 1;
	// Prevents the procedural unhide recursion from going too far.
	var revealDepth = 1;
	// Hash table of all tiles in map.
	var tileTable = {};
	// Array of passable nodes. Used for quick check of game over, no islands, and win scenario.
	var freeNodes = [];

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
		// Constant size of the hex tile.
		var size = 25;
		var drawTerrain = function(terrain, isHidden, isDark, isPlayer, isEnemy) {
			var fillColor;
			if(terrain === 'forest') {
				// The base tile without hover borders.
				fillColor = 0x006400;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
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
			} else if(terrain === 'desert') {
				// The base tile without hover borders.
				fillColor = 0xEDC9AF;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
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
			} else if(terrain === 'mountains') {
				// The base tile without hover borders.
				fillColor = 0x968D99;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
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
			} else if(terrain === 'pit') {
				// The base tile without hover borders.
				fillColor = 0x654321;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
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
			} else if(terrain === 'water') {
				// The base tile without hover borders.
				fillColor = 0x40A4DF;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
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
				fillColor = 0x000000;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0x333333, 2);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					hexagon.lineTo(x_k, y_k);
				}
				hexagon.endFill();
			}
			if(isDark) {
				// Layer to illustrate a fog of war effect.
				darkLayer.clear();
				fillColor = 0x008080;
				darkLayer.moveTo(cX + size, cY);
				darkLayer.beginFill(fillColor, 0.8);
				for (var k = 0; k <= 6; k++) {
					var angle = 2 * Math.PI / 6 * k;
					var x_k = cX + size * Math.cos(angle);
					var y_k = cY + size * Math.sin(angle);
					darkLayer.lineTo(x_k, y_k);
				}
				darkLayer.endFill();
			} else {
				darkLayer.clear();
			}
			if(isHidden) {
				// Layer to illustrate a fog of war effect.
				hiddenLayer.clear();
				fillColor = 0x999999;
				hiddenLayer.moveTo(cX + size, cY);
				hiddenLayer.beginFill(fillColor, 0.7);
				hiddenLayer.strokeStyle = (3, 0x000000, 0.8);
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
			if(isDark) {
				// Layer to illustrate a fog of war effect.
				darkLayer.clear();
				darkLayer.moveTo(cX + size, cY);
				darkLayer.beginFill(0x008080, 0.8);
				darkLayer.strokeStyle = (3, 0x000000, 0.8);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					darkLayer.lineTo(x_i, y_i);
				}
				darkLayer.endFill();
			} else {
				darkLayer.clear();
			}
			if(isPlayer) {
				// Layer to illustrate a fog of war effect.
				hoverLayer.clear();
				fillColor = 0xFFFF00;
				hoverLayer.moveTo(cX + size, cY);
				hoverLayer.beginFill(fillColor, 0.5);
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
			if(isEnemy) {
				if(currentEnemyGraphic) {
					tileMap.enemyLayerContainer.removeChild(currentEnemyGraphic);
				}
				currentEnemyGraphic = enemies[3];
				currentEnemyGraphic.x = cX;
				currentEnemyGraphic.y = cY - 5;
				tileMap.enemyLayerContainer.addChild(currentEnemyGraphic);
			}
		};

		return {
			addEnemy: function() {
				this.state.isEnemy = true;
				this.draw(9);
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
				// Lets graphic be accessible from Tile object.
				this.graphique = hexagon;
			},
			// Draws the tile and its outline boundary.
			draw: function(line, col) {
				if(col === undefined) {
					col = 0x00FF00;
				}
				hexagon.clear();
				hoverLine.clear();
				hoverLayer.clear();
				drawTerrain(this.type, this.state.isHidden, this.state.isDark, this.state.isPlayer, this.state.isEnemy);
				var lineConvert = line - 2;
				if(lineConvert <= 0) lineConvert += 6;
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
					if(line) {
						if(currentPlayerGraphic) {
							tileMap.hoverContainer.removeChild(currentPlayerGraphic);
						}
						currentPlayerGraphic = players[line - 1];
						currentPlayerGraphic.x = cX;
						currentPlayerGraphic.y = cY - 5;
						tileMap.hoverContainer.addChild(currentPlayerGraphic);
					}
				}
			},
			hide: function() {
				this.state.isHidden = true;
				this.draw(9);
			},
			id: '',
			goDark: function() {
				this.state.isDark = true;
				this.draw(9);
			},
			goLight: function() {
				this.state.isDark = false;
				this.draw(9);
			},
			graphique: null,
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
			removeEnemy: function() {
				this.state.isEnemy = false;
				if(currentEnemyGraphic) {
					tileMap.enemyLayerContainer.removeChild(currentEnemyGraphic);
				}
				this.draw(9);
			},
			setActive: function() {
				this.state.isPlayer = true;
				activeTile = this;
				this.draw(9);
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
				isHidden: false,
				isEnemy: false,
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

			makeNeighborNodes(startNode, 0);

			showTiles(activeTile, 0);

			if(checkForIslands(startNode)) {
				break;
			} else {
				console.log('Islands found! Trying again.');
				tileTable = [];
				freeNodes = [];
				tileMap.terrainContainer = new PIXI.Container();
				tileMap.hiddenLayerContainer = new PIXI.Container();
				tileMap.darkLayerContainer = new PIXI.Container();
				tileMap.hoverContainer = new PIXI.Container();
				tileMap.enemyLayerContainer = new PIXI.Container();
			}
		};
	};
	// Starts from the center node and verifies that all passable nodes are reachable
	// from the center. If the center can reach them all, then any other passable node
	// can reach any other passable node.
	var checkForIslands = function(startNode) {
		var initialFreeNodesLenth = freeNodes.length;
		var tempFreeNodes = [];
		for(var i = 0; i < initialFreeNodesLenth; i++) {
			tempFreeNodes.push(freeNodes[i]);
		}

		while(tempFreeNodes.length) {
			if(hasReachablePath(startNode, tempFreeNodes[0], 0)) {
				var percentComplete = Math.ceil((1 - (tempFreeNodes.length/initialFreeNodesLenth)) * 100);
				tempFreeNodes.splice(0, 1);
			} else {
				return false;
			}
		}
			
		return true;
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
	// Picks, at random, a tile in the tileTable where an enemy might start.
	// This spot makes sure it isn't on the player, isn't adjacent to the player,
	// and isn't on an impassable tile.
	var findEnemyTile = function() {
		var tileTableArray = Object.keys(tileTable);
		var isTileFound = false;
		var tile = null;
		do {
			var tileKey = tileTableArray[Math.floor(Math.random() * tileTableArray.length)];
			tile = tileTable[tileKey];
			isTileFound = isPassable(tile) && isNotNearPlayer(tile);
		} while(!isTileFound);
		tile.addEnemy();
		return tile;
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
		if(activeTile) {
			var oldActive = activeTile;
			if(oldActive['link' + hextant] && oldActive['link' + hextant].passable) {
				oldActive.setInactive();
				oldActive['link' + hextant].setActive();
				// If it was dark, make it light.
				if(oldActive['link' + hextant].state.isDark) {
					oldActive['link' + hextant].goLight();
				}
				// If enemy present, game over
				if(oldActive['link' + hextant].state.isEnemy) {
					console.log('Collision with enemy. Player loses.');
					oldActive['link' + hextant].goDark();
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
			}
		}
	};
	// Detects when the mouse moves and calculates which hex-rant player is hovering over.
	var mouseMoveHandler = function(e) {
		lastMouseMoveEvent = e;
		if(activeTile) {
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

		if(isStarter || rando < 75) {
			if(rando >= 0 && rando < 45) return 'forest';
			else if(rando >= 45 && rando < 70) return 'desert';
			else return 'mountains';
		} else {
			if(rando >= 75 && rando < 80) return 'pit';
			else if(rando >= 80 && rando < 85) return 'water';
			else return null;
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

	/*** Publicly accessible variables ***/
	tileMap.container = new PIXI.Container();
	tileMap.enemyLayerContainer = new PIXI.Container();
	tileMap.terrainContainer = new PIXI.Container();
	tileMap.hoverContainer = new PIXI.Container();
	tileMap.hiddenLayerContainer = new PIXI.Container();
	tileMap.darkLayerContainer = new PIXI.Container();

	/*** Publicly accessible functions ***/
	tileMap.addPlayer = function() {
		activeTile.draw(4, 0x00FF00);
	}
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
	tileMap.getLightNodes = function() {
		var lightNodes = [];
		for(var i = 0; i < freeNodes.length; i++) {
			if(!freeNodes[i].state.isDark) {
				lightNodes.push(freeNodes[i]);
			}
		}
		return lightNodes;
	};
	// Called after instantiation in order to build the map and all it's connected to.
	tileMap.init = function() {
		// Create map instance here
		// Place center hole at center screen
		buildLevel(level);
		tileMap.terrainContainer.cacheAsBitmap = true;
		tileMap.container.addChild(tileMap.terrainContainer);
		tileMap.container.addChild(tileMap.hiddenLayerContainer);
		tileMap.container.addChild(tileMap.darkLayerContainer);
		tileMap.container.addChild(tileMap.hoverContainer);
		tileMap.container.addChild(tileMap.enemyLayerContainer);
		tileMap.container.addChild(tileMap.darkLayerContainer);
	};
	// Called to increase move enemy from param1 tile to param2 tile.
	tileMap.moveEnemy = function(oldTile, newTile) {
		//console.log('my params INSIDE', oldTile, newTile);
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
			oldTile.removeEnemy();
			oldTile.goDark();
			newTile.goDark();
			newTile.addEnemy();
			return true;
		} else if(!newTile.passable || newTile.state.isEnemy) {
			// Invalid choice in movement.
			// Can't go back to dark tile, can't move to impassable tile, can't share tile with other enemy.
			console.log(
				'Already Dark: ' + newTile.state.isDark,
				'Not passable: ' + !newTile.passable,
				'Enemy already here: ' + newTile.state.isEnemy);
			return false;
		} else {
			oldTile.removeEnemy();
			oldTile.goDark();
			newTile.goDark();
			newTile.addEnemy();
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
		return findEnemyTile();
	};

	/*** Document level event listeners ***/
	// Captures click of mouse and passes on to handler.
	document.addEventListener('click', mouseClickHandler);
	// Captures movement of mouse and passes on to handler.
	document.addEventListener('mousemove', mouseMoveHandler);

	// Pass publically accessible functionality back to main wrapper.
	return tileMap;
};