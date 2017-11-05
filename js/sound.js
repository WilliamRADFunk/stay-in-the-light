var SoundWrapper = function() {
	// Publicly accessible functionality.
	var Sound = {};
	
	//Sound Source initializations
	//Audio files appear in order stored in array
	var deathAudio = new Audio('./sounds/deathSound.wav');
	var musicLoop = new Audio('./sounds/loop.wav');
	const audioFileCount = 2;

	//Array containing Audio objects
	var audioArray = [];
	//Array that maps to audioArray checking validity of src file
	var validFile = [];
	
	//Removes fog mask from screen
	Sound.init = function(){
		//Create index of wav files
		audioArray = [deathAudio, musicLoop];

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
			setupSound(file, isLoop, vol);
			playSound(file);
		}
		else{
			stopSound(file, isReset);
		}
		//if play, is it loop?
		//set volume and play audio object.
		//else stopping
	};

	var isValid = function(fileNum){
		if(!validFile[fileNum]){
			return false;
		}
		return true;
	};

	var setupSound = function(fileNum, isLoop, vol){
		if(!audioArray[fileNum]){
			return;
		}
		audioArray[fileNum].loop = isLoop;
		audioArray[fileNum].volume = vol;
	};

	var playSound = function(fileNum){
		if(!audioArray[fileNum]){
			return;
		}
		audioArray[fileNum].play();
	};

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