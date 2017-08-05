/* 
Stay in the Light v0.0.2
Last Updated: 2017-July-30
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped fog object
var FogWrapper = function(container, center, hContainer, rEnder) {

	//Aliases
	var loader = new PIXI.loaders.Loader();

	var frames = [];
	var anim;

	var Fog = {};
	// Fog parameters and internal values
	var radius;

	//Fog internal objects / graphics
	var circle;
	var tilemapSnapshot;

	//Fog exclusive container
	var fogContainer = new PIXI.Container();
	fogContainer.x = center.x;
	fogContainer.y = center.y;

	//mMasking Object
	var maskPrime = new PIXI.Graphics();

	var renderTexture = PIXI.RenderTexture.create(rEnder.width, rEnder.height);

	var fogSprite;

	Fog.init = function() {

		loader.add("./images/fogFinal.json");
		(function() {
			"use strict";
			loader.load((loader, resources) => {

				fogSprite = new PIXI.Sprite(resources["./images/fogFinal.json"].textures["Fog_0001_Layer-01.png"]);

				//Loop through frame count for fog and save 'frames' into frames array.
			for (var i = 1; i < 23; i++) {
				var val = i < 10 ? '0' + i : i;
				// magically works since the spritesheet was loaded with the pixi loader
				frames.push(PIXI.Texture.fromFrame('Fog_0001_Layer-' + val + '.png'));
			}
				//Instantiate and set animation Sprite
				anim = new PIXI.extras.AnimatedSprite(frames);
				anim.animationSpeed = 0.3;
				anim.play();
				//Add Animation contents to the container
				container.addChild(anim);
				container.addChild(fogContainer);
				//Customize graphic to act as mask
				container.addChild(maskPrime);
				maskPrime.x = center.x;
				maskPrime.y = center.y;
				maskPrime.lineStyle(0);
				maskPrime.beginFill(0x8bc5ff, 0.4);
				maskPrime.drawCircle(0, 0, radius);
				//Apply Mask
				fogContainer.mask = maskPrime;
			});

			radius = 75;
}).call(this);

//# sourceMappingURL=index.js.map
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
		radius += 25;
		//MAX CIELING for radius
		if(radius > center.y){
			radius = center.y;
		}
		//Redraw Fog at radius
		Fog.redrawFogHole();
	};

	Fog.contract = function() {
		radius -= 25;

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