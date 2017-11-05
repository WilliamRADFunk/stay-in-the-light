/* 
Stay in the Light v0.0.24
Last Updated: 2017-September-10
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped loading bar object
var LoadingBarWrapper = function(center) {
	// Publicly accessible functionality.
	var LoadingBar = {};
	/**
	 * variables accessible to everything internal to LoadingBarWrapper go here
	 * aka starts with 'var'
	**/
	var loadingBox = new PIXI.Graphics();
	var currentPercentage = 0;
	var percentageText;

	var excuses = [
		'Trimming trees in the forests...',
		'Combing the desert for rebel spies...',
		'Injecting pure evil into the enemy units...',
		'Making mountains out of mole hills...',
		'Forming bucket brigades to fill ocean tiles...',
		'Digging ditches to make pits...',
		'Sucking space out of the null tiles...',
		'Plugging in the fog of war machine...',
		'Charging player\'s light batteries...',
		'Tightening straps on player\'s armor...',
		'Spawning all the things...',
	];
	var excuseText;
	var currentExcuseIndex = 0;
	var stayText;
	var inText;
	var theText;
	var lightText;

	var light1 = new PIXI.Graphics();
	var light2 = new PIXI.Graphics();
	var light3 = new PIXI.Graphics();
	var light4 = new PIXI.Graphics();

	var lights = [light1, light2, light3, light4];

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to LoadingBarWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to LoadingBarWrapper go here
	 * aka starts with 'var'
	**/
	var drawLight = function(lightIndex, sX, isLit) {
		lights[lightIndex].clear();

		var fillColor = 0xCFB53B;
		if(isLit) {
			lights[lightIndex].beginFill(fillColor);
		}
		lights[lightIndex].moveTo(sX, 10);
		lights[lightIndex].lineStyle(5, 0xCFB53B, 2);
		lights[lightIndex].lineTo(sX, 40);
		lights[lightIndex].lineTo(sX - 25, 65);
		lights[lightIndex].lineTo(sX + 25, 65);
		lights[lightIndex].lineTo(sX, 40);
		if(isLit) {
			lights[lightIndex].endFill(fillColor);
			lights[lightIndex].beginFill(fillColor, 0.2);
			lights[lightIndex].lineStyle(1, 0xCFB53B, 2);
			lights[lightIndex].moveTo(sX - 25, 65);
			lights[lightIndex].lineTo(sX - 55, 95);
			lights[lightIndex].lineTo(sX + 55, 95);
			lights[lightIndex].lineTo(sX + 25, 65);
			lights[lightIndex].endFill(fillColor);
		}
	};
	var drawWordStay = function(isLit) {
		if(stayText && isLit) {
			drawLight(0, 175, true);
			LoadingBar.container.removeChild(stayText);
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
		} else if(stayText) {
			drawLight(0, 175, false);
			LoadingBar.container.removeChild(stayText);
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		} else {
			drawLight(0, 175, false);
			stayText = new PIXI.Text('Stay', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		}
		stayText.x = 50;
		stayText.y = 100;
		LoadingBar.container.addChild(stayText);
	};
	var drawWordIn = function(isLit) {
		if(inText && isLit) {
			drawLight(1, 460, true);
			LoadingBar.container.removeChild(inText);
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
		} else if(inText) {
			drawLight(1, 460, false);
			LoadingBar.container.removeChild(inText);
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		} else {
			drawLight(1, 460, false);
			inText = new PIXI.Text('in', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		}
		inText.x = 400;
		inText.y = 100;
		LoadingBar.container.addChild(inText);
	};
	var drawWordThe = function(isLit) {
		if(theText && isLit) {
			drawLight(2, 730, true);
			LoadingBar.container.removeChild(theText);
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
		} else if(theText) {
			drawLight(2, 730, false);
			LoadingBar.container.removeChild(theText);
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		} else {
			drawLight(2, 730, false);
			theText = new PIXI.Text('the', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		}
		theText.x = 650;
		theText.y = 100;
		LoadingBar.container.addChild(theText);
	};
	var drawWordLight = function(isLit) {
		if(lightText && isLit) {
			drawLight(3, 1075, true);
			LoadingBar.container.removeChild(lightText);
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
		} else if(lightText) {
			drawLight(3, 1075, false);
			LoadingBar.container.removeChild(lightText);
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});

		} else {
			drawLight(3, 1075, false);
			lightText = new PIXI.Text('Light', {fontFamily: 'Courier', fontSize: 96, fontWeight: 100, fill: 0xCFB53B, align: 'left'});
		}
		lightText.x = 950;
		lightText.y = 100;
		LoadingBar.container.addChild(lightText);
	};

	/**
	 * variables accessible publicly from LoadingBarWrapper go here
	 * aka starts with 'LoadingBar'
	**/
	LoadingBar.drawBaseLoadingBar = function() {
		percentageText = new PIXI.Text('1 %', {fontFamily: 'Courier', fontSize: 24, fill: 0xCFB53B, align: 'left'});
		excuseText = new PIXI.Text(excuses[currentExcuseIndex], {fontFamily: 'Courier', fontSize: 24, fill: 0xCFB53B, align: 'left'});

		var fillColor = 0xCFB53B;
		loadingBox.moveTo(center.x - 100, center.y - 20);
		loadingBox.lineStyle(3, 0xCFB53B, 2);
		loadingBox.lineTo(center.x + 100, center.y - 20);
		loadingBox.lineTo(center.x + 100, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y - 20);
		
		loadingBox.beginFill(fillColor);
		loadingBox.moveTo(center.x - 100, center.y - 20);
		loadingBox.lineTo(center.x - 100 + 1.95, center.y - 20);
		loadingBox.lineTo(center.x - 100 + 1.95, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y - 20);
		loadingBox.endFill();

		LoadingBar.container.addChild(loadingBox);

		percentageText.x = center.x + 110;
		percentageText.y = center.y - 10;
		excuseText.x = center.x - 100;
		excuseText.y = center.y + 40;
		LoadingBar.container.addChild(percentageText);
		LoadingBar.container.addChild(excuseText);
		drawWordStay(false);
		drawWordIn(false);
		drawWordThe(false);
		drawWordLight(false);
	};
	LoadingBar.drawLoadingBarProgress = function(amount, isLoaded) {
		currentPercentage += amount;
		if(currentPercentage >= 95) {
			currentPercentage = 95;
		} else if(isLoaded) {
			currentPercentage = 99;
		}
		currentExcuseIndex++;
		if(currentExcuseIndex >= excuses.length || isLoaded) {
			currentExcuseIndex = excuses.length - 1;
		}

		percentageText.text = currentPercentage + ' %';
		excuseText.text = excuses[currentExcuseIndex];

		loadingBox.clear();

		var fillColor = 0xCFB53B;
		loadingBox.moveTo(center.x - 100, center.y - 20);
		loadingBox.lineStyle(3, 0xCFB53B, 2);
		loadingBox.lineTo(center.x + 100, center.y - 20);
		loadingBox.lineTo(center.x + 100, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y - 20);
		
		loadingBox.beginFill(fillColor);
		loadingBox.moveTo(center.x - 100, center.y - 20);
		loadingBox.lineTo(center.x - 100 + (1.95 * currentPercentage), center.y - 20);
		loadingBox.lineTo(center.x - 100 + (1.95 * currentPercentage), center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y + 20);
		loadingBox.lineTo(center.x - 100, center.y - 20);
		loadingBox.endFill();

		if(currentPercentage <= 20) {
			drawWordStay(true);
			var copyrightText = new PIXI.Text('Copyright 2017: Tenacious Teal Games', {fontFamily: 'Courier', fontSize: 18, fill: 0xCFB53B, align: 'left'});
			copyrightText.x = 50;
			copyrightText.y = 600;
			LoadingBar.container.addChild(copyrightText);
		} else if(currentPercentage <= 35) {
			drawWordStay(false);
			drawWordIn(true);
			var progsText = new PIXI.Text('Programmed By: William Funk & Jorge Rodriguez', {fontFamily: 'Courier', fontSize: 18, fill: 0xCFB53B, align: 'left'});
			progsText.x = 50;
			progsText.y = 620;
			LoadingBar.container.addChild(progsText);
		} else if(currentPercentage <= 80) {
			drawWordStay(false);
			drawWordIn(false);
			drawWordThe(true);
			var artText = new PIXI.Text('Art By: William Funk, Andrea Acosta Duarte, & Kenny Graphics', {fontFamily: 'Courier', fontSize: 18, fill: 0xCFB53B, align: 'left'});
			artText.x = 50;
			artText.y = 640;
			LoadingBar.container.addChild(artText);
		} else {
			drawWordStay(false);
			drawWordIn(false);
			drawWordThe(false);
			drawWordLight(true);
			var musicText = new PIXI.Text('Music & Sound FX By: Some brave soul', {fontFamily: 'Courier', fontSize: 18, fill: 0xCFB53B, align: 'left'});
			musicText.x = 50;
			musicText.y = 660;
			LoadingBar.container.addChild(musicText);
		}
	};

	/**
	 * functions accessible publicly from LoadingBarWrapper go here
	 * aka starts with 'LoadingBar'
	**/

	// Should decide where to instantiate the LoadingBar on the tile map,
	// and setup any internal logic for the LoadingBar.
	LoadingBar.init = function() {
		LoadingBar.container = new PIXI.Container();

		LoadingBar.container.addChild(lights[0]);
		LoadingBar.container.addChild(lights[1]);
		LoadingBar.container.addChild(lights[2]);
		LoadingBar.container.addChild(lights[3]);
	};

	// Return public api object at very end.
	return LoadingBar;
};