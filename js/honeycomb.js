/* 
Stay in the Light v0.0.1
Last Updated: 2017-July-23
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
		var oldActive = activeTile;
		if(oldActive['link' + hextant]) {
			oldActive.setInactive();
			oldActive['link' + hextant].setActive();
		}
	};
	// Captures click of mouse and passes on to handler.
	document.addEventListener('click', mouseClickHandler);
	// Detects when the mouse moves and calculates which hex-rant player is hovering over.
	var mouseMoveHandler = function(e) {
		var xDiff = activeTile.position.x - e.clientX;
		var yDiff = activeTile.position.y - e.clientY;
		var angle = Math.atan2(yDiff, xDiff);
		angle += Math.PI;
		angle = angle * 180 / Math.PI;
		// Redraws tile with one border highlighted.
		if(angle >= 0 && angle < 60) {
			activeTile.draw(3);
			hextant = 3;
		} else if(angle >= 60 && angle < 120) {
			activeTile.draw(4);
			hextant = 4;
		} else if(angle >= 120 && angle < 180) {
			activeTile.draw(5);
			hextant = 5;
		} else if(angle >= 180 && angle < 240) {
			activeTile.draw(6);
			hextant = 6;
		} else if(angle >= 240 && angle < 300) {
			activeTile.draw(1);
			hextant = 1;
		} else if(angle >= 300 && angle < 360) {
			activeTile.draw(2);
			hextant = 2;
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

		return {
			// Sets up the basic tile info, and determines (based off neighbors) what it is.
			build: function(isPlayer=false, isDark=false, isHidden=false, isEnemy=false, isPassable=true) {
				this.isPlayer = isPlayer;
				this.passable = isPassable;
				this.isDark = isDark;
				this.isHidden = isHidden;
				this.isEnemy = isEnemy;
				// Player tile has special hover color.
				var col = 0xAAFFAA;
				if(isPlayer) {
					col = 0xAAAA00;
					activeTile = this;
				}
				// Runs drawing functionality.
				this.draw(9, col);
				// Attach the tile to the stage.
				tileMap.container.addChild(hexagon);
				// Lets graphic be accessible from Tile object.
				this.graphique = hexagon;
			},
			// Draws the tile and its outline boundary.
			draw: function(line, col) {
				hexagon.clear();
				hoverLine.clear();
				// The base tile without hover borders.
				var fillColor = col || 0xAAAA00;
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(fillColor);
				hexagon.lineStyle(3, 0xFF88FF, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();
				var lineConvert = line - 2;
				if(lineConvert <= 0) lineConvert += 6;
				// If hoverline redraw thicker boundary, with one hextant as green.
				if(lineConvert > 0 && lineConvert <= 6) {
					hoverLine.moveTo(cX + size, cY);
					for (var i = 0; i <= 6; i++) {
						if(i === lineConvert) {
							hoverLine.lineStyle(4, 0x00FF00, 2);
						} else {
							hoverLine.lineStyle(4, 0xFF88FF, 2);
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
				this.draw(9, 0xAAAA00);
				this.state.isPlayer = true;
				activeTile = this;
			},
			setInactive: function() {
				this.draw(9, 0xAAFFAA);
				this.state.isPlayer = false;
				activeTile = null;
			},
			state: {
				isDark: false,
				isHidden: false,
				isEnemy: false,
				isPlayer: false,
			},
			type: 'plain'
		};
	};
	// Creates center node and passes it into the procedurally recursive function.
	var buildLevel = function(level) {
		// Create first hex node.
		var startNode = new Tile(center.x, center.y, true);
		startNode.build(true, false, false, false, true);
		tileTable[center.x + '-' + center.y] = startNode;

		makeNeighborNodes(startNode, 0);

		console.log(tileTable);
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
			node.build();
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
			node.build();
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
			node.build();
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
			node.build();
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
			node.build();
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
			node.build();
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