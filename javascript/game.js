/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Variables												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var DEBUG_MODE = true;
var debugStart = "3:23";
var bypassMenu = false;
var mode = "NONE"
var second_ticker = null;
var seconds_passed = 0;
var difficulty = 2;
var HUD_HEIGHT = 30;
var HUD_COLOR = "black"; //"rgb(12, 12, 12)";

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

		/* Begins the menu */
		initMenu = function() {

			Overlay = {
				draw: function(menuStage, selectedOption, offset = 0) {	
					ctx_overlay.fillStyle = "white";
					if(offset > 0) {
						ctx_overlay.fillStyle = "black";
					}

					ctx_overlay.globalAlpha = Math.round(5 * menuAlpha) / 5;
					
					ctx_overlay.font="40px fixedsys";
					ctx_overlay.textAlign="left"; 
					ctx_overlay.textBaseline = 'alphabetic';

					// Menu background
					ctx.globalAlpha = (Math.round(5 * menuAlpha) / 5) / 1.75;
					ctx.drawImage(menuBackground.image, 0, 0);	
					ctx.globalAlpha = 1;


					drawFps = function() {
						ctx_overlay.fillText("FPS: " + current_fps, 10, 37);
					}

					if(DEBUG_MODE) {
						drawFps();		
					}		

					switch(menuStage) {
						case "main menu": {
							drawTitle = function() {
								ctx_overlay.font="260px fixedsys";
								ctx_overlay.textAlign="center"; 
								//ctx_overlay.fillStyle="black";
								//ctx_overlay.fillText("NEBULA", (canvas.width * 4 / 2) + 8, (canvas.height * 2 / 2 + 50) + 8);
								//ctx_overlay.fillStyle="white";
								ctx_overlay.fillText("NEBULA", (canvas.width * 4 / 2) + offset * 3, (canvas.height * 2 / 2 + 50) + offset * 3);

							}

							drawStartCommand = function() {
								if(menuAlpha >= 1) {
									if(((menuTime - startFlashing) % FRAME_RATE > FRAME_RATE / 2)) {
										if(offset == 0) {
											ctx_overlay.fillStyle = "#ccc";
										}
									}
								}
								ctx_overlay.font="72px fixedsys";
								ctx_overlay.textAlign="center"; 
								//ctx_overlay.fillStyle="black";
								//ctx_overlay.fillText("PRESS SPACE TO START", (canvas.width * 4 / 2) + 4, (canvas.height * 4 / 2 + 50) + 4);	
								//ctx_overlay.fillStyle="white";	
								ctx_overlay.fillText("PRESS SPACE TO START", (canvas.width * 4 / 2) + offset, (canvas.height * 4 / 2 + 50) + offset);
								if(offset == 0) {
									ctx_overlay.fillStyle = "white";
								}	
								ctx_overlay.globalAlpha = 1;				
							}

							drawTitle();					
							drawStartCommand();	
							break;
						}
						case "select difficulty": {
							ctx_overlay.globalAlpha = 1;

							drawDifficultyLevels = function() {

								ctx_overlay.font="123px fixedsys";
								ctx_overlay.textAlign="center"; 
								ctx_overlay.fillText("SELECT DIFFICULTY", (canvas.width * 4 / 2) + offset * 1.5, 200 + offset * 1.5);

								ctx_overlay.font="90px fixedsys";
								ctx_overlay.textAlign="left";
								
								var sprite_to_draw = s_player_menu;
								var x_margin = 240;
								var x_margin_right = x_margin - 110;
								switch(selectedOption) {
									case 0: {										
										ctx.drawImage(sprite_to_draw.image,	Math.floor(0) * sprite_to_draw.w, 0, sprite_to_draw.w, sprite_to_draw.h,
											32, 86,
											sprite_to_draw.w, sprite_to_draw.h);
										ctx_overlay.fillText("EASY", x_margin, 400 + offset);
										ctx_overlay.textAlign="right";
										ctx_overlay.font="40px fixedsys";
										ctx_overlay.fillText("Ideal for beginners.", canvas.width * 4 - x_margin_right + offset/2, 400 - 17 + offset/2);
										break;
									}
									case 1: {
										ctx.drawImage(sprite_to_draw.image,	Math.floor(0) * sprite_to_draw.w, 0, sprite_to_draw.w, sprite_to_draw.h,
											32, Math.floor(86 + (150/4)),
											sprite_to_draw.w, sprite_to_draw.h);	

										ctx_overlay.fillText("NORMAL", x_margin + offset, 550 + offset);										
										ctx_overlay.textAlign="right";
										ctx_overlay.font="40px fixedsys";
										ctx_overlay.fillText("Reasonably challenging.", canvas.width * 4 - x_margin_right + offset/2, 550 - 17 + offset/2);
										break;
									}
									case 2: { 
										ctx.drawImage(sprite_to_draw.image,	Math.floor(0) * sprite_to_draw.w, 0, sprite_to_draw.w, sprite_to_draw.h,
											32, Math.floor(86 + (150/4)*2),
											sprite_to_draw.w, sprite_to_draw.h);	

										ctx_overlay.fillText("HARD", x_margin + offset, 700 + offset);
										ctx_overlay.textAlign="right";
										ctx_overlay.font="40px fixedsys";
										ctx_overlay.fillText("Fast and very difficult.", canvas.width * 4 - x_margin_right + offset/2, 700 - 18 + offset/2);
										break; 
									}
								}
								ctx_overlay.font="90px fixedsys"
								ctx_overlay.textAlign="left";
								ctx_overlay.globalAlpha = 0.5;
								ctx_overlay.fillText("EASY", x_margin + offset, 400 + offset);	 
								ctx_overlay.fillText("NORMAL", x_margin + offset, 550 + offset);	
								ctx_overlay.fillText("HARD", x_margin + offset, 700 + offset);	 


								ctx_overlay.globalAlpha = 1;

							}
							drawTip = function() {


							}

							drawDifficultyLevels();
							drawTip();
							break;


						}
					}	



				

				}				
			}

			menuLoop = function() {
				function clearCanvas() {
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx_overlay.clearRect(0,0,canvas_overlay.width,canvas_overlay.height);
				}
				menuAlpha += 0.01;
				if(menuAlpha >= 1) {
					if(startFlashing == 0)
						startFlashing = menuTime;
					menuAlpha = 1;
				}
				//if(menuAlpha <= 1) {
				//	
				//}
				menuTime++;
				current_fps = fps.getFPS();	
				clearCanvas();		

				// Draw twice, for a drop shadow
				Overlay.draw(menuStage, selectedOption, offset = 4);	
				Overlay.draw(menuStage, selectedOption);
				

			

				if(Keyboard.shootKey) {
					if(menuTime > lastTimePressed + 7) {
						sound_laser.play();
						switch(menuStage) {
							case "main menu": {									
								menuStage = "select difficulty";
								selectedOption = 1;
								totalOptions = 2;
								break;
							}
							case "select difficulty": {
								difficulty = selectedOption + 1;
								initLevel(levelNumber);
								return;
							}

						}						
						//selectedOption = 0;
						lastTimePressed = menuTime;
						//return;
					}
					
				}
				if(Keyboard.upKey) {
					if(menuTime > lastTimePressed + 7 && totalOptions > 0) {
						selectedOption--;
						if(selectedOption >= 0)
							sound_menu_nav.play();
						else
							sound_menu_nav_deep.play();
						if(selectedOption == -1) {
							selectedOption = 0; //totalOptions;
						}
						lastTimePressed = menuTime;
					}
				}
				if(Keyboard.downKey) {
					if(menuTime > lastTimePressed + 7 && totalOptions > 0) {
						selectedOption++;
						if(selectedOption <= totalOptions)
							sound_menu_nav.play();
						else
							sound_menu_nav_deep.play();
						if(selectedOption > totalOptions) {
							selectedOption = totalOptions; //0;
						}	
						lastTimePressed = menuTime;
					}				
				}
				if(Keyboard.escapeKey) {
					if(menuTime > lastTimePressed + 7) {
						sound_menu_nav.play();
						switch(menuStage) {
							case "select difficulty": {
								menuStage = "main menu";
								totalOptions = 0;
								break;
							}
						}	
						lastTimePressed = menuTime;					
					}
				}
				
				gameTicker = requestAnimationFrame(menuLoop);
			}
			levelNumber = 1;
			//difficulty = 3;
			menuTime = 0;
			menuAlpha = 0;
			gameTicker = requestAnimationFrame(menuLoop);
			menuBackground = s_nebula_menu;
			startFlashing = 0; // Determines when PRESS SPACE TO START starts flashing
			menuStage = "main menu";
			selectedOption = 0;
			totalOptions = 0;
			lastTimePressed = 0; // To stop it pressing twice at a time
			
			mode = "MENU";

		}

		/* Begins the level */
		initLevel = function(levelNumber) {

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
						ctx_overlay.fillText("FPS:  " + current_fps, 10, 37);			
					}
					
					drawGameTime = function() {		
						var converted_time = convertToMmSs(seconds_passed);
						ctx_overlay.fillText("Time: " + converted_time, 10, 77); 
					}

					drawDifficulty = function() {		
						var converted_difficulty = convertDifficultyToString(difficulty);
						ctx_overlay.fillText("Diff: " + converted_difficulty + " (" + difficulty + ")", 10, 117); 
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
							ctx_overlay.textAlign = "right"; 
							ctx_overlay.fillText("COMBO: " + GameInfo.combo_count, (canvas.width * 4) - 10, 37);
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
					
					drawBar = function(fontSize,barText, textX, textY, barSprite, barOverlaySprite, barEmptySprite, barX, barY, barWidthVariable) {
						ctx_overlay.font = "" + fontSize + "px fixedsys";
						ctx_overlay.textAlign = "center"; 
						ctx_overlay.textBaseline = 'middle';
						ctx_overlay.fillText(barText, textX, textY); 

						var sprite_to_draw = barEmptySprite;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(barX + Camera.x_displacement ),	Math.floor(barY + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);	

						var sprite_to_draw = barSprite;

						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w * barWidthVariable, sprite_to_draw.h, Math.floor(barX + Camera.x_displacement ), Math.floor(barY + Camera.y_displacement ), sprite_to_draw.w * barWidthVariable, sprite_to_draw.h);					

						var sprite_to_draw = barOverlaySprite;
						ctx.drawImage(sprite_to_draw.image, 0, 0, sprite_to_draw.w, sprite_to_draw.h,	Math.floor(barX + Camera.x_displacement ),	Math.floor(barY + Camera.y_displacement ), sprite_to_draw.w, sprite_to_draw.h);


					}

					drawHUDBar = function() {
						ctx.globalAlpha = 1;
						ctx.fillStyle = HUD_COLOR;
						ctx.fillRect(0, canvas.height - HUD_HEIGHT, canvas.width, canvas.height);
						//ctx.strokeStyle = "white";
						//ctx.strokeRect(0, canvas.height- 30, canvas.width, canvas.height);
						ctx.fillStyle = "white";
					}

					drawHealthBar = function() {
						var healthBarSprite = s_healthbar_full;
						if(player.health <= 75 && player.health > 25) healthBarSprite = s_healthbar_half;
						if(player.health <= 25) healthBarSprite = s_healthbar_dying;

						drawBar(32, "HEALTH", 144, canvas.height * 4 - 96, healthBarSprite, s_bar_overlay, s_bar_empty, 4, canvas.height - 20, player.health / 100);
					}


					drawSpecialBar = function() {
						var ov = s_bar_overlay;
						if(specialbarBlink) {
							ov = s_bar_overlay_white;
						}
						drawBar(32, "SPECIAL (Q)", canvas.width * 4 - 144, canvas.height * 4 - 96, s_special_bar, ov, s_bar_empty, canvas.width - 68, canvas.height - 20, player.special_energy/player.max_special_energy);					
					}

					drawPowerupBar = function() {
						drawBar(32, player.powerup.toUpperCase(), canvas.width * 4 / 2, canvas.height * 4 - 96, s_powerup_bar, s_bar_overlay, s_bar_empty, canvas.width / 2 - 32, canvas.height - 20, player.powerupTimeRemaining/player.powerupTotalTime);		
					}

					drawBossHealthBar = function() {
						if(bossObject.bossBarAlpha > 0) {
							ctx.globalAlpha = Math.round(8 * bossObject.bossBarAlpha) / 8;

							drawBar(44, "BOSS", canvas.width * 4 / 2, 78, s_healthbar_boss, s_healthbar_boss_ov, s_healthbar_boss_empty, 32, 12, bossObject.health/bossObject.maxHealth);							

							ctx.globalAlpha = 1;
						}
					}



					if(DEBUG_MODE) {
						drawFps();		
						drawGameTime();	
						drawDifficulty();	
					}	
					drawScore();
					drawComboCount();
					drawHUDBar();					
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
				initLevel: function(levelNumber, difficulty) {

					var levelData;
					
					sortLevelData = function(levelData) {
						return levelData.sort(function(a, b) {
							var x = a["time"]; var y = b["time"];
							return ((x < y) ? -1 : ((x > y) ? 1 : 0));
						});
					}
					
					//if(levelData == null) levelData = sortLevelData(level_data["level_" + levelNumber]["Groups"]);

					levelGroupsData = sortLevelData(level_data["level_" + levelNumber]["Groups"]);
					levelMetadata = level_data["level_" + levelNumber]["Metadata"];

					// Set the asteroid constants
					ROCK_BASE_INTENSITY = levelMetadata.ROCK_BASE_INTENSITY || 0.003;	// Get this from the level data
					ROCK_BASE_SPEED = levelMetadata.ROCK_BASE_SPEED || 0.8;	

					// Make the asteroids appear more often base on the difficulty
					if(difficulty == 1) {
						ROCK_BASE_INTENSITY *= 0.9;
						ROCK_BASE_SPEED *= 0.8;
					} else if(difficulty == 3) {
						ROCK_BASE_INTENSITY *= 1.2;
						ROCK_BASE_SPEED *= 1.05;
					}


					SpawnHandler.rockConstant = ROCK_BASE_INTENSITY;
					SpawnHandler.rockSpeedConstant = ROCK_BASE_SPEED;

					var milliseconds_passed = seconds_passed * 1000;

					for(var i = 0, ii = levelGroupsData.length; i < ii; i++) {


					
						var groupObject   = levelGroupsData[i]["enemies"];
						var pickupsObject = levelGroupsData[i]["pickups"];
						var time = convertToMilliseconds(levelGroupsData[i]["time"]);
						var eventObject = levelGroupsData[i]["event"];
						
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
				endLevel: function(victorious) {
					for(var i = 0; i < objects.length; i++) {
						if(objects[i] instanceof Starfield) {
							objects[i].speed = 0;
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
						var multiplier = 1.4;
						var speedMultiplier = 0.3;
						if(difficulty == 1) {
							multiplier = 0.8;
							speedMultiplier = 0.1;
						}
						SpawnHandler.rockConstant = multiplier * intensity * ROCK_BASE_INTENSITY;
						SpawnHandler.rockSpeedConstant = ROCK_BASE_SPEED + (speedMultiplier * intensity);
						
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
					parseDifficulty: function(objectDifficulty) {
						if(objectDifficulty.indexOf("+") > 0) {							
							var d = objectDifficulty.split("+")[0];
							return difficulty >= parseInt(d);
						} else if(objectDifficulty.indexOf("-") > 0) {
							var d = objectDifficulty.split("-")[0];							
							return difficulty <= parseInt(d);								
						} else {
							var d = objectDifficulty[0];
							return parseInt(d) == difficulty;
						}
						
					},
					spawnPickup: function(items) {
						for(var i = 0; i < items.length; i++) {
							var item = items[i];
							var x = (item.x * 16) - 8;
							var y = (item.y * 16) - 16;

							if(item.difficulty) { // If the 'difficulty' key is in there, parse it and return whether the enemy is allowed to spawn
								var canSpawn = SpawnHandler.parseDifficulty(item.difficulty);
							} else {
								var canSpawn = true;
							}

							if(canSpawn) {
								// Spawn each item
								switch(item.id) {
									case 0:	new Pickup20HealthObject(data = {x: x, y: y}); break;
									case 1:	new PowerupSpeed(data = {x: x, y: y}); break;
								}
							}
						}
					},
					spawnGroup: function(group) {

						for(var i = 0; i < group.length; i++) {

							var enemy = group[i];

							var x = (enemy.x * 16) - 8;
							var y = (enemy.y * 16) - 16;

							if(enemy.difficulty) { // If the 'difficulty' key is in there, parse it and return whether the enemy is allowed to spawn
								var canSpawn = SpawnHandler.parseDifficulty(enemy.difficulty, difficulty);
							} else {
								var canSpawn = true;
							}
						
							if(canSpawn) {
								// Spawn each enemy in the group
								switch(enemy.id) {
									case 0:	new EnemyBasic(data = {x: x, y: y}); break;
									case 1: new EnemyUFO(data = {x: x, y: y}); break;			
									case 2: new EnemyGhost(data = {x: x - 2, y: y}); break;			
									case 3: new EnemyPinkGhost(data = {x: x - 2, y: y}); break;			
									case 4: new EnemyGoldUFO(data = {x: x, y: y}); break;			
									case 5: new EnemyBossGhost(data = {x: x, y: y}); break;			
									case 6: new EnemyBasicGunner(data = {x: x, y: y}); break;			
								}	
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
			
			ROCK_BASE_INTENSITY = 0;	// Get this from the level data
			ROCK_BASE_SPEED = 0;

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

			


			LevelHandler.initLevel(levelNumber, difficulty);	
			gameTicker = requestAnimationFrame(gameLoop);

			audio.play();

			mode = "GAME";

			second_ticker = new Timer(nekSecond, 1000);
			seconds_passed = 0;

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
			escapeKey: false,
			keyDown: function(e) {
				switch(e.keyCode) {
					case 39: this.rightKey 			= true; break;
					case 37: this.leftKey 			= true; break;
					case 38: this.upKey				= true; break;
					case 40: this.downKey			= true; break;
					case 32: this.shootKey 			= true;	break;
					case 81: this.specialShootKey 	= true;	break;
					case 27: this.escapeKey		 	= true;	break;
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
					case 27: this.escapeKey		 	= false; break;
				}
			},
			keyPress: function(e) {
				switch(e.keyCode) {
					case 112: if(mode == "GAME") Debug.promptSkip();	// p on Chrome, F1 on ff

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

		if(bypassMenu) {
			initLevel(1, 3);
		} else {
			initMenu();
		}
		
		//

		
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