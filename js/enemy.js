/* 
Stay in the Light v0.0.7
Last Updated: 2017-August-13
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped enemy object
var EnemyWrapper = function(center, tileMap) {
	// Publicly accessible functionality.
	var Enemy = {};
	// Used when an incremental stage of loading is completed.
	var loadingEvent = new Event('loading');
	
	var enemyTile = null;
	/**
	 * variables accessible to everything internal to EnemyWrapper go here
	 * aka starts with 'var'
	**/

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to EnemyWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to EnemyWrapper go here
	 * aka starts with 'var'
	**/

	/**
	 * variables accessible publicly from EnemyWrapper go here
	 * aka starts with 'Enemy'
	**/

	/**
	 * functions accessible publicly from EnemyWrapper go here
	 * aka starts with 'Enemy'
	**/

	// Should decide where to instantiate the enemy on the tile map,
	// and setup any internal logic for the enemy.
	Enemy.init = function() {
		// Note: tileMap is passed in to make api accessible
		// (ie. tileMap.placeEnemy(); will pick a suitable place to
		// insatiate the enemy, and return a Tile).
		enemyTile = tileMap.placeEnemy();
	};

	// From here, internal logic will determine which
	// of the six directions the enemy will take, returning
	// object containing the old tile, and new tile.
	Enemy.takeTurn = function() {
		// Note: the enemy's tile (enemyTile) has access to 6 links
		// link1, link2, link3...etc.
		// From these tiles, their 'state' and 'passable' are accessible
		// (ie. enemyTile.link1.state.isPlayer will tell you if the player is directly above
		// the enemy's current tile. enemyTile.link1.state.isDark will tell you if that same tile
		// has already been converted to darkness, etc.).

		// When decision is made...do this.
		// if(tileMap.moveEnemy(enemyTile, enemyTile.link3)) {
		// 	enemyTile = enemyTile.link3;
		// } else {
		// 	/** Something wnet wrong in choosing a next tile **/
		// }
	};

	// Return public api object at very end.
	return Enemy;
};