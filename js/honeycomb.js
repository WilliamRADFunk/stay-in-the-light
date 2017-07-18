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
	var tileMap = {};
	var tileTable = {};

	var Tile = function(cX, cY) {
		var hexagon = new PIXI.Graphics();
		var size = 25;
		hexagon.moveTo(cX + size, cY);
		hexagon.beginFill(0xFFFFFF);
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

		tileTable[cX + '-' + cY] = hexagon;
	};

	var buildLevel = function(level) {
		var numHexes = level * 12;
		var count = 0;

		new Tile(center.x, center.y);
		new Tile(center.x, center.y + 45);
		new Tile(center.x, center.y - 45);
		new Tile(center.x + 39, center.y + 23);
		new Tile(center.x - 39, center.y + 23);
		new Tile(center.x + 39, center.y - 22);
		new Tile(center.x - 39, center.y - 22);
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