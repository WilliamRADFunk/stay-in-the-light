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
	var circle;
	var radius;

	Fog.init = function() {

		radius = 50;
		//Layering circles...
		// var pixiCircle = new PIXI.Graphics();
		// pixiCircle.lineStyle(0, 0xFF00FF);  //(thickness, color)
		// pixiCircle.beginFill(0xFF00FF, 1);
		// pixiCircle.drawCircle(center.x, center.y, 100);   //(x,y,radius)
		// pixiCircle.endFill();
		// container.addChild(pixiCircle);

		// var pixiCircle2 = new PIXI.Graphics();
		// pixiCircle2.lineStyle(0, 0x00ff00);  //(thickness, color)
		// pixiCircle2.beginFill(0x00ff00, 0.4);
		// pixiCircle2.drawCircle(center.x, center.y, 80);   //(x,y,radius)
		// pixiCircle2.endFill();
		// container.addChild(pixiCircle2);
		//End of layering circles

		//Masking Container with circle dimension. 
		//*Removes ability from drawing in rest of container unless within mask.*
		circle = new PIXI.Graphics();
		circle.lineStyle(2, 0xFF00FF);  //(thickness, color)
		circle.drawCircle(center.x, center.y, radius);   //(x,y,radius)
		circle.endFill();
		container.mask = circle;
		container.addChild(circle);
	};

	Fog.move = function() {
		// Move eye of the fog
	};

	Fog.expand = function() {
		// Eye of fog gets one increment bigger
		radius += 20;
		circle.drawCircle(center.x, center.y, radius);
	};

	Fog.contract = function() {
		radius -= 20;
		circle.drawCircle(center.x, center.y, radius);
		// Eye of fog resets to smallest setting
	};

	return Fog;
};