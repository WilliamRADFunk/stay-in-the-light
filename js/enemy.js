/* 
Stay in the Light v0.0.26
Last Updated: 2017-October-28
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped enemy object
var EnemyWrapper = function(center, tileMap, id) {
	// Publicly accessible functionality.
	var Enemy = {};
	Enemy.id = id;
	var enemyTile = null;
	//Starting mode that prevents enemy operations and controls 'turn-by-turn' behavior
	var mode = -1;
	var tileToMove = -1;
	var prePathActive = false;
	var prePathCommand;
	//Dictates amount of 'turn-by-turn' modes the enemy can have
	const options = 3;
	const behaviorThreshold = 0.08;
	var nextMove = 0;
	var lastMoves = [];
	//Amount of starting light tiles.
	var initialLightCount = -1;
	var currentLightCount = -1;
	var currentTileSet;
	//Sets a boolean decider to all false [modeOptions]
	var modeOptions = [];
	for (n = 0; n < options; ++n) {
		modeOptions[n] = false;
	}
	//Tile values judged by A.I. for pathing
	var nullSpace = 0;
	var impassableSpace = 0;
	var playerSpace = 450;
	var darkSpace = 0;
	var lightSpace = 20;
	var enemySpace = 0;
	//Testing boolean
	var test = true;
	//Recursive function that decides stength of any particular move
	var superDecider = function(curTile, limiter){
		//Define current starting values for accumulation and testing
		var startDepth = 1;
		var moveValue =[0,0,0,0,0,0];
		var searchStrategy = [['6','1','2'], ['1','2','3'], ['2','3','4'], ['3','4','5'], ['4','5','6'], ['5','6','1']];
		for(var j = 1; j <= 6; j++) {
			if(!curTile['link' + j]){
				moveValue[j - 1] = Number.NEGATIVE_INFINITY;
			}
			else if(curTile['link' + j].state.isEnemy) {
				moveValue[j - 1] = Number.NEGATIVE_INFINITY;
			}
			else if(!curTile['link' + j].passable) {
				moveValue[j - 1] = Number.NEGATIVE_INFINITY;
			}
			else if(curTile['link' + j].state.isPlayer){
				moveValue[j - 1] = Number.POSITIVE_INFINITY;
			}
			else if(!curTile['link' + j].state.isDark) {
				moveValue[j - 1] = 40;
				moveValue[j - 1] += examineOut(curTile['link' + j], searchStrategy[j - 1], startDepth, limiter);
			}
			else {
				moveValue[j - 1] += examineOut(curTile['link' + j], searchStrategy[j - 1], startDepth, limiter);
			}
		}
		//Determine winner of all returned path options
		var winner = Math.max(moveValue[0], moveValue[1], moveValue[2], moveValue[3], moveValue[4], moveValue[5]);
		for(var i = 0; i < 6; i++) {
			if(winner === moveValue[i]){
				//Return index of matching winning value returned from max
				nextMove = winner;
				var curCoordinates = extractCoordinates(enemyTile.id);
				appendMove(winner, curCoordinates);
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
			//Pick a new mode (direction)
			var rand = (Math.floor(Math.random() * options));
			mode = rand;
		}
		else{
			//Increment mode to cycle through options.
			bumpMove();
		}
	};
	var makeMove = function(tileNumber){
		tileToMove = tileNumber;
		if(tileNumber === 1){
			//console.log('my params', enemyTile, enemyTile.link1);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link1, Enemy.id)){
					enemyTile = enemyTile.link1;
				} else {
					/** Something went wrong in choosing a next tile **/
					makeMove(Math.floor(Math.random() * 6));
				}
		}
		if(tileNumber === 2){
			//console.log('my params', enemyTile, enemyTile.link2);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link2, Enemy.id)){
					enemyTile = enemyTile.link2;
				} else {
					/** Something went wrong in choosing a next tile **/
					makeMove(Math.floor(Math.random() * 6));
				}
		}
		if(tileNumber === 3){
			//console.log('my params', enemyTile, enemyTile.link3);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link3, Enemy.id)){
					enemyTile = enemyTile.link3;
				} else {
					/** Something went wrong in choosing a next tile **/
					makeMove(Math.floor(Math.random() * 6));
				}
		}
		if(tileNumber === 4){
			//console.log('my params', enemyTile, enemyTile.link4);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link4, Enemy.id)){
					enemyTile = enemyTile.link4;
				} else {
					/** Something went wrong in choosing a next tile **/
					makeMove(Math.floor(Math.random() * 6));
				}
		}if(tileNumber === 5){
			//console.log('my params', enemyTile, enemyTile.link5);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link5, Enemy.id)){
					enemyTile = enemyTile.link5;
				} else {
					/** Something went wrong in choosing a next tile **/
					makeMove(Math.floor(Math.random() * 6));
				}
		}if(tileNumber === 6){
			//console.log('my params', enemyTile, enemyTile.link6);
			if(tileMap.moveEnemy(enemyTile, enemyTile.link6, Enemy.id)){
					enemyTile = enemyTile.link6;
				} else {
					/** Something went wrong in choosing a next tile **/
					makeMove(Math.floor(Math.random() * 6));
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
	//Moves enemy to next hex as last resort method. (clockwise)
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
	// Decide where to instantiate the enemy on the tile map,
	// and setup any internal logic for the enemy.
	var updateLightCounter = function(){
		var tempTiles = tileMap.getNonDarkNodes();
		currentLightCount = tempTiles.length;
		return tempTiles;
	};
	//Indicates that the command is not faulty (loop, contains errors, etc.)
	var checkClarivoyance = function(cmdFinal){
		if(!cmdFinal || !cmdFinal[0] || !cmdFinal[1]){
			//Return error
			return false;
		}
		var tmpCmd = cmdFinal[1];
		if(tmpCmd == [] || tmpCmd.includes(-2)){
			//We have hit a familiar path or no path selected
			return false;
		}
		else if(tmpCmd.includes(-1)){
			//Pathing returned one on returned outcome, faulty pathing logic
			return true;
		}
		else{
			return false;
		}
	};
	//Possible V3 A.I function that determines directions to take to get from a start tile to end tile
	var clarivoyance = function(enemyStartTile, enemyEndTile, visitedNodes){
		//Initial Command list that is used when desired direction is met
		var tempVisited = visitedNodes;
		//Check before anything that we have not visited this node before.
		if(visitedNodes.includes(enemyStartTile.id)){
			//We have already visited this node. Kill this route...
			//Make it infinite work to achieve so it is unfavoarable
			return [[25000], [-2]];
		}
		//Extract coordinates for both the start and end coordinates
		var endLocation = extractCoordinates(enemyEndTile.id);
		var startLocation = extractCoordinates(enemyStartTile.id);
		//Determine the final x and y direction on 2-plane axis
		var xDir = endLocation[0] - startLocation[0];
		var yDir = endLocation[1] - startLocation[1];
		//console.log(xDir, yDir);
		//Total the maximum 'distance' remaining
		var totalEffort = (Math.abs(xDir) + Math.abs(yDir));
		//Determine the direction in a 2-axis mode where roughly the A.I. should go
		var command = computeCommand(xDir, yDir);
		//Extract the logical starting direction based roughly off of determined 2-axis direction
		var setDirection = commandReturn(command);

		//If set Direction is -1, we have arrived to the destination
		if(setDirection === -1){
			//We are done moving, return base of commandList for further appending
			//Assumed structure of commandList for interpretation:
			//-------commandList[ARRAY OF TOTALEFFORT][ARRAY OF DIRECTION TO TAKE]
			return [[-1],[-1]];
		}
		tempVisited.unshift(enemyStartTile.id);
		var startDirection = setDirection;
		var commandFinal = [[],[]];
		//THis is the direction we need to go (1 - 6) 
		//However we need to recursion around any structures and find the shortest distance.
		do{
			var commandList = [[],[]];

			if(!enemyStartTile || !enemyStartTile['link' + setDirection] || !enemyStartTile['link' + setDirection].passable){
				//Extra area for A.I. pathing
			}
			else{
				//The direction is not blocked, therefore simply move forward
				commandList = (clarivoyance(enemyStartTile['link' + setDirection], enemyEndTile, tempVisited));
				commandList[0].unshift(totalEffort);
				commandList[1].unshift(setDirection);
				commandFinal = commandList;
			}
			setDirection++;
			if(setDirection >= 7){
				setDirection = 1;
			}
			if(setDirection === startDirection){
				//we have looped completley
				return [[25000],[-2]];
			}
		}while(!checkClarivoyance(commandFinal));
		return commandFinal;
	};

	//Determine shortest turn of given tile when path is blocked on decided direction
	var turn = function(startingDirection, startingTile, leftTurn){
		//Turning left or right?
		if(leftTurn){
			//Find next open left turn number
			var tempDir = startingDirection;
			var passable = false;
			//Loop leftward
			while(!passable){
					tempDir--;
					if(tempDir === startingDirection){
						//WE have looped, we are somehow stuck on an island of some sort
						break;
					}
					if(tempDir <= 0){
						tempDir = 6;
					}
					//console.log(tempDir);
					//Check to see if this is passable
					if(!startingTile['link' + tempDir] || !startingTile['link' + tempDir].passable){
						//NULL
						passable = false;
					}
					else{
						passable = true;
					}
			}
			if(!passable){
				//Something went wrong, we are stuck in an island with this piece
				//console.log("WE SHOULDNT EVER LAND HERE!!!!");
				return -1;
			}
			else{
				return tempDir;
			}
		}
		else{
			var tempDir = startingDirection;
			var passable = false;
			//Loop leftward
			while(!passable){
					tempDir++;
					if(tempDir === startingDirection){
						//WE have looped, we are somehow stuck on an island of some sort
						break;
					}
					//Ensure tempDir does not reach upper bound of turn options
					if(tempDir >= 7){
						tempDir = 1;
					}
					//Check to see if this is passable
					if(!startingTile['link' + tempDir] || !startingTile['link' + tempDir].passable){
						//NULL
						passable = false;
					}
					else{
						passable = true;
					}
			}
			if(!passable){
				//Something went wrong, we are stuck in an island with this piece
				//console.log("WE SHOULDNT EVER LAND HERE!!!!");
				return -1;
			}
			else{
				return tempDir;
			}
		}
	};
		//Utility function to provide summation of provided array
	var sumOfArray = function(sample){
		if(!sample){
			//Missing input
			return -1;
		}
		var total = 0;
		for(var k = 0; k < sample.length; k++){
				total = total + sample[k];
		}
		return total;
	};
	var commandReturn = function(com){
		//console.log("THE COMMAND PROVIDED WAS: " + com);
		if(!com){
			//ERROR
		}
		if(com == [-2,-2]){
			//ERROR
		}
		else{
				//Decide direction
			if(com.toString() == [0,1].toString()){
					//Take direction 1
				return 1;
			}
			else if(com.toString() == [1,1].toString()){
				//Take direction 2
				return 2;
			}
			else if(com.toString() == [1,0].toString()){
				//Take direction 2/3
				return 2;
			}
			else if(com.toString() == [1,-1].toString()){
				//Take direction 3
				return 3;
			}
			else if(com.toString() == [0,-1].toString()){
				//Take direction 3/4
				return 4;
			}
			else if(com.toString() == [-1,-1].toString()){
				return 5;
			}
			else if(com.toString() == [-1, 0].toString()){
				return 5;
			}
			else if(com.toString() == [-1, 1].toString()){
				return 6;
			}
			else if(com.toString() == [0,0].toString()){
				return -1;
			}
		}
	};
	var newDirective = function(){
		//Check to see if we have reached treshold for scanning instructions for next light tile
		//We should commence possible forced route changed dependent on situation.
		//Read current tile map and pull random light tile
			var rand = Math.floor(Math.random() * currentLightCount);
			// console.log("Random Number for new directive initiative: " + rand);
			//Pull x,y coordinates from both light tile and enemyTile.
			var destination = extractCoordinates(currentTileSet[rand].id);
			//console.log("DEV MODE: Destination ID:" + currentTileSet[rand].id);
			var current = extractCoordinates(enemyTile.id);
			//console.log("DEV MODE: Current ID: " + enemyTile.id);
			// console.log("DEV MODE: [][][][][]DESTINATION[][][][][]" + destination);
			// console.log("DEV MODE: [][][][]CURRENT[][][][][][]" + current);
			//Determine direction general 2axis plane direction. (up, down, left, right);
			//I could use this for a recursive mapping to the target
			var xDir = destination[0] - current[0];
			var yDir = destination[1] - current[1];
			//Check if left, right, or neither direction
			var command = computeCommand(xDir, yDir);
			if(command == [-2,-2]){
				//ERROR
			}
			else{
				//Decide direction
				if(command.toString() == [0,1].toString()){
					//Take direction 1
					return 1;
				}
				else if(command.toString() == [1,1].toString()){
					//Take direction 2
					return 2;
				}
				else if(command.toString() == [1,0].toString()){
					//Take direction 2/3
					return 2;
				}
				else if(command.toString() == [1,-1].toString()){
					//Take direction 3
					return 3;
				}
				else if(command.toString() == [0,-1].toString()){
					//Take direction 3/4
					return 4;
				}
				else if(command.toString() == [-1,-1].toString()){
					return 5;
				}
				else if(command.toString() == [-1, 0].toString()){
					return 5;
				}
				else if(command.toString() == [-1, 1].toString()){
					return 6;
				}
			}
			//console.log("DEV MODE: FINAL COMMAND" + command);
			//console.log("DEV MODE: X FINAL: " + xDir + " Y FINAL: " + yDir);
	};
	var extractCoordinates = function(id){
		if(!id){
			//Parameter undefined or null, return with error coordinates
			return [-1,-1];
		}
		var coordinates = [];
		//Pull x and y coordinates and store into 'coordinate array'
		//ERROR: MAY NEED TO CHANGE ACQUISITION TO ALLOW FOR POSSIBLE SMALLER ID LENGTHS
		coordinates = id.split('-');
		return coordinates;
	};
	var computeCommand = function(xDirection, yDirection){
		var tempCommand = [];
		//Determines roughly which direction in axis to take
		if(xDirection > 0){
			//RIGHT on X
			tempCommand.push(1);
		}
		else if(xDirection < 0){
			//LEFT on X
			tempCommand.push(-1);
		}
		else{
			//STAY on current X
			tempCommand.push(0);
		}
			if(yDirection > 0){
			//UP  on X
			tempCommand.push(-1);
		}
		else if(yDirection < 0){
			//DOWN on X
			tempCommand.push(1);
		}
		else{
			//STAY on current X
			tempCommand.push(0);
		}
		return tempCommand;
	};
	//Catalogues recent moves to trigger direct route to new paths
	var appendMove = function(pointValue, coordinate){
		//Ensure that only 3 moves are prepended at any given time so that the check of 'infinite' loop
		var pointIndex = [coordinate, pointValue];
		while(lastMoves.length >= 4){
			lastMoves.pop();
		}
		//Append pointIndex value to lastMoves array
		lastMoves.unshift(pointIndex);
	};
	var checkForLoop = function(){
		if(!lastMoves){
			//No lastMoves exists, return
			return false;
		}
		if(lastMoves.length > 4){
			//Incorrect amount of lastMoves registered.
			console.log("ERROR: lastMoves should not have more than 3 moves.");
			return false;
		}
		if(lastMoves.length < 4){
			console.log("ERROR: last moves should not have less than 3 moves.")
			return false;
		}
		var temp = lastMoves[0];
		var temp1 = lastMoves[1];
		var temp2 = lastMoves[2];
		var temp3 = lastMoves[3];
		//Check to see if cached moves are the same
		if((temp.toString() === temp1.toString())  || (temp.toString() === temp2.toString()) || (temp.toString() === temp3.toString()) || (temp1.toString() === temp2.toString()) || ( temp1.toString() === temp3.toString() ) || ( temp2.toString() === temp3.toString() )){
			//We are stuck in a loop. Return for new directive
			return true;
		}
		
		return false; 
	};
	Enemy.init = function() {
		// Note: tileMap is passed in to make api accessible
		// (ie. tileMap.placeEnemy(); will pick a suitable place to
		// insatiate the enemy, and return a Tile).
		//Determine initial light count
		var lightArray = tileMap.getNonDarkNodes();
		initialLightCount = lightArray.length;
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
		// Update state of light tiles and map layout.
		//------FINAL RIG------
			currentTileSet = updateLightCounter();
			var decisive = -1;
			var finalized = false;
			decisive = superDecider(enemyTile, 5);
			//console.log("DEV MODE:: STARTING LOCATION: " + enemyTile.id);
			//console.log("DEV MODE:: ENDING LOCATION: (IF PREPATHED)" + currentTileSet[0].id);
			if(!prePathActive){
				if(currentLightCount < (initialLightCount * behaviorThreshold)){
					//Ensure that we are not interupting a valid move.
					if(nextMove === 0){
						prePathActive = true;
						//Activate Clairvoyance tracking shortest distance to random light tile.
						var finalCommand = clarivoyance(enemyTile, currentTileSet[0], []);
					}
				}
				//Check for loop 
				if(checkForLoop()){
					prePathActive = true;
					prePathCommand = clarivoyance(enemyTile, currentTileSet[0], []);
				}
			}
			if(prePathActive){
				//PrePath was Activated, read from prePathCommand for next turn
				if(!prePathCommand || prePathCommand[1].length <= 0 || prePathCommand[1][0] === -1){
					//We have hit end of prepathing, do a normal decision
					prePathActive = false;
					prePathCommand = [[],[]];
				}
				else{
					decisive = prePathCommand[1].shift();
				}
				
			}
			//Check to see if we have cleared enough light tiles to commence new directive
			//Call upon superDecider to check next move (Only form of activity)
			makeMove(decisive);
		//------FINAL END------
	 };
	return Enemy;
};