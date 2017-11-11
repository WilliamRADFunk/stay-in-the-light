/*
Stay in the Light v0.0.26
Last Updated: 2017-November-10
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/
var SoundWrapper = function() {
	// Publicly accessible functionality.
	var Sound = {};
	//Sound Source initializations
	//Audio files appear in order stored in array
	var deathAudio = new Audio('./sounds/deathSound.wav');
	var musicLoop = new Audio('./sounds/loop.wav');
	var expandF = new Audio('./sounds/expandFog.wav');
	var contractF = new Audio('/sounds/contractFog.wav');
	var clickSound = new Audio('./sounds/click.wav');
	var enemyDeath = new Audio('./sounds/zombieUgh.mp3');
	var	musicLoopMenu = new Audio('./sounds/POL-secret-alchemy-short.wav');
	var playerWin = new Audio('./sounds/win.wav');
	var hoverSound = new Audio('./sounds/expandFog.wav');
	const audioFileCount = 9;
	var lastPlayed = -1;
	// Keeps track of which audio files are in play. This allows an "unmute" to simply up the volume on those already in play.
	var filesInPlay = [];
	var isSoundMuted = false;
	//Array containing Audio objects
	var audioArray = [];
	//Array that maps to audioArray checking validity of src file
	var validFile = [];
	//HARD-assembles audio array and verifies that each audio object stored is playable.
	Sound.init = function(){
		//Create index of wav files
		audioArray = [deathAudio, musicLoop, expandF, contractF, clickSound, enemyDeath, musicLoopMenu, playerWin, hoverSound];
		for(var i = 0; i < audioFileCount; i++){
			//Check for valid .wav file
			if(!audioArray[i]){
				console.log("Invalid Audio object.");
				validFile.push(false);
			}
			else{
				validFile.push(true);
			}
		}
	};
	//Function called externally to inidicate audio to play
	Sound.executeSound = function(fileNum, isPlay, isLoop, isReset, vol){
		//Check for wav file
		var file = fileNum;
		if(typeof fileNum !== "number" || typeof isPlay !== "boolean" || typeof isLoop !== "boolean" || typeof vol !== "number" || typeof isReset !== "boolean" ){
			console.log("ERROR sound: Invalid input for sound.");
			return;
		}
		//Check if file is valid
		if(!isValid(file)){
			console.log("You tried playing an invalid sound file. (file#" + fileNum);
			return;
		}
		//Check if play or not
		if(isPlay){
			if(isSoundMuted) {
				setupSound(file, isLoop, 0);
			} else {
				setupSound(file, isLoop, vol);
			}
			playSound(file);
			var fileTracker = {
				fileNumber: fileNum,
				volumeLevel: vol
			};
			var foundIt = false;
			for(var i = 0; i < filesInPlay.length; i++) {
				if(filesInPlay[i].fileNumber === fileNum) {
					filesInPlay[i].volumeLevel = vol;
					foundIt = true;
					break;
				}
			}
			if(!foundIt) {
				filesInPlay.push(fileTracker);
			}
		}
		else{
			stopSound(file, isReset);
			for(var i = 0; i < filesInPlay.length; i++) {
				if(filesInPlay[i].fileNumber === fileNum) {
					var fileTracker = filesInPlay[i];
					filesInPlay.splice(i, 1);
					break;
				}
			}
		}
	};
	// Sets playing sounds' volume to 0, but not off.
	Sound.muteSounds = function() {
		isSoundMuted = true;
		for(var i = 0; i < filesInPlay.length; i++) {
			audioArray[filesInPlay[i].fileNumber].volume = 0;
		}
	}
	// Sets playing sounds' volume back to original setting.
	Sound.unMuteSounds = function() {
		isSoundMuted = false;
		for(var i = 0; i < filesInPlay.length; i++) {
			audioArray[filesInPlay[i].fileNumber].volume = filesInPlay[i].volumeLevel;
		}
	}
	//Called to verify that file being called is valid
	var isValid = function(fileNum){
		if(!validFile[fileNum]){
			return false;
		}
		return true;
	};
	//Configure audio sound properties
	var setupSound = function(fileNum, isLoop, vol){
		if(!audioArray[fileNum]){
			return;
		}
		audioArray[fileNum].loop = isLoop;
		audioArray[fileNum].volume = vol;
	};
	//Plays sound associated with index
	var playSound = function(fileNum){
		if(!audioArray[fileNum]){
			return;
		}
		audioArray[fileNum].currentTime = 0;
		audioArray[fileNum].play();
	};
	//Stops sound
	var stopSound = function(fileNum, isReset){
		if(!audioArray[fileNum]){
			return;
		}
		audioArray[fileNum].pause();
		if(isReset){
			audioArray[fileNum].currentTime = 0;
		}
	};
	return Sound;
};