/* 
Stay in the Light v1.0.1
Last Updated: 2017-November-12
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped loading bar object
var GameOverScreenWrapper = function(center) {
	// Publicly accessible functionality.
	var GameOverScreen = {};
	/**
	 * variables accessible to everything internal to GameOverScreenWrapper go here
	 * aka starts with 'var'
	**/
	var currentExcuseIndex = 0;
	var stayText;
	var inText;
	var theText;
	var lightText;
	var muteSoundText;
	var officialName = [];
	var isLit = false;
	var isOffline = false;

	var gameOverScreenBaddyUp = PIXI.Sprite.fromImage('./images/enemy_NE.png');
	gameOverScreenBaddyUp.anchor.set(0.5);
	gameOverScreenBaddyUp.scale.x = 0.4;
	gameOverScreenBaddyUp.scale.y = 0.4;
	var gameOverScreenBaddyDown = PIXI.Sprite.fromImage('./images/enemy_SE.png');
	gameOverScreenBaddyDown.anchor.set(0.5);
	gameOverScreenBaddyDown.scale.x = 0.4;
	gameOverScreenBaddyDown.scale.y = 0.4;
	var currentBaddy;

	var gameOverScreenGoodyUp = PIXI.Sprite.fromImage('./images/player_NE.png');
	gameOverScreenGoodyUp.anchor.set(0.5);
	gameOverScreenGoodyUp.scale.x = 0.4;
	gameOverScreenGoodyUp.scale.y = 0.4;
	var gameOverScreenGoodyDown = PIXI.Sprite.fromImage('./images/player_SE.png');
	gameOverScreenGoodyDown.anchor.set(0.5);
	gameOverScreenGoodyDown.scale.x = 0.4;
	gameOverScreenGoodyDown.scale.y = 0.4;
	var currentGoody;

	var mouseImageLeft = PIXI.Sprite.fromImage('./images/mouse.png');
	mouseImageLeft.anchor.set(0.5);
	mouseImageLeft.scale.x = 0.5;
	mouseImageLeft.scale.y = 0.5;
	mouseImageLeft.x = 475;
	mouseImageLeft.y = 460;

	var mouseImageRight = PIXI.Sprite.fromImage('./images/mouse.png');
	mouseImageRight.anchor.set(0.5);
	mouseImageRight.scale.x = 0.5;
	mouseImageRight.scale.y = 0.5;
	mouseImageRight.x = 850;
	mouseImageRight.y = 460;

	var gameOverText;
	var clickText;
	var nameText1;
	var nameText2;
	var scoreText;

	var light = new PIXI.Graphics();

	var darkTileAnimation;
	var numOfTopDarkTiles = 0;
	var lightTileAnimation;
	var numOfTopLightTiles = 0;
	var topTileGraphic = new PIXI.Graphics();

	var roundScore = 0;

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to GameOverScreenWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to GameOverScreenWrapper go here
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
			GameOverScreen.container.removeChild(stayText);
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			stayText.x = 50;
			stayText.y = 100;
			GameOverScreen.container.addChild(stayText);
		} else if(stayText) {
			GameOverScreen.container.removeChild(stayText);
		} else if(isLit) {
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			stayText.x = 50;
			stayText.y = 100;
			GameOverScreen.container.addChild(stayText);
		}
	};
	var drawWordIn = function() {
		if(inText && isLit) {
			GameOverScreen.container.removeChild(inText);
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			inText.x = 400;
			inText.y = 100;
			GameOverScreen.container.addChild(inText);
		} else if(inText) {
			GameOverScreen.container.removeChild(inText);
		} else if(isLit) {
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			inText.x = 400;
			inText.y = 100;
			GameOverScreen.container.addChild(inText);
		}
	};
	var drawWordThe = function() {
		if(theText && isLit) {
			GameOverScreen.container.removeChild(theText);
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			theText.x = 650;
			theText.y = 100;
			GameOverScreen.container.addChild(theText);
		} else if(theText) {
			GameOverScreen.container.removeChild(theText);
		} else if(isLit) {
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			theText.x = 650;
			theText.y = 100;
			GameOverScreen.container.addChild(theText);
		}
	};
	var drawWordLight = function() {
		if(lightText && isLit) {
			GameOverScreen.container.removeChild(lightText);
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			lightText.x = 950;
			lightText.y = 100;
			GameOverScreen.container.addChild(lightText);
		} else if(lightText) {
			GameOverScreen.container.removeChild(lightText);
		} else if(isLit) {
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			lightText.x = 950;
			lightText.y = 100;
			GameOverScreen.container.addChild(lightText);
		}
	};
	var drawMuteSoundText = function() {
		if(muteSoundText) {
			GameOverScreen.container.removeChild(muteSoundText);
		}
		muteSoundText = new PIXI.Text('Press * to toggle sound', {fontFamily: 'Courier', fontSize: 18, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
		muteSoundText.x = 980;
		muteSoundText.y = 20;
		GameOverScreen.container.addChild(muteSoundText);
	};
	var drawGameOver = function(statusText) {
		if(gameOverText && isLit) {
			GameOverScreen.container.removeChild(gameOverText);
			gameOverText = new PIXI.Text('Game Over: You ' + statusText, {fontFamily: 'Courier', fontSize: 96, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
			gameOverText.x = 75;
			gameOverText.y = 350;
			GameOverScreen.container.addChild(gameOverText);
		} else if(gameOverText) {
			GameOverScreen.container.removeChild(gameOverText);
		} else if(isLit) {
			gameOverText = new PIXI.Text('Game Over: You ' + statusText, {fontFamily: 'Courier', fontSize: 96, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
			gameOverText.x = 75;
			gameOverText.y = 350;
			GameOverScreen.container.addChild(gameOverText);
		}
	};
	var drawClick = function() {
		if(clickText && isLit) {
			GameOverScreen.container.removeChild(clickText);
			clickText = new PIXI.Text('Click to return to menu', {fontFamily: 'Courier', fontSize: 24, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			clickText.x = 500;
			clickText.y = 450;
			GameOverScreen.container.addChild(clickText);
			GameOverScreen.container.addChild(mouseImageLeft);
			GameOverScreen.container.addChild(mouseImageRight);
		} else if(clickText) {
			GameOverScreen.container.removeChild(mouseImageLeft);
			GameOverScreen.container.removeChild(mouseImageRight);
			GameOverScreen.container.removeChild(clickText);
		} else if(isLit) {
			clickText = new PIXI.Text('Click to return to menu', {fontFamily: 'Courier', fontSize: 24, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			clickText.x = 500;
			clickText.y = 450;
			GameOverScreen.container.addChild(clickText);
			GameOverScreen.container.addChild(mouseImageLeft);
			GameOverScreen.container.addChild(mouseImageRight);
		}
	};
	var drawName = function() {
		if(nameText1 && isLit) {
			GameOverScreen.container.removeChild(nameText1);
			GameOverScreen.container.removeChild(nameText2);
			nameText1 = new PIXI.Text('Add your name to the leaderboard. a-z and spaces only.', {fontFamily: 'Courier', fontSize: 20, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			nameText1.x = 350;
			nameText1.y = 575;
			var nombre = drawNameBuildName();
			nameText2 = new PIXI.Text(nombre, {fontFamily: 'Courier', fontSize: 24, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			nameText2.x = 460;
			nameText2.y = 650;
			GameOverScreen.container.addChild(nameText1);
			GameOverScreen.container.addChild(nameText2);
		} else if(nameText1) {
			GameOverScreen.container.removeChild(nameText1);
			GameOverScreen.container.removeChild(nameText2);
		} else if(isLit) {
			nameText1 = new PIXI.Text('Add your name to the leaderboard. a-z and spaces only.', {fontFamily: 'Courier', fontSize: 20, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			nameText1.x = 350;
			nameText1.y = 575;
			var nombre = drawNameBuildName();
			nameText2 = new PIXI.Text(nombre, {fontFamily: 'Courier', fontSize: 24, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
			nameText2.x = 460;
			nameText2.y = 650;
			GameOverScreen.container.addChild(nameText1);
			GameOverScreen.container.addChild(nameText2);
		}
	};
	var drawNameBuildName = function() {
		var constructedName = '';
		for(var i = 0; i < officialName.length; i++) {
			constructedName += officialName[i];
			constructedName += '  ';
		}
		for(var j = 0; j < (10 - officialName.length); j++) {
			constructedName += '-';
			constructedName += '  ';
		}
		return constructedName;
	};
	var drawScore = function() {
		var offsetX = 550;
		if(roundScore >= 1000 && roundScore < 10000) {
			offsetX = 540;
		} else if(roundScore >= 10000 && roundScore < 100000) {
			offsetX = 530;
		} else if(roundScore >= 100000 && roundScore < 1000000) {
			offsetX = 520;
		} else if(roundScore >= 1000000) {
			offsetX = 500;
		}
		if(scoreText && isLit) {
			GameOverScreen.container.removeChild(scoreText);
			scoreText = new PIXI.Text('Score: ' + roundScore.toLocaleString(), {fontFamily: 'Courier', fontSize: 36, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
			scoreText.x = offsetX;
			scoreText.y = 500;
			GameOverScreen.container.addChild(scoreText);
		} else if(scoreText) {
			GameOverScreen.container.removeChild(scoreText);
		} else if(isLit) {
			scoreText = new PIXI.Text('Score: ' + roundScore.toLocaleString(), {fontFamily: 'Courier', fontSize: 36, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
			scoreText.x = offsetX;
			scoreText.y = 500;
			GameOverScreen.container.addChild(scoreText);
		}
	};
	var drawDarkTileAnimation = function() {
		// Clear out what the last enemy graphic was.
		if(currentBaddy) {
			GameOverScreen.container.removeChild(currentBaddy);
			currentBaddy = null;
		}

		numOfTopDarkTiles++;
		// If beyond max, switch animation to the light side.
		if(numOfTopDarkTiles > 31) {
			numOfTopDarkTiles = 0;
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
			currentBaddy = gameOverScreenBaddyUp;
		} else {
			centerY = 260;
			currentBaddy = gameOverScreenBaddyDown;
		}
		centerX = numOfTopDarkTiles * 40;
		currentBaddy.x = centerX;
		currentBaddy.y = centerY;

		GameOverScreen.container.addChild(currentBaddy);
	};

	var drawLightTileAnimation = function() {
		// Clear out what the last enemy graphic was.
		if(currentGoody) {
			GameOverScreen.container.removeChild(currentGoody);
			currentGoody = null;
		}

		numOfTopLightTiles++;
		// If beyond max, switch animation to the light side.
		if(numOfTopLightTiles > 31) {
			numOfTopLightTiles = 0;
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
			centerY += 23;
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
			centerY -= 23;
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
			centerY += 23;
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
			centerY -= 23;
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
			currentGoody = gameOverScreenGoodyUp;
		} else {
			centerY = 260;
			currentGoody = gameOverScreenGoodyDown;
		}
		centerX = numOfTopLightTiles * 40;
		currentGoody.x = centerX;
		currentGoody.y = centerY;

		GameOverScreen.container.addChild(currentGoody);
	};

	/**
	 * variables accessible publicly from GameOverScreenWrapper go here
	 * aka starts with 'GameOverScreen'
	**/
	GameOverScreen.changeName = function(name) {
		officialName = name;
		if(!isOffline) {
			drawName();
		}
	};

	GameOverScreen.drawGameOverScreenWords = function() {
		drawMuteSoundText();
		drawLight();
		drawWordStay();
		drawWordIn();
		drawWordThe();
		drawWordLight();
		if(roundScore > 0) {
			drawGameOver('Win!');
			if(!isOffline) {
				drawName();
			}
			drawScore();
		} else {
			drawGameOver('Lose!');
		}
		drawClick();
	};

	GameOverScreen.killProcesses = function() {
		clearInterval(lightTileAnimation);
		clearInterval(darkTileAnimation);
	};

	GameOverScreen.setScore = function(score) {
		if(score <= 0) {
			roundScore = 0;
			// Refreshes the win or lose portion of the text.
			drawGameOver('Lose!');
		} else {
			roundScore = score;
			// Refreshes the win or lose portion of the text.
			drawGameOver('Win!');
			if(!isOffline) {
				drawName();
			}
			drawScore();
		}
	};

	GameOverScreen.toggleOffline = function(b_isOffline) {
		isOffline = b_isOffline;
	};

	// Should decide where to instantiate the GameOverScreen on the tile map,
	// and setup any internal logic for the GameOverScreen.
	GameOverScreen.init = function() {
		GameOverScreen.container = new PIXI.Container();

		GameOverScreen.container.addChild(light);
		GameOverScreen.container.addChild(topTileGraphic);
		GameOverScreen.drawGameOverScreenWords();

		drawDarkTileAnimation();
		darkTileAnimation = setInterval(drawDarkTileAnimation, 600);
	};

	// Return public api object at very end.
	return GameOverScreen;
};