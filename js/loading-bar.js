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
	var tile1 = new Image();
	tile1.src = './images/tile01.png';
	var base = new PIXI.BaseTexture(tile1);
	var tileTexture = new PIXI.Texture(base);

	var car1 = new Image();
	car1.src = './images/carSilver.png';
	var base = new PIXI.BaseTexture(car1);
	var silverTexture = new PIXI.Texture(base);

	var car2 = new Image();
	car2.src = './images/carBlue.png';
	var base = new PIXI.BaseTexture(car2);
	var blueTexture = new PIXI.Texture(base);

	var car3 = new Image();
	car3.src = './images/carGreen.png';
	var base = new PIXI.BaseTexture(car3);
	var greenTexture = new PIXI.Texture(base);

	var car4 = new Image();
	car4.src = './images/carRed.png';
	var base = new PIXI.BaseTexture(car4);
	var redTexture = new PIXI.Texture(base);

	var carTaxi = new Image();
	carTaxi.src = './images/carRed.png';
	var base = new PIXI.BaseTexture(carTaxi);
	var taxiTexture = new PIXI.Texture(base);

	var carPolice = new Image();
	carPolice.src = './images/police.png';
	var base = new PIXI.BaseTexture(carPolice);
	var policeTexture = new PIXI.Texture(base);

	var cars = [];
	var currentCar;

	var tickCounter = 0;

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
		for(var i = 0; i < 20; i++) {
			var tile = new PIXI.Sprite(tileTexture);
			tile.x = 10 + i * 64;
			tile.y = center.y - 100;
			LoadingBar.container.addChild(tile);
		}
		var car = new PIXI.Sprite(silverTexture);
		car.x = -32;
		car.y = center.y - 90;
		cars.push(car);

		var car2 = new PIXI.Sprite(blueTexture);
		car2.x = -32;
		car2.y = center.y - 90;
		cars.push(car2);

		var car3 = new PIXI.Sprite(greenTexture);
		car3.x = -32;
		car3.y = center.y - 90;
		cars.push(car3);

		var car4 = new PIXI.Sprite(redTexture);
		car4.x = -32;
		car4.y = center.y - 90;
		cars.push(car4);

		var car5 = new PIXI.Sprite(taxiTexture);
		car5.x = -32;
		car5.y = center.y - 90;
		cars.push(car5);

		var car6 = new PIXI.Sprite(policeTexture);
		car6.x = -32;
		car6.y = center.y - 90;
		cars.push(car6);
	};

	LoadingBar.takeTurn = function() {
		tickCounter++;


		if(tickCounter === 30 || tickCounter % 240 === 0) {
			if(currentExcuse) {
				LoadingBar.container.removeChild(currentExcuse);
				currentExcuse = null;
			}
			var text = new PIXI.Text(excuses[currentExcuseIndex], {fontFamily: 'Arial', fontSize: 24, fill: 0xFFFFFF, align: 'center'});
			currentExcuseIndex++;
			if(currentExcuseIndex >= excuses.length) {
				currentExcuseIndex = excuses.length - 1;
			}
			currentExcuse = text;
			currentExcuse.x = center.x - 320;
			currentExcuse.y = center.y;
			LoadingBar.container.addChild(currentExcuse);
		}

		if(!currentCar) {
			var rando = Math.floor(Math.random() * 6);
			currentCar = cars[rando];
			currentCar.x = -32;
			LoadingBar.container.addChild(currentCar);
		}

		currentCar.x += 3;

		if(currentCar && currentCar.x > 1320) {
			LoadingBar.container.removeChild(currentCar);
			currentCar = null;
		}
	};

	// Return public api object at very end.
	return LoadingBar;
};