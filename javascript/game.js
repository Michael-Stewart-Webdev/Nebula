/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Variables												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var DEBUG_MODE = true;
var debugStart = "3:23";


var myRequestAnimationFrame =  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback) {
                  window.setTimeout(callback, 10);
               };
window.requestAnimationFrame = myRequestAnimationFrame;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	   Game 												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Game = {

	init: function() {

		/* Begins the level */
		initLevel = function() {

			gameLoop = function() {
				/* Clears the canvas */
				function clearCanvas() {
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx_overlay.clearRect(0,0,canvas_overlay.width,canvas_overlay.height);
				}
				/* Performs the step event of every object in an array. */
				function stepObjects() {
					Nebula.draw();
					if(player.powerupBG) {
						player.powerupBG.draw();
					}
					for (var i = 0, ii = objects.length; i < ii; i++) {
						if(Camera.shake == true) {
							Camera.x_displacement = Math.floor(random(-Camera.shake_intensity, Camera.shake_intensity));
							Camera.y_displacement = Math.floor(random(-Camera.shake_intensity, Camera.shake_intensity));	
						}
						if(!(objects[i] instanceof Player)) {
							objects[i].step();	
							objects[i].draw();
						}
					}
					// Draw player last
					player.step();	
					player.draw();
				}
				/* Deletes all objects in the deletion array */
				function deleteOldObjects() {	
					// http://stackoverflow.com/questions/1187518/javascript-array-difference
					Array.prototype.diff = function(a) {
						return this.filter(function(i) {return a.indexOf(i) < 0;});
					};
					
					// Delete any old objects
					objects = objects.diff(objects_to_delete);
					objects_to_delete = [];
					
					// Delete bullets as well
					bullets = bullets.diff(bullets_to_delete);
					bullets_to_delete = [];

					// Delete enemy bullets as well
					enemyBullets = enemyBullets.diff(enemyBullets_to_delete);
					enemyBullets_to_delete = [];

					// Delete decoObjects as well
					decoObjects = decoObjects.diff(decoObjects_to_delete);
					decoObjects_to_delete = [];
										
					// Delete any score popups as well
					scorePopUps = scorePopUps.diff(scorePopUps_to_delete);
					scorePopUps_to_delete = [];

					// Remove any objects that have timers from the timerObjects list
					timerObjects = timerObjects.diff(timerObjects_to_delete);
					timerObjects_to_delete = [];

				}

				current_fps = fps.getFPS();		
				clearCanvas();
				stepObjects();
				Overlay.draw();
				GameInfo.countDownCombo();	
				deleteOldObjects();
				SpawnHandler.spawnRocks();
				step_number++;
				gameTicker = requestAnimationFrame(gameLoop);
			};

			Overlay = {	
				
				score_addition: 0,
				
				draw: function() {

					ctx_overlay.fillStyle = "white";
					ctx_overlay.font="40px fixedsys";
					ctx_overlay.textAlign="left"; 
					ctx_overlay.textBaseline = 'alphabetic';

					drawFps = function() {			
						ctx_overlay.fillText("FPS: " + current_fps, 10, 37);			
					}
					
					drawGameTime = function() {		
						var converted_time = convertToMmSs(seconds_passed);
						ctx_overlay.fillText("Time: " + converted_time, 10, 77); 
					}
					
					drawScore = function() {	
						var score_x_position = canvas.width / 2 * 4;
						ctx_overlay.fillText("SCORE:", score_x_position - 100, 37);
						ctx_overlay.fillText(GameInfo.score * 10, score_x_position + 40, 37);
						if(GameInfo.combo > 0) {
							var diff = ctx_overlay.measureText(GameInfo.score * 10).width;
							ctx_overlay.fillStyle = "#ccc";
							ctx_overlay.fillText("+ " + GameInfo.combo * 10, score_x_position + 65 + diff, 37);
							ctx_overlay.fillStyle = "white";				
						}
					}
					
					drawComboCount = function() {
						if(GameInfo.combo_count >= 3) {
							ctx_overlay.textAlign = "middle"; 
							ctx_overlay.fillText("COMBO: " + GameInfo.combo_count, (canvas.width * 4) / 2 - 48, 77);
							ctx_overlay.textAlign = "left"; 
						}
					}

					drawPickupMessage = function() {
						ctx_overlay.font = "" + 60 + "px fixedsys";
						ctx_overlay.textAlign = "center"; 
						ctx_overlay.textBaseline = 'middle';
						ctx_overlay.fillText(player.pickupMessage, canvas.width/2 * 4, 117); 
					}
					
					drawWarningMessage = function() {
						ctx_overlay.font = "" + EventHandler.warningMessageFontSize + "px fixedsys";
						ctx_overlay.textAlign = "center"; 
						ctx_overlay.textBaseline = 'middle';
						if(step_number % FRAME_RATE < FRAME_RATE / 2)
							ctx_overlay.fillText(EventHandler.warningMessage, canvas.width/2 * 4, canvas.height/2 * 4 - 120); 
					}
					
					drawHealthBar = function() {
						ctx_overlay.font = "" + 32 + "px fixedsys";
						ctx_overlay.textAlign = "center"; 
						ctx_overlay.textBaseline = 'middle';
						ctx_overlay.fillText("HEALTH", 144, canvas.height * 4 - 96); 

						var sprite_to_draw = s_bar_empty;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(4 + Camera.x_displacement ),	Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);						

						var sprite_to_draw = s_healthbar_full;
						if(player.health <= 75 && player.health > 25) sprite_to_draw = s_healthbar_half;
						if(player.health <= 25) sprite_to_draw = s_healthbar_dying;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w * player.health/100, sprite_to_draw.h, Math.floor(4 + Camera.x_displacement ), Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w * player.health/100, sprite_to_draw.h);

						var sprite_to_draw = s_bar_overlay;
						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(4 + Camera.x_displacement ),	Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);
					}

					drawSpecialBar = function() {
						ctx_overlay.font = "" + 32 + "px fixedsys";
						ctx_overlay.textAlign = "center"; 
						ctx_overlay.textBaseline = 'middle';
						ctx_overlay.fillText("SPECIAL (Q)", canvas.width * 4 - 144, canvas.height * 4 - 96); 

						var sprite_to_draw = s_bar_empty;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(canvas.width - 68 + Camera.x_displacement ),	Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);						

						var sprite_to_draw = s_special_bar;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w * player.special_energy/player.max_special_energy, sprite_to_draw.h, Math.floor(canvas.width - 68 + Camera.x_displacement ), Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w * player.special_energy/player.max_special_energy, sprite_to_draw.h);

						var sprite_to_draw = s_bar_overlay;
						if(specialbarBlink) {
							var sprite_to_draw = s_bar_overlay_white;
						}
						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(canvas.width - 68 + Camera.x_displacement ),	Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);
					}
					drawPowerupBar = function() {
						ctx_overlay.font = "" + 32 + "px fixedsys";
						ctx_overlay.textAlign = "center"; 
						ctx_overlay.textBaseline = 'middle';
						ctx_overlay.fillText("POWER-UP", canvas.width * 4 / 2, canvas.height * 4 - 96); 

						var sprite_to_draw = s_bar_empty;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(canvas.width / 2 - 32 + Camera.x_displacement ),	Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);				

						var sprite_to_draw = s_powerup_bar;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w * player.powerupTimeRemaining/player.powerupTotalTime, sprite_to_draw.h, Math.floor(canvas.width / 2 - 32 + Camera.x_displacement ), Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w * player.powerupTimeRemaining/player.powerupTotalTime, sprite_to_draw.h);

						var sprite_to_draw = s_bar_overlay;
						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(canvas.width / 2 - 32 + Camera.x_displacement ),	Math.floor(canvas.height - 20 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);
					}
					drawBossHealthBar = function() {
						if(bossObject.bossBarAlpha > 0) {
							ctx.globalAlpha = Math.round(8 * bossObject.bossBarAlpha) / 8;


							ctx_overlay.font = "" + 44 + "px fixedsys";
							ctx_overlay.textAlign = "center"; 
							ctx_overlay.textBaseline = 'middle';
							ctx_overlay.fillText("BOSS", canvas.width * 4 / 2, 124);

							var sprite_to_draw = s_healthbar_boss_empty;

							ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(32 + Camera.x_displacement ),	Math.floor(24 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);						

							var sprite_to_draw = s_healthbar_boss;

							ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w * bossObject.health/bossObject.maxHealth, sprite_to_draw.h, Math.floor(32 + Camera.x_displacement ), Math.floor(24 + Camera.y_displacement ), sprite_to_draw.w * bossObject.health/bossObject.maxHealth, sprite_to_draw.h);

							var sprite_to_draw = s_healthbar_boss_ov;
							ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(32 + Camera.x_displacement ),	Math.floor(24 + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);

							ctx.globalAlpha = 1;
						}
					}



					if(DEBUG_MODE) {
						drawFps();		
						drawGameTime();	
					}	
					drawScore();
					drawComboCount();
					drawHealthBar();
					drawSpecialBar();
					if(bossObject) {
						drawBossHealthBar();
					}
					if(player.powerup) {
						drawPowerupBar();
					}


					if(EventHandler.warningMessage != null) drawWarningMessage();
					if(player.pickupMessage != null) drawPickupMessage();
				}
			};			

			GameInfo = {
				score: 0,
				combo: 0,
				combo_timeout_max: FRAME_RATE * 3,	// 3 seconds
				combo_timeout: this.combo_timeout_max,
				combo_count: 0,
				
				countDownCombo: function() {
					if(this.combo > 0) {
						this.combo_timeout -= delta();
						if(this.combo_timeout <= 0) {
							//var combo_bonus = Math.floor(Math.pow(this.combo, 1 + ( this.combo_count / 20)));
							this.score += this.combo;
							this.combo = 0;
							this.combo_count = 0;
							this.combo_timeout = this.combo_timeout_max;			
						}		
					}
				},		
				addToCombo: function(value) {
					var appreciated_value = Math.floor(value * (1 + this.combo_count / 10))			//Math.floor(Math.pow(value, 1 + ( this.combo_count / 50)))
					this.combo += appreciated_value;
					this.combo_count++;
					this.combo_timeout = this.combo_timeout_max;		
					return appreciated_value;
				}
			};

			LevelHandler = {
				GROUP: 0,
				EVENT: 1,		
				initLevel: function(level) {		// So it can start at 0 seconds (start of game) or 50 seconds, etc.	

					var levelData;
					
					sortLevelData = function(levelData) {
						return levelData.sort(function(a, b) {
							var x = a["time"]; var y = b["time"];
							return ((x < y) ? -1 : ((x > y) ? 1 : 0));
						});
					}
					
					if(levelData == null) levelData = sortLevelData(level_data["level_" + level]);

					var milliseconds_passed = seconds_passed * 1000;

					for(var i = 0, ii = levelData.length; i < ii; i++) {
					
						var groupObject   = levelData[i]["enemies"];
						var pickupsObject = levelData[i]["pickups"];
						var time = convertToMilliseconds(levelData[i]["time"]);
						var eventObject = levelData[i]["event"];
						
						if(groupObject != undefined) {
							if(time >= (milliseconds_passed))
								SpawnHandler.addTimer(groupObject, time - (milliseconds_passed), "group");			
						}			

						if(pickupsObject != undefined) {
							if(time >= (milliseconds_passed))
								SpawnHandler.addTimer(pickupsObject, time - (milliseconds_passed), "pickups");			
						}
						
						if(eventObject != undefined) {
							var duration = convertToMilliseconds(eventObject["duration"])
							if(milliseconds_passed <= time)
								EventHandler.addTimer(eventObject,  time - (milliseconds_passed), duration, false);
							else if(milliseconds_passed <= (time + duration)) { // Within an event
								EventHandler.addTimer(eventObject, 1, (time + duration) - milliseconds_passed, true);
							} 				
						}
					}		
				},
				EventHandler: {

					eventTimers: [],
					eventEndTimers: [],
					warningMessage: null,
					warningMessageFontSize: null,		
					eventBackgrounds: [],
					lightningObj: null,		
					
					NO_EVENT: 			-1,
					WARNING: 			"warning",
					ASTEROID_FIELD: 	"asteroid field",
					LIGHTNING: 			"lightning",

					currentEvents: [],
					
					addTimer: function(eventObject, time, duration, startImmediately) {
						var event_timer = new Timer(function() { 
							EventHandler.startEvent(eventObject, startImmediately);
							EventHandler.eventTimers.splice(EventHandler.eventTimers.indexOf(event_timer), 1);
						}, time);
						var event_end_timer = new Timer(function() { 
							EventHandler.clearEvent(eventObject.type, false);
							EventHandler.currentEvents.splice(EventHandler.currentEvents.indexOf(eventObject.type), 1);
							EventHandler.eventEndTimers.splice(EventHandler.eventEndTimers.indexOf(event_end_timer), 1);
						}, time + duration);
						this.eventTimers.push(event_timer);
						this.eventEndTimers.push(event_end_timer);
					},

					// Events

					// Creates a warning message and puts it on the screen (gets picked up by Overlay)
					createWarning: function(message, fontSize) {
						this.warningMessage = message;	
						this.warningMessageFontSize = fontSize;
						this.currentEvents.push(this.WARNING);
					},
					
					// Creates an asteroid field
					createAsteroidField: function(intensity, startImmediately) {
						
						this.eventBackgrounds.push(new Starfield(data = {sprite: s_asteroids_5_dark, y: -canvas.height, image_alpha: 0.8, speed: 0.5, direction: 270, depth: 2500}));
						this.eventBackgrounds.push(new Starfield(data = {sprite: s_asteroids_3, 	 y: -canvas.height, image_alpha: 0.3, speed: 0.6, direction: 270, depth: 1650}));
						this.eventBackgrounds.push(new Starfield(data = {sprite: s_asteroids_4, 	 y: -canvas.height, image_alpha: 0.4, speed: 0.7, direction: 270, depth: 1600}));
						this.eventBackgrounds.push(new Starfield(data = {sprite: s_asteroids_1, 	 y: -canvas.height, image_alpha: 0.5, speed: 0.9, direction: 270, depth: 1000}));
						this.eventBackgrounds.push(new Starfield(data = {sprite: s_asteroids_2, 	 y: -canvas.height, image_alpha: 0.8, speed: 1.1, direction: 270, depth: 900}));
						
						sortObjectsByDepth();
						SpawnHandler.rockConstant = 1.4 * intensity * ROCK_BASE_INTENSITY;
						SpawnHandler.rockSpeedConstant = ROCK_BASE_SPEED + (0.3 * intensity);
						
						this.currentEvents.push(this.ASTEROID_FIELD);
						
						if(startImmediately) {
							for(var i = 0, ii = this.eventBackgrounds.length; i < ii; i++) {
								this.eventBackgrounds[i].y = 0;
							}
						}
					},
					
					// Creates lightning
					createLightning: function(intensity) {		
						this.lightningObj = new LightningObject(data = {intensity: intensity});
						sortObjectsByDepth();		
						this.currentEvents.push(this.LIGHTNING);		
					},
					
					clearAllEvents: function() {
						// Destroy everything
						if(this.currentEvents.length > 0) {
							var all_events = [this.WARNING, this.ASTEROID_FIELD, this.LIGHTNING];
							for(var i = 0; i < all_events.length; i++) {
								this.clearEvent(all_events[i], true);	
							}
							this.currentEvents.length = 0;
						}
						lightning_on = false;
					},
					
					// Gets rid of all events (asteroid fields, warning messages, etc)
					clearEvent: function(type, startImmediately) {		
						function clearWarning() {
							this.warningMessage = null;
							this.warningMessageFontSize = null;
						}
						function clearEventBackgrounds(startImmediately) {			
							for(var i = 0, ii = this.eventBackgrounds.length; i < ii; i++) {
								for(var j = 0, jj = objects.length; j < jj; j++) {
									if(objects[j] == this.eventBackgrounds[i]) {
										if(startImmediately)	objects[j].destroy();
										else					objects[j].startFadingOut();						
									}
								}		
							}		
						}
						function clearAsteroidField(startImmediately) {
							if(this.currentEvents.contains(this.ASTEROID_FIELD)) {
								clearEventBackgrounds.call(this, startImmediately);
								this.eventBackgrounds.length = 0;
								SpawnHandler.rockConstant = ROCK_BASE_INTENSITY;
								SpawnHandler.rockSpeedConstant = ROCK_BASE_SPEED;
							}
						}	
						function clearLightning() {
							if(this.currentEvents.contains(this.LIGHTNING)) {
								this.lightningObj.destroy();
								this.lightningObj = null;
							}
						}
						switch(type) {
							case this.WARNING: 			clearWarning.call(this); 							break;
							case this.ASTEROID_FIELD:	clearAsteroidField.call(this, startImmediately); 	break;
							case this.LIGHTNING:		clearLightning.call(this); 							break;
						}
					},

					// Starts an event
					startEvent: function(eventObject, startImmediately) {
						switch(eventObject.type) {							
							case this.WARNING: {
								var message = eventObject.message;
								var fontSize = eventObject.fontSize || 60;
								this.createWarning(message, fontSize);
								break;
							}
							case this.ASTEROID_FIELD: {				
								var intensity = eventObject.intensity;
								this.createAsteroidField(intensity, startImmediately);
								break;
							}		
							case this.LIGHTNING: {				
								var intensity = eventObject.intensity;
								this.createLightning(intensity);
								break;
							}	
						}
					}
				},

				// Spawns stuff
				SpawnHandler: {

					spawnTimers: [],
					rockConstant: 0.01,

					addTimer: function(objects, time, type) {
						if(type == "group") {
							var spawn_timer = new Timer(function() { 
								SpawnHandler.spawnGroup(objects);
								SpawnHandler.spawnTimers.shift();
							}, time);
						} else if (type == "pickups") {
							var spawn_timer = new Timer(function() { 
								SpawnHandler.spawnPickup(objects);
								SpawnHandler.spawnTimers.shift();
							}, time);							
						}
						this.spawnTimers.push(spawn_timer);
					},
					spawnPickup: function(items) {
						for(var i = 0; i < items.length; i++) {
							var x = (items[i]["x"] * 16) - 8;
							var y = (items[i]["y"] * 16) - 16;

							// Spawn each item
							switch(items[i]["id"]) {
								case 0:	new Pickup20HealthObject(data = {x: x, y: y}); break;
								case 1:	new PowerupSpeed(data = {x: x, y: y}); break;
							}
						}
					},
					spawnGroup: function(group) {
						for(var i = 0; i < group.length; i++) {

							var x = (group[i]["x"] * 16) - 8;
							var y = (group[i]["y"] * 16) - 16;
						
							// Spawn each group
							switch(group[i]["id"]) {
								case 0:	new EnemyBasic(data = {x: x, y: y}); break;
								case 1: new EnemyUFO(data = {x: x, y: y}); break;			
								case 2: new EnemyGhost(data = {x: x - 2, y: y}); break;			
								case 3: new EnemyPinkGhost(data = {x: x - 2, y: y}); break;			
								case 4: new EnemyGoldUFO(data = {x: x, y: y}); break;			
								case 5: new EnemyBossGhost(data = {x: x, y: y}); break;			
							}		
						}		
					},		
					spawnRocks: function(level) {
						r = random(0, 1/this.rockConstant);
						if(r < 1) {
							new DecoObjectRock1(data = {x: random(0, 320), y: -16, speed: this.rockSpeedConstant});
						}
						if(r > (1/this.rockConstant - 1)) {
							new DecoObjectRock2(data = {x: random(0, 320), y: -32, speed: this.rockSpeedConstant});
						}			
					}
				}
			}

			SpawnHandler = LevelHandler.SpawnHandler;
			EventHandler = LevelHandler.EventHandler;
			
			ROCK_BASE_INTENSITY = 0.003;
			ROCK_BASE_SPEED = 0.8;

			objects = []; 					// Stores all objects
			objects_to_delete = []; 		// Stores all objects that must be deleted at the end of the step

			bullets = []; 					// Stores all bullets (makes collision detection quicker for enemies)
			bullets_to_delete = []; 		// Stores all bullets that must be deleted at the end of the step

			enemyBullets = []; 				// Stores all enemy bullets (makes collision detection quicker for player)
			enemyBullets_to_delete = []; 	// Stores all enemy bullets that must be deleted at the end of the step

			decoObjects = [];				// Stores all decoObjects (such as rocks)
			decoObjects_to_delete = [];		// Stores all decoObjects that must be deleted at the end of the step

			scorePopUps = [];
			scorePopUps_to_delete = [];	

			timerObjects = [];
			timerObjects_to_delete = [];	

			player = new Player( data = {
				x: 				canvas.width / 2 - 8,
				y: 				canvas.height - 75,	
				w: 				16,
				h: 				16,
				name: 			"Michael"
				}
			);

			bossObject = null;

			starfield_close 	= new Starfield(data = {sprite: s_starfield_1, image_alpha: 1, speed: 0.6, direction: 270, depth: 1000});
			starfield_far 		= new Starfield(data = {sprite: s_starfield_2, image_alpha: 0.5, speed: 0.4, direction: 270, depth: 1000});
			starfield_very_far 	= new Starfield(data = {sprite: s_starfield_3, image_alpha: 0.15, speed: 0.2, direction: 270, depth: 1000});

			lightning_on = false;

			BLINK_INVISIBLE = 0;
			BLINK_RED = 1;	

			specialbarBlink = false; // If set to true, the special bar overlay will be white instead of grey
			specialbarBlinkCooldown = 0;
			specialbarBlinkCooldown2 = 0; // A secondary cooldown so it flickers instead of just becoming white whenever holding Q

			
			// This would be defined in the level JSON later
			SpawnHandler.rockConstant = ROCK_BASE_INTENSITY;
			SpawnHandler.rockSpeedConstant = ROCK_BASE_SPEED;

			LevelHandler.initLevel(1);	
			gameTicker = requestAnimationFrame(gameLoop);
		};

		initMenu = function() {
			// Create menu stuff here

		};

		Canvas = {	
			ctx: document.getElementById('canvas').getContext('2d'),
			width: 320,
			height: 240
		};
		CanvasOverlay = {
			ctx: document.getElementById('overlay').getContext('2d'),
			width: 1280,
			height: 960	
		};
		Keyboard = {		
			rightKey: false,
			leftKey: false,
			upKey: false,
			downKey: false,
			shootKey: false,
			specialShootKey: false,
			keyDown: function(e) {
				switch(e.keyCode) {
					case 39: this.rightKey 			= true; break;
					case 37: this.leftKey 			= true; break;
					case 38: this.upKey				= true; break;
					case 40: this.downKey			= true; break;
					case 32: this.shootKey 			= true;	break;
					case 81: this.specialShootKey 	= true;	break;
				}
			},
			keyUp: function(e) {
				switch(e.keyCode) {
					case 39: this.rightKey 			= false; break;
					case 37: this.leftKey 			= false; break;
					case 38: this.upKey				= false; break;
					case 40: this.downKey			= false; break;
					case 32: this.shootKey 			= false; break;	
					case 81: this.specialShootKey 	= false; break;	
				}
			},
			keyPress: function(e) {
				switch(e.keyCode) {
					case 112: Debug.promptSkip();	// p on Chrome, F1 on ff
				}
			}
		};
		Camera = {
			shake: false,
			x_displacement: 0,
			y_displacement: 0,
			shake_intensity: 5,
			shakeTimer: null,
			stopShaking: function() {
				this.shake = false;
				this.shakeTimer = null;
				this.x_displacement = 0;
				this.y_displacement = 0;
			},
			shakeBriefly: function(intensity = 2) {
				this.shake = true;
				this.shake_intensity = intensity;
				this.shakeTimer = new Timer(function() { 
					Camera.stopShaking();
				}, 333);
			}
		};

		/* Init game code */

		Nebula = new Nebula();
		
		current_fps = 0;				
		step_number = 0;			

		FRAME_RATE = 60;

		document.addEventListener('keydown', function(e) { Keyboard.keyDown(e) }, false);
		document.addEventListener('keyup', 	function(e) { Keyboard.keyUp(e) }, false);  
		document.addEventListener('keypress', function(e) { Keyboard.keyPress(e) }, false); 

		ctx 			= Canvas.ctx;
		ctx_overlay 	= CanvasOverlay.ctx;
		canvas 			= Canvas;
		canvas_overlay 	= CanvasOverlay;

		Sounds.load();

		initLevel();

		if(typeof debugStart !== 'undefined' && DEBUG_MODE == true) {
			Debug.skipToTime(debugStart);
		}
		
	}
}














	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	Background objects										 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */	
	
	
