/* 
Stay in the Light v0.0.6
Last Updated: 2017-August-13
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped enemy object
var EnemyWrapper = function(center, tileMap) {
	// Publicly accessible functionality.
	var Enemy = {};
	var enemyTile = null;
	
	/**
	 * variables accessible to everything internal to EnemyWrapper go here
	 * aka starts with 'var'
	**/

	//Starting mode that prevents enemy operations and controls 'turn-by-turn' behavior
	var mode = -1;
	var tileToMove = -1;
	//Dictates amount of 'turn-by-turn' modes the enemy can have
	const options = 3;
	//Sets a boolean decider to all false [modeOptions]
	var modeOptions = [];
	for (n = 0; n < options; ++n) {
		modeOptions[n] = false;
	}

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to EnemyWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to EnemyWrapper go here
	 * aka starts with 'var'
	**/
	var resetModeOptions = function(){
		for(n = 0; n < options; ++n){
			modeOptions[n] = true;
		}
	};

	var recalculate = function(){
		//Will decide starting direction the enemy should go. (0 --> links1 || links2,  1 --> links3 || links4,  2 --)
		if(mode === -1)
		{
			//pick a new mode (direction)
			var rand = (Math.floor(Math.random() * options));
			mode = rand;
		}
		else{
			//Increment mode to cycle through options.
			bumpMove();
			//takeTurn();
		}
	};

	var makeMove = function(tileNumber){

		tileToMove = tileNumber;
		//first check for FORCED DECISIONS (EX: player tile is next to enemy on move update)
		//tileToMove = checkMove(tileNumber);
		//Simple Movement Command when tile space to move to is SET
		if(tileNumber === 1){
			//console.log('my params', enemyTile, enemyTile.link1);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link1)){
					enemyTile = enemyTile.link1;
				} else {
					// 	/** Something went wrong in choosing a next tile **/
				}
		}
		if(tileNumber === 2){
			//console.log('my params', enemyTile, enemyTile.link2);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link2)){
					enemyTile = enemyTile.link2;
				} else {
					// 	/** Something went wrong in choosing a next tile **/
				}
		}
		if(tileNumber === 3){
			//console.log('my params', enemyTile, enemyTile.link3);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link3)){
					enemyTile = enemyTile.link3;
				} else {
					// 	/** Something went wrong in choosing a next tile **/
				}
		}
		if(tileNumber === 4){
			//console.log('my params', enemyTile, enemyTile.link4);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link4)){
					enemyTile = enemyTile.link4;
				} else {
					// 	/** Something went wrong in choosing a next tile **/
				}
		}if(tileNumber === 5){
			//console.log('my params', enemyTile, enemyTile.link5);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link5)){
					enemyTile = enemyTile.link5;
				} else {
					// 	/** Something went wrong in choosing a next tile **/
				}
		}if(tileNumber === 6){
			//console.log('my params', enemyTile, enemyTile.link6);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link6)){
					enemyTile = enemyTile.link6;
				} else {
					// 	/** Something went wrong in choosing a next tile **/
				}
		}
	};

	var checkMoves = function(){
		//Check if link spaces are not transversable or if 'empty' (EDGE CASES)
		if(enemyTile.link1 == null && enemyTile.link2 == null){
			modeOptions[0] = false;
		}

		if(enemyTile.link3 == null && enemyTile.link4 == null){
			modeOptions[1] = false;
		}

		if(enemyTile.link5 == null && enemyTile.link6 == null){
			modeOptions[2] = false;
		}
	};

	var bumpMove = function(){
		mode++;
		if(mode > options){
			mode = 0;
		}
	};

	var checkPlayer = function(originalMove){
		var decisiveMove = -1;

		//Check to see if enemey is nearby to change enemy priority for a strike
		if(enemyTile.link1.state.isPlayer){
			decisiveMove = 1;
		}
		else if(enemyTile.link2.state.isPlayer){
			decisiveMove = 2;
		}
		else if(enemyTile.link3.state.isPlayer){
			decisiveMove = 3;
		}
		else if(enemyTile.link4.state.isPlayer){
			decisiveMove = 4;
		}
		else if(enemyTile.link5.state.isPlayer){
			decisiveMove = 5;
		}
		else if(enemyTile.link6.state.isPlayer){
			decisiveMove = 6;
		}

		if(decisiveMove !== -1){
			//Player is not nearby, therefore stay on current route
			return decisiveMove;
		} else {
			return originalMove;
		}
	};

	var checkDark = function(tileNum){

		var verified = true;

		//Check to see if enemy has already colored tile (Basic)
		if(tileNum === 1){
			if(enemyTile.link1.state.isDark){
				return false;
			}
		}
		else if(tileNum === 2){
			if(enemyTile.link2.state.isDark){
				return false;
			}
		}
		else if(tileNum === 3){
			if(enemyTile.link3.state.isDark){
				return false;
			}
		}
		else if(tileNum === 4){
			if(enemyTile.link4.state.isDark){
				return false;
			}
		}
		else if(tileNum === 5){
			if(enemyTile.link5.state.isDark){
				return false;
			}
		}
		else if(tileNum === 6){
			if(enemyTile.link6.state.isDark){
				return false;
			}
		} else {
			return false;
		}
	};

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
		recalculate();
		enemyTile = tileMap.placeEnemy();
		console.log("enemyTile was initialized!");
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

		//Determine which 2 set tile the enemey will move
		var rand = Math.floor(Math.random() * 2);

		// if(enemyTile.link1 === null){
		// 	console.log("link 1 is null or undefined");
		// }
		// if(enemyTile.link2 === null){
		// 	console.log("link 2 is null or undefined");
		// }
		// if(enemyTile.link3 === null){
		// 	console.log("link 3 is null or undefined");
		// }
		// if(enemyTile.link4 === null){
		// 	console.log("link 4 is null or undefined");
		// }
		// if(enemyTile.link5 === null){
		// 	console.log("link 5 is null or undefined");
		// }
		// if(enemyTile.link6 ===  null){
		// 	console.log("link 6 is null or undefined");
		// }

		//Movement logic Shell (SIMPLE) 
		//Mode currently means direction (3 directions)

		if(mode === 0){
			if(rand === 0 && enemyTile.link1 != null){
				makeMove(1);
			}else if(enemyTile.link2 != null) {
				makeMove(2);
			}
			else if(enemyTile.link1 != null){
				makeMove(1);
			}
			else
			{
				//No viable options, change direction
				recalculate();
			}
		}
		else if(mode === 1){
			if(rand === 0 && enemyTile.link3 !=null){
				makeMove(3);
			}else if(enemyTile.link4 != null) {
				makeMove(4);
			}
			else if(enemyTile.link3 != null){
				makeMove(3);
			}
			else{
				recalculate();
			}
		}
		else if(mode === 2){
			if(rand === 0 && enemyTile.link5 != null){
				makeMove(5);
			} else if(enemyTile.link6 != null) {
				makeMove(6);
			}else if(enemyTile.link5 != null){
				makeMove(5);
			}
			else{
				recalculate();
			}
		}
	};

	return Enemy;
};