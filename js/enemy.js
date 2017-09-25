/* 
Stay in the Light v0.0.13
Last Updated: 2017-September-17
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
	//Tile values judged by A.I. for pathing
	var nullSpace = 0;
	var impassableSpace = 0;
	var playerSpace = 1000;
	var darkSpace = 0;
	var lightSpace = 10;
	var enemySpace = 0;

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to EnemyWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to EnemyWrapper go here
	 * aka starts with 'var'
	**/

	//Recursive function that decides stength of any particular move
	var superDecider = function(curTile, limiter){
		//Define current starting values for accumulation and testing
		var startDepth = 1;
		var moveValue =[0,0,0,0,0,0];
		var searchStrategy = [['6','1','2'], ['1','2','3'], ['2','3','4'], ['3','4','5'], ['4','5','6'], ['5','6','1']];

		for(var j = 1; j <= 6; j++) {
			if(!curTile['link' + j]){
				moveValue[j - 1] = Number.NEGATIVE_INFINITY;
				console.log("null at " + j);
			}
			else if(curTile['link' + j].state.isEnemy) {
				moveValue[j - 1] = Number.NEGATIVE_INFINITY;
				console.log("isEnemy at " + j);
			}
			else if(!curTile['link' + j].passable) {
				moveValue[j - 1] = Number.NEGATIVE_INFINITY;
				console.log("impassable at " + j);
			}
			else if(curTile['link' + j].state.isPlayer){
				moveValue[j - 1] = Number.POSITIVE_INFINITY;
				console.log("isPlayer at " + j);
			}
			else if(!curTile['link' + j].state.isDark) {
				moveValue[j - 1] = 50000;
				moveValue[j - 1] += examineOut(curTile['link' + j], searchStrategy[j - 1], startDepth, limiter);
				console.log("isLightSpace at " + j);
			}
			else {
				moveValue[j - 1] += examineOut(curTile['link' + j], searchStrategy[j - 1], startDepth, limiter);
				console.log("isdark at " + j)
			}
		}
		//Determine winner of all returned path options
		var winner = Math.max(moveValue[0], moveValue[1], moveValue[2], moveValue[3], moveValue[4], moveValue[5]);
		console.log("Winning Number " + winner);
		for(var i = 0; i < 6; i++) {
			if(winner === moveValue[i]){
				//return index of matching winning value returned from max
				console.log("Tile Winner " + i + "   --> remember to add 1");
				return i + 1;
			}
		}
		// Dev Mode: Should not reach here, but just in case. ERROR
		console.log("Enemy could not decide on a path. Unknown error in EXECUTION");
		return 0;
	};

	var examineOut = function(nextTile, searchPattern, depth, limiter){
		//Check to see if limiter has been reached (Cannot go further) 
		if(depth > limiter) {
			return 0;
		}
		//Ensure that tile being examined is not undefined
		if(!nextTile){
			return nullSpace;
		}
		else if(!nextTile.passable)
		{
			return impassableSpace;
		}
		else {
			//Return current tile value and send examiner to next 3 tiles in search pattern
			return examineOut(nextTile['link' + searchPattern[0]], searchPattern, depth+1, limiter) 
				+ examineOut(nextTile['link' + searchPattern[1]], searchPattern, depth+1, limiter) 
				+ examineOut(nextTile['link' + searchPattern[2]], searchPattern, depth+1, limiter)
				+ tileValue(nextTile, depth);
		}
	};

	//Returns the value of importance for tile porportional to enemy distance
	var tileValue = function(curTile, adjustForDistance){
		//Check to see if tile passed in is null
		if(!curTile) {
			return nullSpace;
		}
		//Check to see current tile space
		else if(curTile.state.isPlayer) {
			//MUST be player space
			return playerSpace / adjustForDistance;
		}
		else if(curTile.state.isEnemy) {
			//MUST be enemySpace
			return enemySpace;
		}
		else if(!curTile.passable) {
			//MUST be impassable space
			return impassableSpace;
		}
		else if(curTile.state.isDark) {
			//MUST be dark space
			return darkSpace;
		}
		else {
			//MUST be light space
			return lightSpace / adjustForDistance;
		}
	};

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

		if(tileNumber === 1){
			//console.log('my params', enemyTile, enemyTile.link1);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link1)){
					enemyTile = enemyTile.link1;
				} else {
					/** Something went wrong in choosing a next tile **/
				}
		}
		if(tileNumber === 2){
			//console.log('my params', enemyTile, enemyTile.link2);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link2)){
					enemyTile = enemyTile.link2;
				} else {
					/** Something went wrong in choosing a next tile **/
				}
		}
		if(tileNumber === 3){
			//console.log('my params', enemyTile, enemyTile.link3);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link3)){
					enemyTile = enemyTile.link3;
				} else {
					/** Something went wrong in choosing a next tile **/
				}
		}
		if(tileNumber === 4){
			//console.log('my params', enemyTile, enemyTile.link4);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link4)){
					enemyTile = enemyTile.link4;
				} else {
					/** Something went wrong in choosing a next tile **/
				}
		}if(tileNumber === 5){
			//console.log('my params', enemyTile, enemyTile.link5);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link5)){
					enemyTile = enemyTile.link5;
				} else {
					/** Something went wrong in choosing a next tile **/
				}
		}if(tileNumber === 6){
			//console.log('my params', enemyTile, enemyTile.link6);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link6)){
					enemyTile = enemyTile.link6;
				} else {
					/** Something went wrong in choosing a next tile **/
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
		if(mode > (options - 1)){
			mode = 0;
		}
	};

	var checkPlayer = function(){
		//If -1 returned, player is not nearby else the player is on the return number
		var decisiveMove = -1;
		//Check to see if enemey is nearby to change enemy priority for a strike
		for(var i = 1; i <= 6; i++) {
			if(enemyTile['link' + i]) {
				if(enemyTile['link' + i].isPlayer) {
					decisiveMove = i;
				}
			}
		}
		return decisiveMove;
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

		//Call upon superDecider to check next move (Only form of activity)
		var decisive;
		decisive = superDecider(enemyTile, 5);
		makeMove(decisive);
	};

	return Enemy;
};