/* 
Stay in the Light v0.0.12
Last Updated: 2017-September-17
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

	var mouseMoveGoodyUp = PIXI.Sprite.fromImage('./images/player_NW.png');
	mouseMoveGoodyUp.anchor.set(0.5);
	mouseMoveGoodyUp.scale.x = 0.4;
	mouseMoveGoodyUp.scale.y = 0.4;
	var mouseMoveGoodyDown = PIXI.Sprite.fromImage('./images/player_SE.png');
	mouseMoveGoodyDown.anchor.set(0.5);
	mouseMoveGoodyDown.scale.x = 0.4;
	mouseMoveGoodyDown.scale.y = 0.4;
	var currentMouseMoveGoody;
	var mouseMoveImage = PIXI.Sprite.fromImage('./images/mouse.png');
	mouseMoveImage.anchor.set(0.5);
	mouseMoveImage.scale.x = 0.5;
	mouseMoveImage.scale.y = 0.5;
	var mouseMoveRightImage = PIXI.Sprite.fromImage('./images/mouseRight.png');
	mouseMoveRightImage.anchor.set(0.5);
	mouseMoveRightImage.scale.x = 0.5;
	mouseMoveRightImage.scale.y = 0.5;
	var currentMouseMoveImage;
	var mouseMoveGraphic = new PIXI.Graphics();
	var mouseMoveText1;
	var mouseMoveText2;

	var startScreenHelpGoody = PIXI.Sprite.fromImage('./images/player_S.png');
	startScreenHelpGoody.anchor.set(0.5);
	startScreenHelpGoody.scale.x = 0.4;
	startScreenHelpGoody.scale.y = 0.4;
	var currentHelpGoody;

	var startScreenGoodyUp = PIXI.Sprite.fromImage('./images/player_NE.png');
	startScreenGoodyUp.anchor.set(0.5);
	startScreenGoodyUp.scale.x = 0.4;
	startScreenGoodyUp.scale.y = 0.4;
	var startScreenGoodyDown = PIXI.Sprite.fromImage('./images/player_SE.png');
	startScreenGoodyDown.anchor.set(0.5);
	startScreenGoodyDown.scale.x = 0.4;
	startScreenGoodyDown.scale.y = 0.4;
	var currentGoody;

	var aButtonBlack = PIXI.Sprite.fromImage('./images/A-Black.png');
	aButtonBlack.anchor.set(0.5);
	aButtonBlack.scale.x = 0.5;
	aButtonBlack.scale.y = 0.5;
	var aButtonGold = PIXI.Sprite.fromImage('./images/A-Gold.png');
	aButtonGold.anchor.set(0.5);
	aButtonGold.scale.x = 0.5;
	aButtonGold.scale.y = 0.5;
	var dButtonBlack = PIXI.Sprite.fromImage('./images/D-Black.png');
	dButtonBlack.anchor.set(0.5);
	dButtonBlack.scale.x = 0.5;
	dButtonBlack.scale.y = 0.5;
	var dButtonGold = PIXI.Sprite.fromImage('./images/D-Gold.png');
	dButtonGold.anchor.set(0.5);
	dButtonGold.scale.x = 0.5;
	dButtonGold.scale.y = 0.5;
	var currentAButton;
	var currentDButton;
	var buttonAniIteration = 0;
	var buttonAnimation;
	var unfoggedGraphic = new PIXI.Graphics();
	var fogHelpText1;
	var fogHelpText2;

	var mouseImage = PIXI.Sprite.fromImage('./images/mouse.png');
	mouseImage.anchor.set(0.5);
	mouseImage.scale.x = 0.5;
	mouseImage.scale.y = 0.5;
	var mouseGraphic = new PIXI.Graphics();
	var currentMouseImage;
	var mouseTrackText1;
	var mouseTrackText2;
	var mouseTrackText3;
	var mouseTrackText4;

	var startScreenGoody1 = PIXI.Sprite.fromImage('./images/player_SE.png');
	startScreenGoody1.anchor.set(0.5);
	startScreenGoody1.scale.x = 0.4;
	startScreenGoody1.scale.y = 0.4;
	var startScreenGoody2 = PIXI.Sprite.fromImage('./images/player_S.png');
	startScreenGoody2.anchor.set(0.5);
	startScreenGoody2.scale.x = 0.4;
	startScreenGoody2.scale.y = 0.4;
	var startScreenGoody3 = PIXI.Sprite.fromImage('./images/player_SW.png');
	startScreenGoody3.anchor.set(0.5);
	startScreenGoody3.scale.x = 0.4;
	startScreenGoody3.scale.y = 0.4;
	var startScreenGoody4 = PIXI.Sprite.fromImage('./images/player_NW.png');
	startScreenGoody4.anchor.set(0.5);
	startScreenGoody4.scale.x = 0.4;
	startScreenGoody4.scale.y = 0.4;
	var startScreenGoody5 = PIXI.Sprite.fromImage('./images/player_N.png');
	startScreenGoody5.anchor.set(0.5);
	startScreenGoody5.scale.x = 0.4;
	startScreenGoody5.scale.y = 0.4;
	var startScreenGoody6 = PIXI.Sprite.fromImage('./images/player_NE.png');
	startScreenGoody6.anchor.set(0.5);
	startScreenGoody6.scale.x = 0.4;
	startScreenGoody6.scale.y = 0.4;
	var startScreenBaddy1 = PIXI.Sprite.fromImage('./images/enemy_SE.png');
	startScreenBaddy1.anchor.set(0.5);
	startScreenBaddy1.scale.x = 0.4;
	startScreenBaddy1.scale.y = 0.4;
	var startScreenBaddy2 = PIXI.Sprite.fromImage('./images/enemy_S.png');
	startScreenBaddy2.anchor.set(0.5);
	startScreenBaddy2.scale.x = 0.4;
	startScreenBaddy2.scale.y = 0.4;
	var startScreenBaddy3 = PIXI.Sprite.fromImage('./images/enemy_SW.png');
	startScreenBaddy3.anchor.set(0.5);
	startScreenBaddy3.scale.x = 0.4;
	startScreenBaddy3.scale.y = 0.4;
	var startScreenBaddy4 = PIXI.Sprite.fromImage('./images/enemy_NW.png');
	startScreenBaddy4.anchor.set(0.5);
	startScreenBaddy4.scale.x = 0.4;
	startScreenBaddy4.scale.y = 0.4;
	var startScreenBaddy5 = PIXI.Sprite.fromImage('./images/enemy_N.png');
	startScreenBaddy5.anchor.set(0.5);
	startScreenBaddy5.scale.x = 0.4;
	startScreenBaddy5.scale.y = 0.4;
	var startScreenBaddy6 = PIXI.Sprite.fromImage('./images/enemy_NE.png');
	startScreenBaddy6.anchor.set(0.5);
	startScreenBaddy6.scale.x = 0.4;
	startScreenBaddy6.scale.y = 0.4;
	var currentColorFillCharacter;
	var fillGraphic = new PIXI.Graphics();
	var isLightPhase = false;
	var colorFillText1;
	var colorFillText2;
	var colorFillText3;
	var colorFillText4;
	var colorFillText5;
	var colorFillText6;

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


		if(isHighlighted) {
			if(!buttonAnimation) {
				drawHelpAnimation();
				buttonAnimation = setInterval(drawHelpAnimation, 1000);
			}
		} else {
			clearInterval(buttonAnimation);
			buttonAnimation = null;
			if(currentAButton) {
				StartScreen.container.removeChild(currentAButton);
			}
			if(currentDButton) {
				StartScreen.container.removeChild(currentDButton);
			}
			if(currentHelpGoody) {
				StartScreen.container.removeChild(currentHelpGoody);
				currentHelpGoody = null;
			}
			if(fogHelpText1) {
				StartScreen.container.removeChild(fogHelpText1);
				fogHelpText1 = null;
			}
			if(fogHelpText2) {
				StartScreen.container.removeChild(fogHelpText2);
				fogHelpText2 = null;
			}
			if(currentMouseImage) {
				StartScreen.container.removeChild(currentMouseImage);
				currentMouseImage = null;
			}
			if(mouseTrackText1) {
				StartScreen.container.removeChild(mouseTrackText1);
				StartScreen.container.removeChild(mouseTrackText2);
				StartScreen.container.removeChild(mouseTrackText3);
				StartScreen.container.removeChild(mouseTrackText4);
				mouseTrackText1 = null;
				mouseTrackText2 = null;
				mouseTrackText3 = null;
				mouseTrackText4 = null;
			}
			if(colorFillText1) {
				StartScreen.container.removeChild(colorFillText1);
				StartScreen.container.removeChild(colorFillText2);
				StartScreen.container.removeChild(colorFillText3);
				StartScreen.container.removeChild(colorFillText4);
				StartScreen.container.removeChild(colorFillText5);
				StartScreen.container.removeChild(colorFillText6);
				colorFillText1 = null;
				colorFillText2 = null;
				colorFillText3 = null;
				colorFillText4 = null;
				colorFillText5 = null;
				colorFillText6 = null;
			}
			if(currentMouseMoveGoody) {
				StartScreen.container.removeChild(currentMouseMoveGoody);
				currentMouseMoveGoody = null;
			}
			if(currentMouseMoveImage) {
				StartScreen.container.removeChild(currentMouseMoveImage);
				currentMouseMoveImage = null;
			}
			if(mouseMoveText1) {
				StartScreen.container.removeChild(mouseMoveText1);
				StartScreen.container.removeChild(mouseMoveText2);
				mouseMoveText1 = null;
				mouseMoveText2 = null;
			}
			if(currentColorFillCharacter) {
				StartScreen.container.removeChild(currentColorFillCharacter);
				currentColorFillCharacter = null;
			}
			unfoggedGraphic.clear();
			mouseGraphic.clear();
			fillGraphic.clear();
			mouseMoveGraphic.clear();
			buttonAniIteration = 0;
		}
	};
	var drawUnfoggedTiles = function(layers=0) {
		var centerX = 160;
		var centerY = 500;
		var size = 25;

		drawFogHelpTile(centerX, centerY);

		for(var i = 0; i < layers; i++) {
			drawFogHelpTile( centerX, (centerY - ((i + 1) * 46)) );
			drawFogHelpTile( (centerX + ((i + 1) * 39)) , (centerY - ((i + 1) * 23)) );
			drawFogHelpTile( (centerX + ((i + 1) * 39)) , (centerY + ((i + 1) * 23)) );
			drawFogHelpTile( centerX, (centerY + ((i + 1) * 46)) );
			drawFogHelpTile( (centerX - ((i + 1) * 39)) , (centerY + ((i + 1) * 23)) );
			drawFogHelpTile( (centerX - ((i + 1) * 39)) , (centerY - ((i + 1) * 23)) );
		}

		currentHelpGoody = startScreenHelpGoody;
		currentHelpGoody.x = centerX;
		currentHelpGoody.y = centerY;
		StartScreen.container.addChild(currentHelpGoody);
	};
	var drawFogHelpTile = function(x, y) {
		var fillColor = 0xCFB53B;
		unfoggedGraphic.lineStyle(3, 0xC0C0C0, 2);
		unfoggedGraphic.moveTo(x + 25, y);
		unfoggedGraphic.beginFill(fillColor);
		for (var j = 0; j <= 6; j++) {
			var angle = 2 * Math.PI / 6 * j,
			x_j = x + 25 * Math.cos(angle),
			y_j = y + 25 * Math.sin(angle);
			unfoggedGraphic.lineTo(x_j, y_j);
		}
		unfoggedGraphic.endFill();
	};
	var drawMouseTrackHelpTile = function(side, col, x, y) {
		var cX = x;
		var cY = y;
		var fillColor = 0xCFB53B;
		mouseGraphic.lineStyle(3, 0xC0C0C0, 2);
		mouseGraphic.moveTo(cX + 25, cY);
		mouseGraphic.beginFill(fillColor);
		for (var j = 0; j <= 6; j++) {
			var angle = 2 * Math.PI / 6 * j,
			x_j = cX + 25 * Math.cos(angle),
			y_j = cY + 25 * Math.sin(angle);
			mouseGraphic.lineTo(x_j, y_j);
		}
		mouseGraphic.endFill();

		mouseGraphic.moveTo(cX + 25, cY);
		for (var i = 0; i <= 6; i++) {
			if(i === side) {
				mouseGraphic.lineStyle(3, col, 2);
			} else {
				mouseGraphic.lineStyle(3, 0xC0C0C0, 2);
			}
			var angle = 2 * Math.PI / 6 * i,
			x_i = cX + 25 * Math.cos(angle),
			y_i = cY + 25 * Math.sin(angle);
			mouseGraphic.lineTo(x_i, y_i);
		}
	};
	var drawColorFillHelpTile = function(isLight, x, y) {
		var cX = x;
		var cY = y;
		var fillColor;
		var strokeColor;
		if(isLight) {
			fillColor = 0xCFB53B;
			strokeColor = 0xC0C0C0;
		} else {
			fillColor = 0x000000;
			strokeColor = 0xCFB53B;
		}
		fillGraphic.lineStyle(3, strokeColor, 2);
		fillGraphic.moveTo(cX + 25, cY);
		fillGraphic.beginFill(fillColor);
		for (var j = 0; j <= 6; j++) {
			var angle = 2 * Math.PI / 6 * j,
			x_j = cX + 25 * Math.cos(angle),
			y_j = cY + 25 * Math.sin(angle);
			fillGraphic.lineTo(x_j, y_j);
		}
		fillGraphic.endFill();
	};
	var drawHelpAnimation = function() {
		unfoggedGraphic.clear();
		mouseGraphic.clear();
		fillGraphic.clear();
		mouseMoveGraphic.clear();
		if(currentAButton) {
			StartScreen.container.removeChild(currentAButton);
			currentAButton = null;
		}
		if(currentDButton) {
			StartScreen.container.removeChild(currentDButton);
			currentDButton = null;
		}
		if(currentHelpGoody) {
			StartScreen.container.removeChild(currentHelpGoody);
			currentHelpGoody = null;
		}
		if(fogHelpText1) {
			StartScreen.container.removeChild(fogHelpText1);
			fogHelpText1 = null;
		}
		if(fogHelpText2) {
			StartScreen.container.removeChild(fogHelpText2);
			fogHelpText2 = null;
		}if(currentMouseImage) {
			StartScreen.container.removeChild(currentMouseImage);
			currentMouseImage = null;
		}
		if(mouseTrackText1) {
			StartScreen.container.removeChild(mouseTrackText1);
			StartScreen.container.removeChild(mouseTrackText2);
			StartScreen.container.removeChild(mouseTrackText3);
			StartScreen.container.removeChild(mouseTrackText4);
			mouseTrackText1 = null;
			mouseTrackText2 = null;
			mouseTrackText3 = null;
			mouseTrackText4 = null;
		}
		if(colorFillText1) {
			StartScreen.container.removeChild(colorFillText1);
			StartScreen.container.removeChild(colorFillText2);
			StartScreen.container.removeChild(colorFillText3);
			StartScreen.container.removeChild(colorFillText4);
			StartScreen.container.removeChild(colorFillText5);
			StartScreen.container.removeChild(colorFillText6);
			colorFillText1 = null;
			colorFillText2 = null;
			colorFillText3 = null;
			colorFillText4 = null;
			colorFillText5 = null;
			colorFillText6 = null;
		}
		if(currentMouseMoveGoody) {
			StartScreen.container.removeChild(currentMouseMoveGoody);
			currentMouseMoveGoody = null;
		}
		if(currentMouseMoveImage) {
			StartScreen.container.removeChild(currentMouseMoveImage);
			currentMouseMoveImage = null;
		}
		if(mouseMoveText1) {
			StartScreen.container.removeChild(mouseMoveText1);
			StartScreen.container.removeChild(mouseMoveText2);
			mouseMoveText1 = null;
			mouseMoveText2 = null;
		}
		if(currentColorFillCharacter) {
			StartScreen.container.removeChild(currentColorFillCharacter);
			currentColorFillCharacter = null;
		}

		if(buttonAniIteration === 0) {
			// Draw basic map
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);
			
			drawUnfoggedTiles(0);
			drawMouseTrackHelpTile(2, 0xFF0000, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 450;
			currentMouseImage.y = 450;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0x00FF00, 550, 600);
			drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody1;
				currentColorFillCharacter.x = 950;
				currentColorFillCharacter.y = 405;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy1;
				currentColorFillCharacter.x = 950;
				currentColorFillCharacter.y = 405;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 550;
			currentMouseMoveGoody.y = 600;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 1) {
			// Draw basic map expanded once
			currentAButton = aButtonGold;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(1);
			drawMouseTrackHelpTile(3, 0xFF0000, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 400;
			currentMouseImage.y = 425;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0xC0C0C0, 550, 600);
			drawMouseTrackHelpTile(1, 0x00FF00, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody1;
				currentColorFillCharacter.x = 950;
				currentColorFillCharacter.y = 405;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy1;
				currentColorFillCharacter.x = 950;
				currentColorFillCharacter.y = 405;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 590;
			currentMouseMoveGoody.y = 623;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveRightImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 2) {
			// Draw basic map expanded once
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(1);
			drawMouseTrackHelpTile(4, 0xFF0000, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 400;
			currentMouseImage.y = 375;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0xC0C0C0, 550, 600);
			drawMouseTrackHelpTile(4, 0x00FF00, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody2;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy2;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyUp;
			currentMouseMoveGoody.x = 590;
			currentMouseMoveGoody.y = 623;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveImage;
			currentMouseMoveImage.x = 510;
			currentMouseMoveImage.y = 575;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 3) {
			// Draw basic map expanded twice
			currentAButton = aButtonGold;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(2);
			drawMouseTrackHelpTile(5, 0xFF0000, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 450;
			currentMouseImage.y = 350;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(4, 0x00FF00, 550, 600);
			drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody2;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy2;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyUp;
			currentMouseMoveGoody.x = 550;
			currentMouseMoveGoody.y = 600;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveRightImage;
			currentMouseMoveImage.x = 510;
			currentMouseMoveImage.y = 575;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 4) {
			// Draw basic map expanded twice
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(2);
			drawMouseTrackHelpTile(6, 0xFF0000, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 500;
			currentMouseImage.y = 375;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0x00FF00, 550, 600);
			drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody3;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy3;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 550;
			currentMouseMoveGoody.y = 600;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 5) {
			// Draw basic map expanded thrice
			currentAButton = aButtonGold;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(3);
			drawMouseTrackHelpTile(1, 0xFF0000, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 500;
			currentMouseImage.y = 425;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0xC0C0C0, 550, 600);
			drawMouseTrackHelpTile(1, 0x00FF00, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody3;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy3;
				currentColorFillCharacter.x = 989;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 590;
			currentMouseMoveGoody.y = 623;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveRightImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 6 || buttonAniIteration === 7) { // Pause before switch
			// Draw basic map expanded thrice
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(3);
			if(buttonAniIteration === 6) {
				drawMouseTrackHelpTile(2, 0xFF0000, 450, 400);

				drawMouseTrackHelpTile(1, 0xC0C0C0, 550, 600);
				drawMouseTrackHelpTile(4, 0x00FF00, 590, 623);

				if(isLightPhase) {
					drawColorFillHelpTile(true, 950, 405);
					drawColorFillHelpTile(true, 989, 428);
					drawColorFillHelpTile(true, 989, 472);
					drawColorFillHelpTile(false, 950, 495);
					drawColorFillHelpTile(false, 911, 472);
					drawColorFillHelpTile(false, 911, 428);
					drawColorFillHelpTile(false, 950, 450);
					currentColorFillCharacter = startScreenGoody4;
					currentColorFillCharacter.x = 950;
					currentColorFillCharacter.y = 495;
					StartScreen.container.addChild(currentColorFillCharacter);
				} else {
					drawColorFillHelpTile(false, 950, 405);
					drawColorFillHelpTile(false, 989, 428);
					drawColorFillHelpTile(false, 989, 472);
					drawColorFillHelpTile(true, 950, 495);
					drawColorFillHelpTile(true, 911, 472);
					drawColorFillHelpTile(true, 911, 428);
					drawColorFillHelpTile(true, 950, 450);
					currentColorFillCharacter = startScreenBaddy4;
					currentColorFillCharacter.x = 950;
					currentColorFillCharacter.y = 495;
					StartScreen.container.addChild(currentColorFillCharacter);
				}
				currentMouseMoveGoody = mouseMoveGoodyUp;
				currentMouseMoveGoody.x = 590;
				currentMouseMoveGoody.y = 623;
				StartScreen.container.addChild(currentMouseMoveGoody);
				currentMouseMoveImage = mouseMoveImage;
				currentMouseMoveImage.x = 510;
				currentMouseMoveImage.y = 575;
				StartScreen.container.addChild(currentMouseMoveImage);
			} else {
				drawMouseTrackHelpTile(2, 0x00FF00, 450, 400);

				drawMouseTrackHelpTile(4, 0x00FF00, 550, 600);
				drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

				if(isLightPhase) {
					drawColorFillHelpTile(true, 950, 405);
					drawColorFillHelpTile(true, 989, 428);
					drawColorFillHelpTile(true, 989, 472);
					drawColorFillHelpTile(true, 950, 495);
					drawColorFillHelpTile(false, 911, 472);
					drawColorFillHelpTile(false, 911, 428);
					drawColorFillHelpTile(false, 950, 450);
					currentColorFillCharacter = startScreenGoody4;
					currentColorFillCharacter.x = 950;
					currentColorFillCharacter.y = 495;
					StartScreen.container.addChild(currentColorFillCharacter);
				} else {
					drawColorFillHelpTile(false, 950, 405);
					drawColorFillHelpTile(false, 989, 428);
					drawColorFillHelpTile(false, 989, 472);
					drawColorFillHelpTile(false, 950, 495);
					drawColorFillHelpTile(true, 911, 472);
					drawColorFillHelpTile(true, 911, 428);
					drawColorFillHelpTile(true, 950, 450);
					currentColorFillCharacter = startScreenBaddy4;
					currentColorFillCharacter.x = 950;
					currentColorFillCharacter.y = 495;
					StartScreen.container.addChild(currentColorFillCharacter);
				}
				currentMouseMoveGoody = mouseMoveGoodyUp;
				currentMouseMoveGoody.x = 550;
				currentMouseMoveGoody.y = 600;
				StartScreen.container.addChild(currentMouseMoveGoody);
				currentMouseMoveImage = mouseMoveRightImage;
				currentMouseMoveImage.x = 510;
				currentMouseMoveImage.y = 575;
				StartScreen.container.addChild(currentMouseMoveImage);
			}
			

			currentMouseImage = mouseImage;
			currentMouseImage.x = 450;
			currentMouseImage.y = 450;
			StartScreen.container.addChild(currentMouseImage);
		} else if(buttonAniIteration === 8) {
			// Draw basic map expanded twice
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonGold;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(2);
			drawMouseTrackHelpTile(3, 0x00FF00, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 400;
			currentMouseImage.y = 425;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0x00FF00, 550, 600);
			drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody5;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy5;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 550;
			currentMouseMoveGoody.y = 600;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 9) {
			// Draw basic map expanded twice
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(2);
			drawMouseTrackHelpTile(4, 0x00FF00, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 400;
			currentMouseImage.y = 375;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0xC0C0C0, 550, 600);
			drawMouseTrackHelpTile(1, 0x00FF00, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody5;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy5;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 472;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 590;
			currentMouseMoveGoody.y = 623;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveRightImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 10) {
			// Draw basic map expanded Once
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonGold;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(1);
			drawMouseTrackHelpTile(5, 0x00FF00, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 450;
			currentMouseImage.y = 350;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0xC0C0C0, 550, 600);
			drawMouseTrackHelpTile(4, 0x00FF00, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody6;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy6;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyUp;
			currentMouseMoveGoody.x = 590;
			currentMouseMoveGoody.y = 623;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveImage;
			currentMouseMoveImage.x = 510;
			currentMouseMoveImage.y = 575;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 11) {
			// Draw basic map expanded Once
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonBlack;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(1);
			drawMouseTrackHelpTile(6, 0x00FF00, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 500;
			currentMouseImage.y = 375;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(4, 0x00FF00, 550, 600);
			drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenGoody6;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenBaddy6;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			currentMouseMoveGoody = mouseMoveGoodyUp;
			currentMouseMoveGoody.x = 550;
			currentMouseMoveGoody.y = 600;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveRightImage;
			currentMouseMoveImage.x = 510;
			currentMouseMoveImage.y = 575;
			StartScreen.container.addChild(currentMouseMoveImage);
		} else if(buttonAniIteration === 12) {
			// Draw basic map
			currentAButton = aButtonBlack;
			currentAButton.x = 110;
			currentAButton.y = 400;
			StartScreen.container.addChild(currentAButton);
			currentDButton = dButtonGold;
			currentDButton.x = 210;
			currentDButton.y = 400;
			StartScreen.container.addChild(currentDButton);

			drawUnfoggedTiles(0);
			drawMouseTrackHelpTile(1, 0x00FF00, 450, 400);

			currentMouseImage = mouseImage;
			currentMouseImage.x = 500;
			currentMouseImage.y = 425;
			StartScreen.container.addChild(currentMouseImage);

			drawMouseTrackHelpTile(1, 0x00FF00, 550, 600);
			drawMouseTrackHelpTile(1, 0xC0C0C0, 590, 623);

			if(isLightPhase) {
				drawColorFillHelpTile(true, 950, 405);
				drawColorFillHelpTile(true, 989, 428);
				drawColorFillHelpTile(true, 989, 472);
				drawColorFillHelpTile(true, 950, 495);
				drawColorFillHelpTile(true, 911, 472);
				drawColorFillHelpTile(true, 911, 428);
				drawColorFillHelpTile(true, 950, 450);
				currentColorFillCharacter = startScreenGoody6;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			} else {
				drawColorFillHelpTile(false, 950, 405);
				drawColorFillHelpTile(false, 989, 428);
				drawColorFillHelpTile(false, 989, 472);
				drawColorFillHelpTile(false, 950, 495);
				drawColorFillHelpTile(false, 911, 472);
				drawColorFillHelpTile(false, 911, 428);
				drawColorFillHelpTile(false, 950, 450);
				currentColorFillCharacter = startScreenBaddy6;
				currentColorFillCharacter.x = 911;
				currentColorFillCharacter.y = 428;
				StartScreen.container.addChild(currentColorFillCharacter);
			}
			isLightPhase = !isLightPhase;

			currentMouseMoveGoody = mouseMoveGoodyDown;
			currentMouseMoveGoody.x = 550;
			currentMouseMoveGoody.y = 600;
			StartScreen.container.addChild(currentMouseMoveGoody);
			currentMouseMoveImage = mouseMoveImage;
			currentMouseMoveImage.x = 625;
			currentMouseMoveImage.y = 650;
			StartScreen.container.addChild(currentMouseMoveImage);
		}

		if(buttonAniIteration >= 0 && buttonAniIteration <= 6) {
			fogHelpText1 = new PIXI.Text('Pressing \'A\' key increases map visibility,', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
			fogHelpText1.x = 50;
			fogHelpText1.y = 675;
			StartScreen.container.addChild(fogHelpText1);
			fogHelpText2 = new PIXI.Text('but decreases player movement speed', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
			fogHelpText2.x = 50;
			fogHelpText2.y = 690;
			StartScreen.container.addChild(fogHelpText2);
		} else {
			fogHelpText1 = new PIXI.Text('Pressing \'D\' key decreases map visibility,', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
			fogHelpText1.x = 50;
			fogHelpText1.y = 675;
			StartScreen.container.addChild(fogHelpText1);
			fogHelpText2 = new PIXI.Text('but increases player movement speed', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
			fogHelpText2.x = 50;
			fogHelpText2.y = 690;
			StartScreen.container.addChild(fogHelpText2);
		}

		mouseTrackText1 = new PIXI.Text('Direction of possible player', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		mouseTrackText1.x = 350;
		mouseTrackText1.y = 475;
		StartScreen.container.addChild(mouseTrackText1);
		mouseTrackText2 = new PIXI.Text('movement is tracked by mouse', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		mouseTrackText2.x = 350;
		mouseTrackText2.y = 490;
		StartScreen.container.addChild(mouseTrackText2);
		mouseTrackText3 = new PIXI.Text('cursor. Red means an impassable', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		mouseTrackText3.x = 350;
		mouseTrackText3.y = 505;
		StartScreen.container.addChild(mouseTrackText3);
		mouseTrackText4 = new PIXI.Text('tile. Green means a traversable tile.', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		mouseTrackText4.x = 350;
		mouseTrackText4.y = 520;
		StartScreen.container.addChild(mouseTrackText4);

		mouseMoveText1 = new PIXI.Text('Left mouse click moves player one tile', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		mouseMoveText1.x = 650;
		mouseMoveText1.y = 650;
		StartScreen.container.addChild(mouseMoveText1);
		mouseMoveText2 = new PIXI.Text('where green line indicates current direction.', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		mouseMoveText2.x = 650;
		mouseMoveText2.y = 665;
		StartScreen.container.addChild(mouseMoveText2);

		colorFillText1 = new PIXI.Text('Your goal is to illuminate darkness. Your enemy\'s is to', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		colorFillText1.x = 750;
		colorFillText1.y = 525;
		StartScreen.container.addChild(colorFillText1);
		colorFillText2 = new PIXI.Text('spread it. Enter a square to convert it. Encompass a dark', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		colorFillText2.x = 750;
		colorFillText2.y = 540;
		StartScreen.container.addChild(colorFillText2);
		colorFillText3 = new PIXI.Text('tile(s) with light or impassable tile and auto-convert it.', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		colorFillText3.x = 750;
		colorFillText3.y = 555;
		StartScreen.container.addChild(colorFillText3);
		colorFillText4 = new PIXI.Text('Beware: the opposite holds true. An enemy must always be', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		colorFillText4.x = 750;
		colorFillText4.y = 570;
		StartScreen.container.addChild(colorFillText4);
		colorFillText5 = new PIXI.Text('on or adjacent a dark tile, or it dies. Same goes for you,', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		colorFillText5.x = 750;
		colorFillText5.y = 585;
		StartScreen.container.addChild(colorFillText5);
		colorFillText6 = new PIXI.Text('but with light tiles.', {fontFamily: 'Courier', fontSize: 14, fontWeight: 200, fill: 0xCFB53B, align: 'left'});
		colorFillText6.x = 750;
		colorFillText6.y = 600;
		StartScreen.container.addChild(colorFillText6);

		buttonAniIteration++;
		if(buttonAniIteration > 12) {
			buttonAniIteration = 0;
		}
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
			currentBaddy = startScreenBaddyUp;
		} else {
			centerY = 260;
			currentBaddy = startScreenBaddyDown;
		}
		centerX = numOfTopDarkTiles * 40;
		currentBaddy.x = centerX;
		currentBaddy.y = centerY;

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
			currentGoody = startScreenGoodyUp;
		} else {
			centerY = 260;
			currentGoody = startScreenGoodyDown;
		}
		centerX = numOfTopLightTiles * 40;
		currentGoody.x = centerX;
		currentGoody.y = centerY;

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
		StartScreen.container.addChild(topTileGraphic);		
		StartScreen.container.addChild(unfoggedGraphic);
		StartScreen.container.addChild(mouseGraphic);
		StartScreen.container.addChild(fillGraphic);
		StartScreen.container.addChild(mouseMoveGraphic);
		StartScreen.drawStartScreenWords();

		drawDarkTileAnimation();
		darkTileAnimation = setInterval(drawDarkTileAnimation, 600);
	};

	// Return public api object at very end.
	return StartScreen;
};