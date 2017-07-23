/* 
Stay in the Light v0.0.1
Last Updated: 2017-July-17
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped tile map object
var MapWrapper = function(container, center) {
	var level = 1;
	var hexDepth = 6;
	var tileMap = {};
	var tileTable = {};

	var Tile = function(cX, cY, abc) {
		var hexagon = new PIXI.Graphics();
		var size = 25;

		var col = 0xFFFFFF;
		if(abc) col = 0x777777;

		return {
			build: function() {
				hexagon.moveTo(cX + size, cY);
				hexagon.beginFill(col);
				hexagon.lineStyle(2, 0xFF88FF, 2);
				for (var i = 0; i <= 6; i++) {
					var angle = 2 * Math.PI / 6 * i,
					x_i = cX + size * Math.cos(angle),
					y_i = cY + size * Math.sin(angle);
					hexagon.lineTo(x_i, y_i);
				}
				hexagon.endFill();

				// Attach the star to the stage.
				container.addChild(hexagon);
			},
			link1: null,
			link2: null,
			link3: null,
			link4: null,
			link5: null,
			link6: null,
			position: {
				x: cX,
				y: cY
			}
		};
	};

	var buildLevel = function(level) {
		// Create first hex node.
		var startNode = new Tile(center.x, center.y, true);
		startNode.build();
		tileTable[center.x + '-' + center.y] = startNode;

		makeNeighborNodes(startNode, 0);

		console.log(tileTable);
	};

	var makeNeighborNodes = function(centerNode, count) {
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node directly above, so make one.
		if(count < hexDepth
			&& centerNode.link1 === null
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y - 45)] === undefined
		) {
			var node = new Tile(centerNode.position.x, (centerNode.position.y - 45));
			node.build();
			tileTable[centerNode.position.x + '-' + (centerNode.position.y - 45)] = node;
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
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y - 45)] !== undefined
		) {
			centerNode.link1 = tileTable[centerNode.position.x + '-' + (centerNode.position.y - 45)];
			tileTable[centerNode.position.x + '-' + (centerNode.position.y - 45)].link4 = centerNode;
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Still more nodes to make
		// No node to the upper right, so make one.
		if(count < hexDepth
			&& centerNode.link2 === null
			&& tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 22)] === undefined
		) {
			var node = new Tile((centerNode.position.x + 39), (centerNode.position.y - 22));
			node.build();
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 22)] = node;
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
			&& tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 22)] !== undefined
		) {
			centerNode.link2 = tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 22)];
			tileTable[(centerNode.position.x + 39) + '-' + (centerNode.position.y - 22)].link5 = centerNode;
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
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y + 45)] === undefined
		) {
			var node = new Tile(centerNode.position.x, (centerNode.position.y + 45));
			node.build();
			tileTable[centerNode.position.x + '-' + (centerNode.position.y + 45)] = node;
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
			&& tileTable[centerNode.position.x + '-' + (centerNode.position.y + 45)] !== undefined
		) {
			centerNode.link4 = tileTable[centerNode.position.x + '-' + (centerNode.position.y + 45)];
			tileTable[centerNode.position.x + '-' + (centerNode.position.y + 45)].link1 = centerNode;
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
			&& tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 22)] === undefined
		) {
			var node = new Tile((centerNode.position.x - 39), (centerNode.position.y - 22));
			node.build();
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 22)] = node;
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
			&& tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 22)] !== undefined
		) {
			centerNode.link6 = tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 22)];
			tileTable[(centerNode.position.x - 39) + '-' + (centerNode.position.y - 22)].link3 = centerNode;
		}

		if(count === hexDepth) return;

		// Now to recursively build out from this node's neighbors
		for(var i = 1; i <= 6; i++) {
			makeNeighborNodes(centerNode['link' + i], count + 1);
		}
	};

	tileMap.init = function() {
		// Create map instance here
		// Place center hole at center screen
		buildLevel(level);
	};

	tileMap.move = function(direction) {
		// Move player to new tile
	};

	tileMap.nextLevel = function() {
		// Increases level by one, and instigates a rebuild of the map.
		level++;
		buildLevel(level);
	};

	return tileMap;
};