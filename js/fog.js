/*
Stay in the Light v0.0.12
Last Updated: 2017-September-08
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped fog object
var FogWrapper = function(container, center, hContainer, rEnder) {
	// Publicly accessible functionality.
	var Fog = {};
	
	//Aliases
	var loader = new PIXI.loaders.Loader();

	var frames = [];

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

				fogSprite = new PIXI.Sprite(resources["./images/fogFinal.json"].textures["Fog_0001_Layer-01.jpg"]);

				//Loop through frame count for fog and save 'frames' into frames array.
				for (var i = 1; i < 33; i++) {
					var val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					frames.push(PIXI.Texture.fromFrame('Fog_0001_Layer-' + val + '.jpg'));
				}

				// Custom tilemapping of the smaller fog animation
				for(var j = 0; j < 5; j++) {
					for(var k = 0; k < 3; k++) {
						var anim = new PIXI.extras.AnimatedSprite(frames);
						anim.position.x += (j * 256);
						anim.position.y += (k * 256);
						anim.animationSpeed = 0.3;
						anim.play();
						//Add Animation contents to the container
						container.addChild(anim);
					}
				}
				
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

			radius = 90;
		}).call(this);
		//# sourceMappingURL=index.js.map
	};

	Fog.redrawFogHole = function(center) {
		maskPrime.clear();
		if(center) {
			maskPrime.x = center.x;
			maskPrime.y = center.y;
		}
		maskPrime.drawCircle(0, 0, radius);
	};

	Fog.move = function(center) {
		Fog.redrawFogHole(center);
	};

	Fog.expand = function(center) {
		// Eye of fog gets one increment bigger
		radius += 45;
		//MAX CIELING for radius
		if(radius > 206){
			radius = 205;
		}
		//Redraw Fog at radius
		Fog.redrawFogHole(center);
	};

	Fog.contract = function(center) {
		radius -= 45;

		//MIN FLOOR for radius
		if(radius < 91){
			radius = 90;
		}
		//Redraw Fog at radius
		Fog.redrawFogHole(center);
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