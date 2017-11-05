/* 
Stay in the Light v0.0.23
Last Updated: 2017-November-03
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

var SoundWrapper = function() {
	// Publicly accessible functionality.
	var Sound = {};
	
	//Sound Source initializations
	var deathAudio = new Audio('./sounds/deathSound.wav');
	var musicLoop = new Audio('./sounds/loop.wav');
	
	//Removes fog mask from screen
	Sound.init = function(){
		//In case of required init...
	};

	Sound.deathSound = function(){
		//Set mask to null to remove its contents.
		deathAudio.volume = 1;
		deathAudio.play();
	};
	Sound.playLoop = function(){
		console.log("Playing Loop");
		musicLoop.volume = 1;
		musicLoop.loop = true;
		musicLoop.play();
		console.log("Loop played");
	};

	Sound.cutSound = function(){
		musicLoop.pause();
		musicLoop.currentTime = 0;
	};

	return Sound;
};