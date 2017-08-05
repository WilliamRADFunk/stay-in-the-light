/* 
Stay in the Light v0.0.3
Last Updated: 2017-August-05
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped tile map object
var MapWrapper = function(center) {
	var level = 1;
	// Prevents the procedural recursion from going too far.
	var hexDepth = 6;
	// Tracks current hextant player is hovering near
	var hextant = null;
	// Player's current tile. Used to determine directionality of mouse placement.
	var activeTile = null;
	// Publicly accessible functionality.
	var tileMap = {};
	// Hash table of all tiles in map.
	var tileTable = {};
	// Detects when the mouse clicks and moves player to new tile.
	var mouseClickHandler = function(e) {
		if(activeTile) {
			var oldActive = activeTile;
			if(oldActive['link' + hextant] && oldActive['link' + hextant].passable) {
				oldActive.setInactive();
				oldActive['link' + hextant].setActive();
				if(activeTile['link' + hextant] && activeTile['link' + hextant].passable) {
					activeTile.draw(hextant, 0x00FF00);
				} else {
					activeTile.draw(hextant, 0xFF0000);
				}
			}
		}
	};
	// Captures click of mouse and passes on to handler.
	document.addEventListener('click', mouseClickHandler);
	// Detects when the mouse moves and calculates which hex-rant player is hovering over.
	var mouseMoveHandler = function(e) {
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
	// Captures movement of mouse and passes on to handler.
	document.addEventListener('mousemove', mouseMoveHandler);
	// Tile creator
	var Tile = function(cX, cY) {
		// Base tile.
		var hexagon = new PIXI.Graphics();
		// Additional border to show player's direction focus.
		var hoverLine = new PIXI.Graphics();
		// Constant size of the hex tile.
		var size = 25;
		var drawTerrain = function(terrain, isHidden, isDark) {
			if(terrain === 'forest') {
				// The base tile without hover borders.
				var fillColor = 0x006400;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0x006400, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();
				var treeRoot = [
					[0, 0], [2, 2], [-3, -3], [5, 5], [-7, -7],
					[10, 10], [2, -2], [-3, 3], [5, -5], [-7, 7],
					[10, -10], [9, 14], [-9, 14], [14, 9], [14, 9],
					[18, 0], [-18, 0], [2, 18], [6, 17], [-6, 17]
				];
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
				var fillColor = 0xEDC9AF;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0xEDC9AF, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();
				var cactus = [
					[0, 0], [5, 5], [-7, -7], [-9, 14],
					[6, 17], [-6, 17], [6, -12], [14, 0]
				];
				hexagon.lineStyle(0.5, 0x006400, 1);
				for(var i = 0; i < cactus.length; i++) {
					hexagon.moveTo(cX + cactus[i][0], cY + cactus[i][1]);
					hexagon.lineTo(cX + cactus[i][0], cY + cactus[i][1] - 10);
					hexagon.moveTo(cX + cactus[i][0] - 1, cY + cactus[i][1] - 10);
					hexagon.lineTo(cX + cactus[i][0] + 1, cY + cactus[i][1] - 10);
					hexagon.lineTo(cX + cactus[i][0], cY + cactus[i][1] - 8);
					hexagon.moveTo(cX + cactus[i][0] - 1, cY + cactus[i][1] - 8);
					hexagon.lineTo(cX + cactus[i][0] + 1, cY + cactus[i][1] - 8);
					hexagon.lineTo(cX + cactus[i][0], cY + cactus[i][1] - 6);
					hexagon.moveTo(cX + cactus[i][0] - 1, cY + cactus[i][1] - 6);
					hexagon.lineTo(cX + cactus[i][0] + 1, cY + cactus[i][1] - 6);
					hexagon.lineTo(cX + cactus[i][0], cY + cactus[i][1] - 4);
					hexagon.moveTo(cX + cactus[i][0] - 1, cY + cactus[i][1] - 4);
					hexagon.lineTo(cX + cactus[i][0] + 1, cY + cactus[i][1] - 4);
					hexagon.lineTo(cX + cactus[i][0], cY + cactus[i][1] - 2);
					hexagon.moveTo(cX + cactus[i][0] - 1, cY + cactus[i][1] - 2);
					hexagon.lineTo(cX + cactus[i][0] + 1, cY + cactus[i][1] - 2);
					hexagon.lineTo(cX + cactus[i][0], cY + cactus[i][1]);
					hexagon.moveTo(cX + cactus[i][0] - 1, cY + cactus[i][1]);
					hexagon.lineTo(cX + cactus[i][0] + 1, cY + cactus[i][1]);
					hexagon.moveTo(cX + cactus[i][0] - 3, cY + cactus[i][1] - 5);
					hexagon.lineTo(cX + cactus[i][0] + 3, cY + cactus[i][1] - 5);
					hexagon.moveTo(cX + cactus[i][0] - 4, cY + cactus[i][1] - 7);
					hexagon.lineTo(cX + cactus[i][0] - 2, cY + cactus[i][1] - 7);
					hexagon.moveTo(cX + cactus[i][0] - 4, cY + cactus[i][1] - 9);
					hexagon.lineTo(cX + cactus[i][0] - 2, cY + cactus[i][1] - 9);
					hexagon.moveTo(cX + cactus[i][0] + 4, cY + cactus[i][1] - 7);
					hexagon.lineTo(cX + cactus[i][0] + 2, cY + cactus[i][1] - 7);
					hexagon.moveTo(cX + cactus[i][0] + 4, cY + cactus[i][1] - 9);
					hexagon.lineTo(cX + cactus[i][0] + 2, cY + cactus[i][1] - 9);
				}
			} else if(terrain === 'mountains') {
				// The base tile without hover borders.
				var fillColor = 0x968D99;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0x968D99, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();
				var mountainPeak = [
					[0, 0], [-3, -13], [15, 5], [-7, -7], [-10, 12],
					[10, 10], [2, -2], [-3, 3], [5, -5], [-7, 7],
					[-20, 0], [-16, 4], [0, 20], [-10, -16]
				];
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
				var fillColor = 0x654321;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0x654321, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();
				var pits = [
					[0, 0], [12, 2], [-16, -3], [-7, 15], [-7, -13],
					[3, 10], [6, -16]
				];
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
				var fillColor = 0x40A4DF;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0x40A4DF, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
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
				var fillColor = 0x000000;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0x333333, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();
			}
		};

		return {
			// Sets up the basic tile info, and determines (based off neighbors) what it is.
			build: function(terrain, isPlayer=false, isDark=false, isHidden=false, isEnemy=false, isPassable=true) {
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
				tileMap.container.addChild(hexagon);
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
				drawTerrain(this.type, this.state.isHidden, this.state.isDark);
				var lineConvert = line - 2;
				if(lineConvert <= 0) lineConvert += 6;
				// If hoverline redraw thicker boundary, with one hextant as green.
				if(lineConvert > 0 && lineConvert <= 6) {
					hoverLine.moveTo(cX + size, cY);
					for (var i = 0; i <= 6; i++) {
						if(i === lineConvert) {
							hoverLine.lineStyle(4, col, 2);
						} else {
							hoverLine.lineStyle(4, 0x000000, 2);
						}
						var angle = 2 * Math.PI / 6 * i,
						x_i = cX + size * Math.cos(angle),
						y_i = cY + size * Math.sin(angle);
						hoverLine.lineTo(x_i, y_i);
					}
					// Attach the hoverLine to the stage.
					tileMap.container.addChild(hoverLine);
				}
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
			state: {
				isDark: false,
				isHidden: false,
				isEnemy: false,
				isPlayer: false,
			},
			type: null
		};
	};
	// Creates center node and passes it into the procedurally recursive function.
	var buildLevel = function(level) {
		// Create first hex node.
		var startNode = new Tile(center.x, center.y, true);
		startNode.build(pickTileTerrain(true), true, false, false, false, true);
		tileTable[center.x + '-' + center.y] = startNode;

		makeNeighborNodes(startNode, 0);
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
			node.build(pickTileTerrain());
			tileTable[centerNode.position.x + '-' + (centerNode.position.y - 46)] = node;
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
			node.build(pickTileTerrain());
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 23)] = node;
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
			node.build(pickTileTerrain());
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y + 23)] = node;
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
			node.build(pickTileTerrain());
			tileTable[centerNode.position.x + '-' + (centerNode.position.y + 46)] = node;
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
			node.build(pickTileTerrain());
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y + 23)] = node;
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
			node.build(pickTileTerrain());
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 23)] = node;
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
	tileMap.container = new PIXI.Container();
	// Called after instantiation in order to build the map and all it's connected to.
	tileMap.init = function() {
		// Create map instance here
		// Place center hole at center screen
		buildLevel(level);
	};
	// Called to increase level...and rebuild map.
	tileMap.nextLevel = function() {
		// Increases level by one, and instigates a rebuild of the map.
		level++;
		buildLevel(level);
	};
	// Pass publically accessible functionality back to main wrapper.
	return tileMap;
};