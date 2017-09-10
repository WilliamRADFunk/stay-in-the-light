/* 
Stay in the Light v0.0.9
Last Updated: 2017-September-10
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped loading bar object
var StartScreenWrapper = function(center) {
	// Publicly accessible functionality.
	var StartScreen = {};
	/**
	 * variables accessible to everything internal to StartScreenWrapper go here
	 * aka starts with 'var'
	**/
	var currentExcuseIndex = 0;
	var stayText;
	var inText;
	var theText;
	var lightText;
	var startText;
	var difficultyText;
	var difficultyLevelText;
	var helpText;
	var isLit = false;

	var difficultyLevel1 = new PIXI.Graphics();
	var difficultyLevel2 = new PIXI.Graphics();
	var difficultyLevel3 = new PIXI.Graphics();

	var enemyFilled = PIXI.Sprite.fromImage('./images/enemy_S.png');
	enemyFilled.anchor.set(0.5);
	var enemyOutline1 = PIXI.Sprite.fromImage('./images/enemy_outline.png');
	enemyOutline1.anchor.set(0.5);
	var enemyOutline2 = PIXI.Sprite.fromImage('./images/enemy_outline.png');
	enemyOutline2.anchor.set(0.5);
	var enemyOutline3 = PIXI.Sprite.fromImage('./images/enemy_outline.png');
	enemyOutline3.anchor.set(0.5);

	var startScreenBaddyUp = PIXI.Sprite.fromImage('./images/enemy_NE.png');
	startScreenBaddyUp.anchor.set(0.5);
	startScreenBaddyUp.scale.x = 0.4;
	startScreenBaddyUp.scale.y = 0.4;
	var startScreenBaddyDown = PIXI.Sprite.fromImage('./images/enemy_SE.png');
	startScreenBaddyDown.anchor.set(0.5);
	startScreenBaddyDown.scale.x = 0.4;
	startScreenBaddyDown.scale.y = 0.4;
	var currentBaddy;

	var startScreenGoodyUp = PIXI.Sprite.fromImage('./images/player_NE.png');
	startScreenGoodyUp.anchor.set(0.5);
	startScreenGoodyUp.scale.x = 0.4;
	startScreenGoodyUp.scale.y = 0.4;
	var startScreenGoodyDown = PIXI.Sprite.fromImage('./images/player_SE.png');
	startScreenGoodyDown.anchor.set(0.5);
	startScreenGoodyDown.scale.x = 0.4;
	startScreenGoodyDown.scale.y = 0.4;
	var currentGoody;

	var currentDifficulty1;
	var currentDifficulty2;
	var currentDifficulty3;

	var light = new PIXI.Graphics();

	var darkTileAnimation;
	var numOfTopDarkTiles = 0;
	var lightTileAnimation;
	var numOfTopLightTiles = 0;
	var topTileGraphic = new PIXI.Graphics();

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to StartScreenWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to StartScreenWrapper go here
	 * aka starts with 'var'
	**/
	var drawLight = function() {
		isLit = !isLit;
		light.clear();

		var fillColor = 0xCFB53B;
		if(isLit) {
			light.beginFill(fillColor);
		}
		light.moveTo(640, 10);
		light.lineStyle(5, 0xCFB53B, 2);
		light.lineTo(640, 40);
		light.lineTo(640 - 25, 65);
		light.lineTo(640 + 25, 65);
		light.lineTo(640, 40);
		if(isLit) {
			light.endFill(fillColor);
			light.beginFill(fillColor, 0.2);
			light.lineStyle(1, 0xCFB53B, 2);
			light.moveTo(640 - 25, 65);
			light.lineTo(640 - 55, 95);
			light.lineTo(640 + 55, 95);
			light.lineTo(640 + 25, 65);
			light.endFill(fillColor);
		}
	};
	var drawWordStay = function() {
		if(stayText && isLit) {
			StartScreen.container.removeChild(stayText);
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			stayText.x = 50;
			stayText.y = 100;
			StartScreen.container.addChild(stayText);
		} else if(stayText) {
			StartScreen.container.removeChild(stayText);
		} else if(isLit) {
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			stayText.x = 50;
			stayText.y = 100;
			StartScreen.container.addChild(stayText);
		}
	};
	var drawWordIn = function() {
		if(inText && isLit) {
			StartScreen.container.removeChild(inText);
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			inText.x = 400;
			inText.y = 100;
			StartScreen.container.addChild(inText);
		} else if(inText) {
			StartScreen.container.removeChild(inText);
		} else if(isLit) {
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			inText.x = 400;
			inText.y = 100;
			StartScreen.container.addChild(inText);
		}
	};
	var drawWordThe = function() {
		if(theText && isLit) {
			StartScreen.container.removeChild(theText);
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			theText.x = 650;
			theText.y = 100;
			StartScreen.container.addChild(theText);
		} else if(theText) {
			StartScreen.container.removeChild(theText);
		} else if(isLit) {
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			theText.x = 650;
			theText.y = 100;
			StartScreen.container.addChild(theText);
		}
	};
	var drawWordLight = function() {
		if(lightText && isLit) {
			StartScreen.container.removeChild(lightText);
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			lightText.x = 950;
			lightText.y = 100;
			StartScreen.container.addChild(lightText);
		} else if(lightText) {
			StartScreen.container.removeChild(lightText);
		} else if(isLit) {
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			lightText.x = 950;
			lightText.y = 100;
			StartScreen.container.addChild(lightText);
		}
	};
	var drawWordStart = function(isHighlighted) {
		if(startText && isHighlighted) {
			StartScreen.container.removeChild(startText);
			startText = new PIXI.Text('Start', {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xFFFFFF, align: 'left'});
		} else if(startText) {
			StartScreen.container.removeChild(startText);
			startText = new PIXI.Text('Start', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		} else if(isHighlighted) {
			startText = new PIXI.Text('Start', {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xFFFFFF, align: 'left'});
		} else {
			startText = new PIXI.Text('Start', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		}
		startText.x = 600;
		startText.y = 400;
		StartScreen.container.addChild(startText);
	};
	var drawWordDifficulty = function(isHighlighted, difficulty, mX) {
		if(difficultyText && isHighlighted) {
			StartScreen.container.removeChild(difficultyText);
			difficultyText = new PIXI.Text('Difficulty', {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xFFFFFF, align: 'left'});
		} else if(difficultyText) {
			StartScreen.container.removeChild(difficultyText);
			difficultyText = new PIXI.Text('Difficulty', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		} else if(isHighlighted) {
			difficultyText = new PIXI.Text('Difficulty', {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xFFFFFF, align: 'left'});
		} else {
			difficultyText = new PIXI.Text('Difficulty', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		}
		difficultyText.x = 600;
		difficultyText.y = 440;
		StartScreen.container.addChild(difficultyText);

		if(currentDifficulty1) {
			StartScreen.container.removeChild(currentDifficulty1);
			currentDifficulty1 = null;
		}
		if(currentDifficulty2) {
			StartScreen.container.removeChild(currentDifficulty2);
			currentDifficulty2 = null;
		}
		if(currentDifficulty3) {
			StartScreen.container.removeChild(currentDifficulty3);
			currentDifficulty3 = null;
		}
		if(difficultyLevelText) {
			StartScreen.container.removeChild(difficultyLevelText);
			difficultyLevelText = null;
		}

		if(isHighlighted) {
			if(difficulty === 1) {
				currentDifficulty1 = enemyFilled;
				currentDifficulty1.x = 820;
				currentDifficulty1.y = 452;
				currentDifficulty1.scale.x = 0.4;
				currentDifficulty1.scale.y = 0.4;
				StartScreen.container.addChild(currentDifficulty1);
				currentDifficulty2 = enemyOutline2;
				currentDifficulty2.x = 860;
				currentDifficulty2.y = 452;
				currentDifficulty2.scale.x = 0.6;
				currentDifficulty2.scale.y = 0.6;
				StartScreen.container.addChild(currentDifficulty2);
				currentDifficulty3 = enemyOutline3;
				currentDifficulty3.x = 910;
				currentDifficulty3.y = 452;
				currentDifficulty3.scale.x = 0.8;
				currentDifficulty3.scale.y = 0.8;
				StartScreen.container.addChild(currentDifficulty3);
			} else if(difficulty === 2) {
				currentDifficulty2 = enemyFilled;
				currentDifficulty2.x = 860;
				currentDifficulty2.y = 452;
				currentDifficulty2.scale.x = 0.6;
				currentDifficulty2.scale.y = 0.6;
				StartScreen.container.addChild(currentDifficulty2);
				currentDifficulty1 = enemyOutline1;
				currentDifficulty1.x = 820;
				currentDifficulty1.y = 452;
				currentDifficulty1.scale.x = 0.4;
				currentDifficulty1.scale.y = 0.4;
				StartScreen.container.addChild(currentDifficulty1);
				currentDifficulty3 = enemyOutline3;
				currentDifficulty3.x = 910;
				currentDifficulty3.y = 452;
				currentDifficulty3.scale.x = 0.8;
				currentDifficulty3.scale.y = 0.8;
				StartScreen.container.addChild(currentDifficulty3);
			} else if(difficulty === 3) {
				currentDifficulty3 = enemyFilled;
				currentDifficulty3.x = 910;
				currentDifficulty3.y = 452;
				currentDifficulty3.scale.x = 0.8;
				currentDifficulty3.scale.y = 0.8;
				StartScreen.container.addChild(currentDifficulty3);
				currentDifficulty1 = enemyOutline1;
				currentDifficulty1.x = 820;
				currentDifficulty1.y = 452;
				currentDifficulty1.scale.x = 0.4;
				currentDifficulty1.scale.y = 0.4;
				StartScreen.container.addChild(currentDifficulty1);
				currentDifficulty2 = enemyOutline2;
				currentDifficulty2.x = 860;
				currentDifficulty2.y = 452;
				currentDifficulty2.scale.x = 0.6;
				currentDifficulty2.scale.y = 0.6;
				StartScreen.container.addChild(currentDifficulty2);
			}

			if(mX >= 800 && mX < 830) {
				if(!difficultyLevelText) {
					difficultyLevelText = new PIXI.Text('Easy', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
					difficultyLevelText.x = 975;
					difficultyLevelText.y = 450;
					StartScreen.container.addChild(difficultyLevelText);
				} else {
					difficultyLevelText.text = 'Easy';
				}
			} else if(mX >= 845 && mX < 875) {
				if(!difficultyLevelText) {
					difficultyLevelText = new PIXI.Text('Normal', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
					difficultyLevelText.x = 975;
					difficultyLevelText.y = 450;
					StartScreen.container.addChild(difficultyLevelText);
				} else {
					difficultyLevelText.text = 'Normal';
				}
			} else if(mX >= 890 && mX < 930) {
				if(!difficultyLevelText) {
					difficultyLevelText = new PIXI.Text('Extreme', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
					difficultyLevelText.x = 975;
					difficultyLevelText.y = 450;
					StartScreen.container.addChild(difficultyLevelText);
				} else {
					difficultyLevelText.text = 'Extreme';
				}
			}
		}
	};
	var drawWordHelp = function(isHighlighted) {
		if(helpText && isHighlighted) {
			StartScreen.container.removeChild(helpText);
			helpText = new PIXI.Text('Help', {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xFFFFFF, align: 'left'});
		} else if(helpText) {
			StartScreen.container.removeChild(helpText);
			helpText = new PIXI.Text('Help', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		} else if(isHighlighted) {
			helpText = new PIXI.Text('Help', {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xFFFFFF, align: 'left'});
		} else {
			helpText = new PIXI.Text('Help', {fontFamily: 'Courier', fontSize: 24, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		}
		helpText.x = 600;
		helpText.y = 480;
		StartScreen.container.addChild(helpText);
	};
	var drawDarkTileAnimation = function() {
		// Clear out what the last enemy graphic was.
		if(currentBaddy) {
			StartScreen.container.removeChild(currentBaddy);
			currentBaddy = null;
		}

		numOfTopDarkTiles++;
		// If beyond max, switch animation to the light side.
		if(numOfTopDarkTiles > 31) {
			numOfTopDarkTiles = 1;
			clearInterval(darkTileAnimation);
			lightTileAnimation = setInterval(drawLightTileAnimation, 600);
			return;
		}
		// Clear previous iteration of the drawing.
		topTileGraphic.clear();

		var centerX = 40;
		var centerY = 260;
		var size = 25;

		// Fill in the dark tiles from left to right,
		// second is light if dark number is odd, and dar if even.
		for(var i = 0; i < numOfTopDarkTiles; i+=2) {
			// Paint top hex
			var fillColor = 0x000000;
			topTileGraphic.lineStyle(3, 0xCFB53B, 2);
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();

			// If on the last block don't paint another.
			if(i+1 === numOfTopDarkTiles && i+1 === 31) {
				break;
			}

			// When numOfTopDarkTiles if becomes necessary to paint the additional even block.
			// Check between even and odd.
			if(i+1 >= numOfTopDarkTiles) { // Light
				fillColor = 0xCFB53B;
				topTileGraphic.lineStyle(3, 0xC0C0C0, 2);
			} else { // Dark
				fillColor = 0x000000;
				topTileGraphic.lineStyle(3, 0xCFB53B, 2);
			}
			// Paint bottom hex
			centerX += 40;
			centerY += 23
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();
			centerX += 40;
			centerY -= 23
		}
		// Fill in the tiles tiles from left to right, top to bottom.
		for(var i = 0; i < 28 - (numOfTopDarkTiles - 1); i+=2) {
			var fillColor = 0xCFB53B;
			topTileGraphic.lineStyle(3, 0xC0C0C0, 2);
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();

			centerX += 40;
			centerY += 23
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();
			centerX += 40;
			centerY -= 23
		}
		// There is an odd number of total hexes. Make sure to add this one last node,
		// but check to see if it should be light or dark.
		if(numOfTopDarkTiles <= 30) { // Light
				fillColor = 0xCFB53B;
				topTileGraphic.lineStyle(3, 0xC0C0C0, 2);
		} else { // Dark
			fillColor = 0x000000;
			topTileGraphic.lineStyle(3, 0xCFB53B, 2);
		}
		topTileGraphic.moveTo(centerX + size, centerY);
		topTileGraphic.beginFill(fillColor);
		for (var j = 0; j <= 6; j++) {
			var angle = 2 * Math.PI / 6 * j,
			x_j = centerX + size * Math.cos(angle),
			y_j = centerY + size * Math.sin(angle);
			topTileGraphic.lineTo(x_j, y_j);
		}
		topTileGraphic.endFill();

		// If top hex have enemy pointing toward lower right, upper right otherwise.
		if(numOfTopDarkTiles % 2 === 0) {
			centerY = 283;
			currentBaddy = startScreenBaddyUp;
		} else {
			centerY = 260;
			currentBaddy = startScreenBaddyDown;
		}
		centerX = numOfTopDarkTiles * 40;
		currentBaddy.x = centerX;
		currentBaddy.y = centerY;

		StartScreen.container.addChild(topTileGraphic);
		StartScreen.container.addChild(currentBaddy);
	};

	var drawLightTileAnimation = function() {
		// Clear out what the last enemy graphic was.
		if(currentGoody) {
			StartScreen.container.removeChild(currentGoody);
			currentGoody = null;
		}

		numOfTopLightTiles++;
		// If beyond max, switch animation to the light side.
		if(numOfTopLightTiles > 31) {
			numOfTopLightTiles = 1;
			clearInterval(lightTileAnimation);
			darkTileAnimation = setInterval(drawDarkTileAnimation, 600);
			return;
		}
		// Clear previous iteration of the drawing.
		topTileGraphic.clear();

		var centerX = 40;
		var centerY = 260;
		var size = 25;

		// Fill in the dark tiles from left to right,
		// second is light if dark number is odd, and dar if even.
		for(var i = 0; i < numOfTopLightTiles; i+=2) {
			// Paint top hex
			var fillColor = 0xCFB53B;
			topTileGraphic.lineStyle(3, 0xC0C0C0, 2);
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();

			// If on the last block don't paint another.
			if(i+1 === numOfTopLightTiles && i+1 === 31) {
				break;
			}

			// When numOfTopLightTiles if becomes necessary to paint the additional even block.
			// Check between even and odd.
			if(i+1 >= numOfTopLightTiles) { // Light
				fillColor = 0x000000;
				topTileGraphic.lineStyle(3, 0xCFB53B, 2);
			} else { // Dark
				fillColor = 0xCFB53B;
				topTileGraphic.lineStyle(3, 0xC0C0C0, 2);
			}
			// Paint bottom hex
			centerX += 40;
			centerY += 23
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();
			centerX += 40;
			centerY -= 23
		}
		// Fill in the tiles tiles from left to right, top to bottom.
		for(var i = 0; i < 28 - (numOfTopLightTiles - 1); i+=2) {
			var fillColor = 0x000000;
			topTileGraphic.lineStyle(3, 0xCFB53B, 2);
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();

			centerX += 40;
			centerY += 23
			topTileGraphic.moveTo(centerX + size, centerY);
			topTileGraphic.beginFill(fillColor);
			for (var j = 0; j <= 6; j++) {
				var angle = 2 * Math.PI / 6 * j,
				x_j = centerX + size * Math.cos(angle),
				y_j = centerY + size * Math.sin(angle);
				topTileGraphic.lineTo(x_j, y_j);
			}
			topTileGraphic.endFill();
			centerX += 40;
			centerY -= 23
		}
		// There is an odd number of total hexes. Make sure to add this one last node,
		// but check to see if it should be light or dark.
		if(numOfTopLightTiles <= 30) { // Light
				fillColor = 0x000000;
				topTileGraphic.lineStyle(3, 0xCFB53B, 2);
		} else { // Dark
			fillColor = 0xCFB53B;
			topTileGraphic.lineStyle(3, 0xC0C0C0, 2);
		}
		topTileGraphic.moveTo(centerX + size, centerY);
		topTileGraphic.beginFill(fillColor);
		for (var j = 0; j <= 6; j++) {
			var angle = 2 * Math.PI / 6 * j,
			x_j = centerX + size * Math.cos(angle),
			y_j = centerY + size * Math.sin(angle);
			topTileGraphic.lineTo(x_j, y_j);
		}
		topTileGraphic.endFill();

		// If top hex have enemy pointing toward lower right, upper right otherwise.
		if(numOfTopLightTiles % 2 === 0) {
			centerY = 283;
			currentGoody = startScreenGoodyUp;
		} else {
			centerY = 260;
			currentGoody = startScreenGoodyDown;
		}
		centerX = numOfTopLightTiles * 40;
		currentGoody.x = centerX;
		currentGoody.y = centerY;

		StartScreen.container.addChild(topTileGraphic);
		StartScreen.container.addChild(currentGoody);
	};

	/**
	 * variables accessible publicly from StartScreenWrapper go here
	 * aka starts with 'StartScreen'
	**/
	StartScreen.drawStartScreenWords = function() {
		drawLight();
		drawWordStay();
		drawWordIn();
		drawWordThe();
		drawWordLight();
	};

	StartScreen.drawOptions = function(option, difficulty, mX) {
		switch(option) {
			case 0: {
				drawWordStart(true);
				drawWordDifficulty(false);
				drawWordHelp(false);
				break;
			}
			case 1: {
				drawWordDifficulty(true, difficulty, mX);
				drawWordStart(false);
				drawWordHelp(false);
				break;
			}
			case 2: {
				drawWordHelp(true);
				drawWordDifficulty(false);
				drawWordStart(false);
				break;
			}
			default: {
				drawWordStart(false);
				drawWordDifficulty(false);
				drawWordHelp(false);
			}
		}
	};

	StartScreen.killProcesses = function() {
		clearInterval(lightTileAnimation);
		clearInterval(darkTileAnimation);
	};

	/**
	 * functions accessible publicly from StartScreenWrapper go here
	 * aka starts with 'StartScreen'
	**/

	// Should decide where to instantiate the StartScreen on the tile map,
	// and setup any internal logic for the StartScreen.
	StartScreen.init = function() {
		StartScreen.container = new PIXI.Container();

		StartScreen.container.addChild(light);
		StartScreen.container.addChild(difficultyLevel1);
		StartScreen.container.addChild(difficultyLevel2);
		StartScreen.container.addChild(difficultyLevel3);
		StartScreen.drawStartScreenWords();

		drawDarkTileAnimation();
		darkTileAnimation = setInterval(drawDarkTileAnimation, 600);
	};

	// Return public api object at very end.
	return StartScreen;
};