var delta = function() { return FRAME_RATE/current_fps; }

// Draws the Nebula
function Nebula() {

	this.sprite = s_nebula_1;
	this.image_alpha = 0.05;
	this.image_alpha_start = 0.05;
	this.max_alpha = 0.33;
	this.alphaGain = (this.max_alpha - this.image_alpha_start) / (60 * 180); // 3 minutes to reach max alpha

	this.setAlpha = function() {
		if(lightning_on) {
			this.image_alpha = 0.05;
		} else {
			this.image_alpha = this.image_alpha_start + (this.max_alpha - this.image_alpha_start) / (240) * seconds_passed;
		}
	}

	this.draw = function() {
		this.setAlpha();
		ctx.globalAlpha = this.image_alpha;
		ctx.drawImage(this.sprite.image, 0, 0);	
		ctx.globalAlpha = 1;
	}
}

// Draws the powerup background
function PowerupBackground() {
	this.sprite = data.sprite || s_powerupbg_clocks;
	this.image_alpha = 0.00;
	this.fadingIn = true;
	this.fadingOut = false;

	this.fadeIn = function() {
		this.image_alpha += 0.05 / FRAME_RATE * 2;
		if(this.image_alpha >= 0.05) {
			this.fadingIn = false;
		}
	}

	this.fadeOut = function() {
		this.image_alpha -= 0.05 / FRAME_RATE * 2;
		if(this.image_alpha <= 0) {
			delete this;
		}
	}

	this.draw = function() {
		if(this.fadingIn) {
			this.fadeIn();
		}
		if(this.fadingOut) {
			this.fadeOut();
		}
		ctx.globalAlpha = this.image_alpha;
		ctx.drawImage(this.sprite.image, 0, 0);	
		ctx.globalAlpha = 1;
	}
}




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											   Logical Stuff											 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */





























window.onload = Game.init();