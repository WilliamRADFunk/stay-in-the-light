/* 
Stay in the Light v0.0.1
Last Updated: 2017-July-17
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped fog object
var FogWrapper = function(container, center) {
	var Fog = {};
	// Fog parameters and internal values
	var radius;

	//Fog internal objects / graphics
	var circle;

	//Fog images
	var bgBACK = PIXI.Sprite.fromImage('./images/bluebg.jpg');

	bgBACK.anchor.set(0.5);

	bgBACK.x = center.x;
	bgBACK.y = center.y;

	var bgFRONT = PIXI.Sprite.fromImage('./images/colorbg.jpg');
	bgFRONT.anchor.set(0.5);

	var mainSPRITE = PIXI.Sprite.fromImage('./images/dvaSprite.jpg');
	mainSPRITE.anchor.set(0.5);

	//Fog exclusive container
	var fogContainer = new PIXI.Container();
	fogContainer.x = center.x;
	fogContainer.y = center.y;

	//mMasking Object
	var maskPRIME = new PIXI.Graphics();

	//var mainSPRITE = PIXI.Sprite.fromImage;


	Fog.init = function() {

		radius = 80;

		container.addChild(bgBACK);
		fogContainer.addChild(bgFRONT, mainSPRITE);

		container.addChild(fogContainer);

		container.addChild(maskPRIME);
		maskPRIME.x = center.x;
		maskPRIME.y = center.y;
		maskPRIME.lineStyle(0);
		maskPRIME.beginFill(0x8bc5ff, 0.4);
		maskPRIME.drawCircle(0, 0, radius);

		fogContainer.mask = maskPRIME;

		// container.on('pointertap', function() {
		// 	if (!container.mask){
		// 		container.mask = maskPRIME;
		// 	}
		// 	else{
		// 		container.mask = null;
		// 	}
		// });
	};

	Fog.redraw = function() {
		maskPRIME.clear();
		maskPRIME.beginFill(0x8bc5ff, 0.4);
		maskPRIME.drawCircle(center.x, center.y, radius);
	};

	Fog.move = function() {
		// Move eye of the fog
	};

	Fog.expand = function() {
		// Eye of fog gets one increment bigger
		radius += 20;
		//MAX CIELING for radius
		if(radius > center.y){
			radius = center.y;
		}
		
		maskPRIME.clear();
		maskPRIME.drawCircle(0, 0, radius);
	};

	Fog.contract = function() {
		radius -= 20;

		//MIN FLOOR for radius
		if(radius < 0){
			radius = 10;
		}

		maskPRIME.clear();
		maskPRIME.drawCircle(0, 0, radius);
		// Eye of fog resets to smallest setting
	};

	return Fog;
};