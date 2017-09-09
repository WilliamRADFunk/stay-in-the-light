/* 
Stay in the Light v0.0.7
Last Updated: 2017-September-09
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
		'Planting trees to make the forests...',
		'Shaving the desert cacti to meet OSEA standards...',
		'Digging ditches to make pits...',
		'Making mountains out of mole hills...',
		'Forming bucket brigade to fill ocean tiles...',
		'Sucking space out of the null tiles...',
		'Injecting pure evil into the enemy units...',
		'Plugging in the fog of war machine...',
		'Charging player\'s light batteries...',
		'Tightening straps on player\'s armor...',
		'Spawning all the things...',
	];
	var currentExcuse;
	var currentExcuseIndex = 0;

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to LoadingBarWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to LoadingBarWrapper go here
	 * aka starts with 'var'
	**/
	LoadingBar.drawBaseLoadingBar = function() {
		percentageText = new PIXI.Text('1 %', {fontFamily: 'Courier', fontSize: 24, fill: 0xCFB53B, align: 'left'});

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
		LoadingBar.container.addChild(percentageText);
	};
	LoadingBar.drawLoadingBarProgress = function(isLoaded) {
		currentPercentage++;
		if(currentPercentage >= 95) {
			currentPercentage = 95;
		} else if(isLoaded) {
			currentPercentage = 99;
		}

		percentageText.setText(currentPercentage + ' %');

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
	};	

	/**
	 * variables accessible publicly from LoadingBarWrapper go here
	 * aka starts with 'LoadingBar'
	**/

	/**
	 * functions accessible publicly from LoadingBarWrapper go here
	 * aka starts with 'LoadingBar'
	**/

	// Should decide where to instantiate the LoadingBar on the tile map,
	// and setup any internal logic for the LoadingBar.
	LoadingBar.init = function() {
		LoadingBar.container = new PIXI.Container();
	};

	// Return public api object at very end.
	return LoadingBar;
};