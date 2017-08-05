/* 
Stay in the Light v0.0.3
Last Updated: 2017-August-05
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped fog object
var FogWrapper = function(container, center, hContainer, rEnder) {
	var Fog = {};
	// Fog parameters and internal values
	var radius;

	//Fog internal objects / graphics
	var circle;
	var tilemapSnapshot;

	//Fog images
	var bgBACK = PIXI.Sprite.fromImage('./images/bluebg.jpg');
	bgBACK.anchor.set(0.5);
	bgBACK.x = center.x;
	bgBACK.y = center.y;

	//Fog exclusive container
	var fogContainer = new PIXI.Container();
	fogContainer.x = center.x;
	fogContainer.y = center.y;

	//mMasking Object
	var maskPrime = new PIXI.Graphics();

	var renderTexture = PIXI.RenderTexture.create(rEnder.width, rEnder.height);

	Fog.init = function() {
		radius = 100;

		container.addChild(bgBACK);

		container.addChild(fogContainer);

		//Customize graphic to act as mask
		container.addChild(maskPrime);
		maskPrime.x = center.x;
		maskPrime.y = center.y;
		maskPrime.lineStyle(0);
		maskPrime.beginFill(0x8bc5ff, 0.4);
		maskPrime.drawCircle(0, 0, radius);

		fogContainer.mask = maskPrime;
	};

	Fog.redrawFogHole = function() {
		maskPrime.clear();
		maskPrime.drawCircle(0, 0, radius);
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
		//Redraw Fog at radius
		Fog.redrawFogHole();
	};

	Fog.contract = function() {
		radius -= 20;

		//MIN FLOOR for radius
		if(radius < 101){
			radius = 100;
		}
		//Redraw Fog at radius
		Fog.redrawFogHole();
	};

	Fog.renderFog = function() {
		if(tilemapSnapshot)
		{
			fogContainer.removeChild(tilemapSnapshot);
			delete tilemapSnapshot;
			tilemapSnapshot = null;
		}
		rEnder.render(hContainer, renderTexture);
		tilemapSnapshot = new PIXI.Sprite(renderTexture);
		tilemapSnapshot.anchor.set(0.5);
		fogContainer.addChild(tilemapSnapshot);
		maskPrime.clear();
		maskPrime.drawCircle(0, 0, radius);
	};

	return Fog;
};