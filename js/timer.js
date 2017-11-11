/* 
Stay in the Light v0.0.26
Last Updated: 2017-November-10
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Wrapped timer object
var TimerWrapper = function(center) {
	// Publicly accessible functionality.
	var Timer = {};
	/**
	 * variables accessible to everything internal to TimerWrapper go here
	 * aka starts with 'var'
	**/
	var muteSoundText;
	var timerBox = new PIXI.Graphics();
	var timerText = new PIXI.Graphics();

	var time = 180;

	/**
	 * internal constructors (like Tile in honeycomb.js) accessible to everything
	 * internal to TimerWrapper go here. aka starts with 'var' but requires 'new'.
	 * Make sure constructors start with first letter capitolized.
	**/

	/**
	 * functions accessible to everything internal to TimerWrapper go here
	 * aka starts with 'var'
	**/

	// Determines which digits to show in timer, making sure extra preceding 0 if only one digit.
	var calculateTime = function() {
		var digits = '';
		var minutes = Math.floor(time / 60);
		if(minutes < 10) {
			digits += '0';
		}
		digits += minutes.toString() + ':';
		var seconds = time % 60;
		if(seconds < 10) {
			digits += '0';
		}
		digits += seconds.toString();
		return digits;
	};
	// Calls all the draw components that sum up to make the whole timer.
	var drawTimer = function() {
		drawTimerBox();
		drawTimerDigits(calculateTime());
	};
	var drawMuteSoundText = function() {
		muteSoundText = new PIXI.Text('Press \'m\' to toggle sound', {fontFamily: 'Courier', fontSize: 18, fontWeight: 500, fill: 0xCFB53B, align: 'left'});
		muteSoundText.x = 0;
		muteSoundText.y = 0;
		Timer.containerMute.addChild(muteSoundText);
	};
	// Draw the border around the timer.
	var drawTimerBox = function() {
		timerBox.clear();
		timerBox.lineStyle(10, 0xCFB53B, 0.5);
		timerBox.drawRect(0, 0, 100, 50);
		timerBox.endFill();
	};
	// Draw the actual numbers in the timer.
	var drawTimerDigits = function(timeString) {
		// Text being weird in PIXI, it can't just be cleared like a graphic.
		Timer.container.removeChild(timerText);
		timerText = new PIXI.Text(timeString, {fontFamily: 'Courier', fontSize: 24, fontWeight: 800, fill: 0xCFB53B, align: 'left'});
		// Relative to the timer's renderer box.
		timerText.x = 15;
		timerText.y = 15;
		Timer.container.addChild(timerText);
	};

	/**
	 * variables accessible publicly from TimerWrapper go here
	 * aka starts with 'Timer'
	**/
	// Simply returns time remaining in the round.
	Timer.getTime = function() {
		return time;
	};
	// Draws the initial timer box and starter time.
	Timer.startTimer = function() {
		drawTimer();
	};
	// Decreases time by one second and redraws the timer to reflect updated time.
	Timer.tickTimer = function() {
		time--;
		if(time === 0) {
			var event = new Event('timeout');
			document.dispatchEvent(event);			
		}
		// Never go into negative time.
		if(time < 0) {
			time = 0;
		}
		// Draw updated timer
		drawTimer();
	};

	// Should decide where to instantiate the Timer on the tile map,
	// and setup any internal logic for the Timer.
	Timer.init = function() {
		Timer.container = new PIXI.Container();
		Timer.containerMute = new PIXI.Container();

		Timer.container.addChild(timerBox);
		Timer.container.addChild(timerText);
		// Draw sound mute instructions
		drawMuteSoundText();
	};

	// Return public api object at very end.
	return Timer;
};