/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*												FPS														 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// http://www.html5gamedevs.com/topic/1828-how-to-calculate-fps-in-plain-javascript/

var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = (this.frameNumber / currentTime).toFixed(1);

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;
	}	
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											   Pause / Resume											 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */		

function nekSecond() {
	seconds_passed++;
	second_ticker = new Timer(nekSecond, 1000);
}

var gamePaused = false; 
var second_ticker = new Timer(nekSecond, 1000);
var seconds_passed = 0;

window.onfocus = function () { 
	if(gamePaused == true) {
		gameTicker = requestAnimationFrame(gameLoop);
		audio.play();
		second_ticker.resume();
		for(var i = 0; i < SpawnHandler.spawnTimers.length; i++) { SpawnHandler.spawnTimers[i].resume(); }
		for(var i = 0; i < EventHandler.eventTimers.length; i++) { EventHandler.eventTimers[i].resume(); }
		for(var i = 0; i < EventHandler.eventEndTimers.length; i++) { EventHandler.eventEndTimers[i].resume(); }
		//for(var i = 0; i < player.timers.length; i++) { player.timers[i].resume(); }
		if(Camera.shakeTimer) {  Camera.shakeTimer.resume(); }
		if(Player.specialRegenTimer) {  Player.specialRegenTimer.resume(); }
		if(Player.powerupTimer) {  Player.powerupTimer.resume(); }
		if(Player.pickupMessageRemovalTimer) {  Player.pickupMessageRemovalTimer.resume(); }

		// For any object that is part of the timerObjects array, pause/resume their timers
		for(var i = 0; i < timerObjects.length; i++) { 
			for(var j = 0; j < timerObjects[i].timers.length; j++) {
				timerObjects[i].timers[j].resume();
			}			
		}

		gamePaused = false;
	} 
}; 

window.onblur = function () { 
	window.cancelAnimationFrame(gameTicker);
	audio.pause();
	second_ticker.pause();
	for(var i = 0; i < SpawnHandler.spawnTimers.length; i++) { SpawnHandler.spawnTimers[i].pause(); }
	for(var i = 0; i < EventHandler.eventTimers.length; i++) { EventHandler.eventTimers[i].pause(); }
	for(var i = 0; i < EventHandler.eventEndTimers.length; i++) { EventHandler.eventEndTimers[i].pause(); }
	//for(var i = 0; i < player.timers.length; i++) { player.timers[i].pause(); }
	if(Camera.shakeTimer) { Camera.shakeTimer.pause(); }
	if(Player.specialRegenTimer) {  Player.specialRegenTimer.pause(); }
	if(Player.powerupTimer) {  Player.powerupTimer.pause(); }
	if(Player.pickupMessageRemovalTimer) {  Player.pickupMessageRemovalTimer.pause(); }

	// For any object that is part of the timerObjects array, pause/resume their timers
	for(var i = 0; i < timerObjects.length; i++) { 
		for(var j = 0; j < timerObjects[i].timers.length; j++) {
			timerObjects[i].timers[j].pause();
		}			
	}

	gamePaused = true;	
	
}; 

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											Helper Functions											 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function convertToMmSs(seconds) {	
	var m = "" + Math.floor(seconds / 60);
	var s = "" + seconds % 60;
	if(m < 10) m = "0" + m;
	if(s < 10) s = "0" + s;

	return "" + m + ":" + s;
}

function convertToMilliseconds(time) {
	//http://stackoverflow.com/questions/9640266/convert-hhmmss-string-to-seconds-only-in-javascript
	var a = time.split(':');
	var seconds = (+a[0]) * 60 + (+a[1]); 	
	return seconds * 1000;
}

function convertToSeconds(time) {
	return convertToMilliseconds(time) / 1000;
}

// Random (because js doesn't have a good one)
function random(min, max) {
	return Math.random() * (max - min) + min;
}


// Sorts objects by their depth (to draw them in the right order)
function sortObjectsByDepth() {
	objects = objects.sort(function(a, b) {return a.depth - b.depth}).reverse();
}




// A miscellaneous timer

function Timer(callback, delay) {
	var timerId, timerIdEnd, start, remaining = delay;

	this.cancel = function() {
		window.clearTimeout(timerId);
		//timers.splice(timers.indexOf(this), 1);	
	}

	this.pause = function() {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};
	
	this.resume = function() {
		start = new Date();
		window.clearTimeout(timerId);
		timerId	= window.setTimeout(callback, remaining);
	};

	this.getRemaining = function() {
		return remaining;
	}
	this.resume();
}


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*													Debug					  							 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Debug = {
	skipToTime: function(seconds) {
		function isInt(value) {
		  return !isNaN(value) && 
				 parseInt(Number(value)) == value && 
				 !isNaN(parseInt(value, 10));
		}
		if(seconds.indexOf(':') !== -1)
			seconds = convertToSeconds(seconds);
		if (isInt(seconds)) {
			seconds = parseInt(seconds);
			seconds_passed = seconds;		
			// Cancel all the spawn and event timers, and rescan the JSON to set them up again
			for(var i = 0; i < SpawnHandler.spawnTimers.length; i++) SpawnHandler.spawnTimers[i].cancel();
			for(var i = 0; i < EventHandler.eventTimers.length; i++) EventHandler.eventTimers[i].cancel();
			for(var i = 0; i < EventHandler.eventEndTimers.length; i++) EventHandler.eventEndTimers[i].cancel();
			SpawnHandler.spawnTimers.length = 0;
			EventHandler.eventTimers.length = 0;
			EventHandler.eventEndTimers.length = 0;
			second_ticker.cancel();
			second_ticker = new Timer(nekSecond, 1000);
			EventHandler.clearAllEvents();
			LevelHandler.initLevel(1);		

			
			
			audio.currentTime = seconds;	// Skip the audio
		} else {
			console.log("Invalid time entered.");
		}
	},

	promptSkip: function() {
		if(DEBUG_MODE)
			var skip = prompt("What time to skip to (in seconds)?");
			this.skipToTime(skip);
	}
}