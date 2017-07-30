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
	var bgBACK = PIXI.Sprite.fromImage('./images/bgblue.jpg');

	bgBACK.anchor.set(0.5);

	bgBACK.x = center.x;
	bgBACK.y = center.y;


	var bgFRONT = PIXI.Sprite.fromImage('./images/colorbg.jpg');
	bgFRONT.anchor.set(0.5);

	//var mainSPRITE = PIXI.Sprite.fromImage;


	Fog.init = function() {

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
		
		circle.clear();
		circle.drawCircle(center.x, center.y, radius);
	};

	Fog.contract = function() {
		radius -= 20;

		//MIN FLOOR for radius
		if(radius < 0){
			radius = 10;
		}

		circle.clear();
		circle.drawCircle(center.x, center.y, radius);
		// Eye of fog resets to smallest setting
	};

	return Fog;
};