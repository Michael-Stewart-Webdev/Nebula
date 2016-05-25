/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Objects												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* Generic object (used for things like players, enemies, bullets, etc) */
function Object(data) {

	// Movement
	this.x = data.x || 0;
	this.y = data.y || 0;
	this.speed = data.speed || 0;
	this.direction = data.direction || 0;	
		
	// Image
	this.sprite = data.sprite || MISSING_SPRITE;
	this.image_speed = 0;	// 1 = 1 frame per step
	this.image_index = 0;
	this.image_rotation = 0;
	if(data.image_alpha != undefined) this.image_alpha = data.image_alpha
	else this.image_alpha = 1;	// Idk why I have to do that, but I do
	this.max_alpha = data.max_alpha || 1;
	this.depth = data.depth || 0;
	this.doNotProcessAlpha = false;
		
	// Blinking
	this.blinking = false;
	this.blink_time_total = FRAME_RATE / 5; // 0.2s of blinking
	this.blink_timer = 0;
	this.blink_on = false;
	this.blink_style = 0;
	this.blinking_sprite = data.blinking_sprite || MISSING_SPRITE;
	this.x_displacement = 0;
	this.y_displacement = 0;
	this.shake_intensity = 1;
		
	// Shooting
	this.shooting = false;
	this.shoot_time_total = FRAME_RATE / 10;
	this.shoot_timer = 0;
	this.shooting_image_speed = 0.1;
	this.shooting_image_index = 0;
	this.shooting_sprite = MISSING_SPRITE;
	
	// Fading in or out
	this.fading_in = data.fading_in || false;
	this.fading_out = data.fading_out || false;
	this.fadeOutSpeed = data.fadeOutSpeed || 0.015;

	this.blend_mode = data.blend_mode || "source-over";

	this.affectedByQuickReflexes = true;
	this.affectedByLightning = true;

	

	// For objects that contain timers (mostly bosses), this variable will trigger its deletion from the timerObjects array
	// when the object is deleted.
	this.hasTimers = false;

	objects.push(this);	


	this.checkCollisionWithObj = function(obj) {
		var thb = this.sprite.hitbox;
		var ohb = obj.sprite.hitbox;
		var tx1 = this.x + thb[0];
		var ty1 = this.y + thb[1];
		var tx2 = this.x + thb[2];
		var ty2 = this.y + thb[3];
		var ox1 = obj.x  + ohb[0];
		var oy1 = obj.y  + ohb[1];
		var ox2 = obj.x  + ohb[2];
		var oy2 = obj.y  + ohb[3];

		if(tx1 >= ox1 && tx1 <= ox2) {
			if(ty1 >= oy1 && ty1 <= oy2) {	
				return obj;	
			}
			if(ty1 <= oy1 && ty2 >= oy1) {	
				return obj;
			}
		}
		if(tx1 <= ox1 && tx2 >= ox1 ) {
			if(ty1 >= oy1 && ty1 <= oy2) {		
				return obj;	
			}
			if(ty1 <= oy1 && ty2 >= oy1) {	
				return obj;
			}			
		}		
	}	
	

	this.move = function() {
		if(this.speed > 0) {
			var adjusted_speed;
			// Modify speed based on framerate
			if(current_fps > 0) adjusted_speed = this.speed * delta();
			else adjusted_speed = this.speed;
			if(player.hasPowerup("quick reflexes") && this.affectedByQuickReflexes) {
				adjusted_speed *= 0.33;
				if(step_number % (FRAME_RATE / 3) == 0) {
					var hologram = new Hologram(data = {x: this.x, y: this.y, sprite: this.sprite});
				}
			}
		
			radians = (this.direction + 90) * (Math.PI/180)
			this.x += adjusted_speed * Math.sin(radians);
			this.y += adjusted_speed * Math.cos(radians);		
		}
	}
	
	this.step = function() {
		// Do stuff
	}
	
	this.destroy = function() {
		objects_to_delete.push(this);
		if(this.hasTimers) {
			timerObjects_to_delete.push(this)
		}
	}
	
	// Start blinking
	this.start_blinking = function() {
		this.blinking = true;
		this.blink_timer = this.blink_time_total;	
	}
	
	// Stop blinking
	this.stop_blinking = function() {
		this.blinking = false;
		this.blink_on = false;
		this.blink_timer = 0;		
	}
	
	// Countdown blinking
	this.blink_countdown = function() {			
		if(this.blink_timer % 10 >= 5) {
			this.blink_on = false;
		} else {
			this.blink_on = true;
		}
		this.blink_timer -= 0.75 * delta();
		this.x_displacement = random(-this.shake_intensity, this.shake_intensity);
		this.y_displacement = random(-this.shake_intensity, this.shake_intensity);	
		if(this.blink_timer <= 0) {
			this.stop_blinking();
		}
	}	
	

	// Start shooting
	this.start_shooting = function() {
		this.shooting = true;
		this.shoot_timer = this.shoot_time_total;
	}

	// Stop shooting
	this.stop_shooting = function() {
		this.shooting = false;
		this.shoot_timer = 0;		
	}
	
	// Countdown shooting
	this.shoot_countdown = function() {			
		this.shoot_timer -= 0.75 * delta();
		this.shoot_image_index += 0.1;
		if(this.shoot_timer <= 0) {
			this.stop_shooting();
		}
	}
	
	// Fade out
	this.fadeOut = function() {
		this.image_alpha -= this.fadeOutSpeed * delta();		
		
		if(this.image_alpha <= 0.01) {
			this.destroy();
		}	
	}
	

	
	// Start fading out
	
	this.startFadingOut = function() {
		this.fading_out = true;
	}
	
	// Get a nicer version of image alpha
	this.processImageAlpha = function() {
		if(this.doNotProcessAlpha) {
			return this.image_alpha;
		}
		return Math.round(4 * this.image_alpha) / 4;	
	}
	
	this.draw = function() {	
	
		if(lightning_on && this.affectedByLightning) ctx.globalCompositeOperation = "destination-out";
		else ctx.globalCompositeOperation = this.blend_mode;

	
		if(this.fading_out) this.fadeOut();
	
		ctx.globalAlpha = this.processImageAlpha();
		var sprite_to_draw = this.sprite;
		
		this.image_index += this.image_speed;
		if(this.image_index > this.sprite.total_frames) this.image_index = 0;
		var image_index_to_draw = this.image_index;
		
		if(this.shooting) {
			this.shoot_countdown();
			sprite_to_draw = this.shooting_sprite;
			this.shooting_image_index += this.shooting_image_speed;
			if(this.shooting_image_index > this.shooting_sprite.total_frames) this.shooting_image_index = 0;
			image_index_to_draw = this.shooting_image_index;			
		}	
		
		if(this.blinking) this.blink_countdown();
		if(this.blink_on) {
			switch(this.blink_style) {
			case BLINK_INVISIBLE:
				ctx.globalAlpha = 0;
			case BLINK_RED:
				sprite_to_draw = this.blinking_sprite;
			}
		}
		
		this.render = function(rotated) {			
			ctx.drawImage(
				sprite_to_draw.image,
				Math.floor(image_index_to_draw) * sprite_to_draw.w,
				0,
				sprite_to_draw.w,
				sprite_to_draw.h,
				rotated ? Math.floor(-(sprite_to_draw.w/2) + Camera.x_displacement + this.x_displacement) : Math.floor(this.x + Camera.x_displacement + this.x_displacement ),
				rotated ? Math.floor(-(sprite_to_draw.h/2) + Camera.y_displacement + this.y_displacement) : Math.floor(this.y + Camera.y_displacement + this.y_displacement ),
				sprite_to_draw.w,
				sprite_to_draw.h);		
		}
		
		if(this.image_rotation != 0) {
			    ctx.save();
				ctx.translate(this.x, this.y); // change origin
				ctx.rotate((this.image_rotation + 180) * (Math.PI/180));
				this.render(true);
				ctx.restore();
    
		} else {
			this.render(false);	
		}	
		
		ctx.globalAlpha = 1;
		
		
		if(lightning_on) ctx.globalCompositeOperation = "source-over";
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Starfield												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */



// Starfield (background)
function Starfield(data) {
	Object.call(this, data);
	
	var startAlpha = this.image_alpha;
	
	this.step = function() {
		this.move();
		if(this.fading_out) {			
			if(this.y > canvas.height * 2) {
				this.destroy();
			}
		} else {
			if(this.y > canvas.height) {
				this.y = 0;
			}		
		}
	}	
	
	// Fade in
	this.fadeIn = function() {	
		if(this.image_alpha < this.max_alpha) {			
			this.image_alpha += (this.max_alpha - startAlpha) / (FRAME_RATE * 4) * delta();	// 4 seconds
		} else {
			this.fading_in = false;
		}
	}	

	this.draw = function() {
	
		ctx.globalAlpha = this.image_alpha;
		if(lightning_on) ctx.globalCompositeOperation = "destination-out";
	
		if(this.fading_in) this.fadeIn();
		/*if(this.fading_out) {
			this.image_alpha -= (this.max_alpha - startAlpha) / (FRAME_RATE * 4) * delta();
			if(this.image_alpha <= 0.0001) this.destroy();
		}	*/
		
		ctx.drawImage(
			this.sprite.image,
			Math.floor(this.x + Camera.x_displacement),
			Math.floor(this.y + Camera.y_displacement)
		);
		// Another one on top to prevent it from looking odd when the stars fly down the screen
		ctx.drawImage(
			this.sprite.image,
			Math.floor(this.x + Camera.x_displacement),
			Math.floor(this.y - canvas.height + Camera.y_displacement)
		);		
		ctx.globalAlpha = 1;
		
		if(lightning_on) ctx.globalCompositeOperation = "source-over";
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Player													 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* The player */
function Player(data) {
	Object.call(this, data);
	
	this.sprite = s_player;
	
	this.shake_intensity = 0;
	this.blink_time_total = FRAME_RATE / 2; // 0.5s of blinking
	this.shooting_sprite = s_player_shooting;
	this.shoot_time_total = FRAME_RATE / 5;

	this.name = data.name || "Michael";	
	
	this.immune = false;
	
	this.depth = -100;
	
	this.special_energy = 100;
	this.max_special_energy = 100;
	this.special_shoot_time_total = FRAME_RATE / 10;	
	this.canRegen = false;
	this.regenDelay = 3000; // 3 seconds
	this.specialEnergyCost = 4;

	data.pingu = "noot noot";
	
	//playerHitbox = new PlayerHitbox();

	this.speed = 1.5;
	this.original_speed = 1.5;

	//this.powerups = []

	this.pickupMessage = null;

	this.timers = [];

	this.powerup = null;
	this.powerupTimer = null;
	this.powerupTotalTime = 0;
	this.powerupTimeRemaining = 0;
	this.powerupBG = null;

	this.specialRegenTimer = null;

	this.health = 100;
	this.affectedByLightning = false;


	this.regenSpecialEnergy = function() {
		if(this.special_energy <= 100 && this.canRegen) {
			if(step_number % (FRAME_RATE / 10) == 0) {
				this.special_energy += 2;
				if(this.special_energy >= 100) {
					this.special_energy = 100;
				}
			}
		}
	}

	this.clearPickupMessage = function() {
		this.pickupMessage = null;
	}

	this.hasPowerup = function(dPowerup) {
		return this.powerup == dPowerup;
	}

	this.restoreHealth = function(healthValue) {
		this.health += healthValue;
		if(this.health > 100) {
			this.health = 100;
		}
		sound_powerup.play();
	}

	this.addPowerup = function(powerup, duration) {
		console.log("You picked up a powerup!");
		switch(powerup) {
			case "quick reflexes": {
				for(var i = 0; i < sounds.length; i++) {
					sounds[i].playbackRate = 0.5;
				}
				this.powerupBG = new PowerupBackground(data = { sprite: s_powerupbg_clocks });
				break;
			}
		}
		this.powerup = powerup;
		this.powerupTotalTime = duration / 1000;
		this.powerupTimeRemaining = duration / 1000;
		sound_powerup.play();
		this.powerupTimer = new Timer(function() { 
			player.tickDownPowerup(powerup);
		}, 500);
		var pickupMessageRemovalTimer = new Timer(function() { 
			player.clearPickupMessage();
		}, 3000);
		this.pickupMessage = "" + powerup.toUpperCase() + " OBTAINED!"
		//this.timers.push(powerupTimer);
	}

	this.tickDownPowerup = function(powerup) {
		this.powerupTimeRemaining -= 0.5;
		if(this.powerupTimeRemaining == 0.5) {
			this.powerupBG.fadingOut = true;
			this.powerupTimer = new Timer(function() { 
				player.removePowerup(powerup);
			}, 500);			
		} else {
			this.powerupTimer = new Timer(function() { 
				player.tickDownPowerup(powerup);
			}, 500);
		}
	}

	this.removePowerup = function(powerup) {
		this.powerupTimeRemaining = 0;
		this.powerupTotalTime = 0;
		this.powerup = null;
		this.powerupBG = null;
		console.log("powerup removed");	
		if(powerup == "quick reflexes") {
			for(var i = 0; i < sounds.length; i++) {
				sounds[i].playbackRate = 1;
			}
		}
	}

	this.checkSpecialBarBlink = function() {
		if(specialbarBlinkCooldown > 0) {
			specialbarBlinkCooldown -= 1;
			if(specialbarBlinkCooldown == 0) {
				specialbarBlink = false;
			}
		}
		if(specialbarBlinkCooldown2 > 0) {
			specialbarBlinkCooldown2 -= 1;
		}
	}
	  
	this.step = function() {
		this.checkMoves();
		this.regenSpecialEnergy();
		this.checkSpecialBarBlink();
		//playerHitbox.moveToPlayer();
	}		
	

	// Start blinking
	this.start_blinking = function() {
		if(!this.immune) {
			this.immune = true;
			this.blinking = true;
			this.blink_timer = this.blink_time_total;	
		}
	}
	
	// Stop blinking
	this.stop_blinking = function() {
		this.blinking = false;
		this.blink_on = false;
		this.blink_timer = 0;	
		this.immune = false;
	}	
	
	this.checkMoves = function() {
	
		if(current_fps > 0) adjusted_speed = this.speed * delta();
		else adjusted_speed = this.speed;
	
		// Check keys
		if (Keyboard.rightKey) this.x += adjusted_speed;
		else if (Keyboard.leftKey) this.x -= adjusted_speed;
		if (Keyboard.upKey) player.y -= adjusted_speed;
		else if (Keyboard.downKey) this.y += adjusted_speed;
		
		// Ensure player does not go over the edge of the window
		if (this.x <= 0) this.x = 0;
		if ((this.x + this.sprite.w) >= canvas.width) this.x = canvas.width - this.sprite.w;
		if (this.y <= 0) this.y = 0;
		if ((this.y + this.sprite.h) >= canvas.height) this.y = canvas.height - this.sprite.h; 



		// Shoot boolet if player is holding down the shoot key
		if (Keyboard.shootKey && !this.shooting && step_number > 5) {			
			this.can_shoot = false;
			this.start_shooting();
			sound_laser.play();
			new BasicBullet(data = { x: this.x + 4, y: this.y, direction: 90 });	
			new BasicBullet(data = { x: this.x + 11, y: this.y, direction: 90 });	

		} else if (Keyboard.specialShootKey && !this.shooting) {
			if(this.special_energy > 0) {
				this.canRegen = false;
				this.can_shoot = false;
				var tempsh = this.shoot_time_total;
				this.shoot_time_total = this.special_shoot_time_total;
				this.start_shooting();
				this.shoot_time_total = tempsh;
				sound_laser.play();			
				this.special_energy -= this.specialEnergyCost;
				new BasicSpecialBullet(data = { x: this.x + 3, y: this.y, direction: 90 });	
				new BasicSpecialBullet(data = { x: this.x + 10, y: this.y, direction: 90 });
				if(this.specialRegenTimer) { this.specialRegenTimer.cancel(); }

				this.specialRegenTimer = new Timer(function() { 
					player.canRegen = true;
					player.specialRegenTimer = null;
				}, this.regenDelay);	
			} else {
				if(specialbarBlinkCooldown2 == 0) {
					specialbarBlink = true;
					specialbarBlinkCooldown  = FRAME_RATE / 10;
					specialbarBlinkCooldown2 = FRAME_RATE / 5;
				}
				//console.log("Not enough energy");
			}
		}
	} 
}

/*function PlayerHitbox() {
	Object.call(this, data);
	this.sprite = s_player_hitbox;
	this.moveToPlayer = function() {
		this.x = player.x + 4;
		this.y = player.y + 4;
	}	
}*/



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Bullets												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function Bullet(data) {
	Object.call(this, data);
	this.speed = data.speed || 4;
	
	bullets.push(this);
	this.affectedByLightning = false;


	this.step = function() {
		this.move();
		if(this.y < -16) {
			this.destroy();
		}	
	}
	
	this.destroy = function() {
		objects_to_delete.push(this);
		bullets_to_delete.push(this);
	}	

}

function BasicBullet(data) {		
	Bullet.call(this, data);
	this.speed = data.speed || 5;
	this.damage = 5;
	//bullets.push(this);
	this.sprite = s_bullet;	
	this.affectedByQuickReflexes = false;
}

function BasicSpecialBullet(data) {		
	Bullet.call(this, data);
	this.speed = data.speed || 8;
	this.damage = 5;
	//bullets.push(this);
	this.sprite = s_bullet_special;	
	this.affectedByQuickReflexes = false;
}

// Enemy bullets

function EnemyBullet(data) {		
	Object.call(this, data);
	this.speed = data.speed || 2;
	this.damage = data.damage || 10;
	enemyBullets.push(this);
	this.sprite = data.sprite || s_bullet_alien;



	this.checkCollision = function() {

		this.collideWithPlayer = function() {
			if(!player.immune) {
				player.start_blinking();
				sound_player_damaged.play();
				player.health -= this.damage;
				Camera.shakeBriefly();
			}
		}
			
		var collisionObj = null;
		
		/*this.checkCollisionWithObj = function(obj) {
			if(this.x >= obj.x && this.x <= (obj.x + obj.sprite.w)) {
				if(this.y >= obj.y && this.y <= (obj.y + obj.sprite.h)) {	
					return obj;	
				}
				if(this.y <= obj.y && (this.y + this.sprite.h) >= (obj.y)) {	
					return obj;
				}
			}
			if(this.x <= obj.x && (this.x + this.sprite.w) >= (obj.x)) {
				if(this.y >= obj.y && this.y <= (obj.y + obj.sprite.h)) {		
					return obj;	
				}
				if(this.y <= obj.y && (this.y + this.sprite.h) >= (obj.y)) {	
					return obj;
				}			
			}
		}*/		
		
		// Check for collision with the player
		collisionObj = this.checkCollisionWithObj(player);
		if(collisionObj == player) {
			this.collideWithPlayer();		
			this.destroy();	
		}
	}
	this.step = function() {
		this.checkCollision();
		this.move();
		if(this.y < -16) {
			this.destroy();
		}
		if(this.y > canvas.height) {
			this.destroy();
		}	
	}

	this.destroy = function() {
		objects_to_delete.push(this);
		enemyBullets_to_delete.push(this);
	}

}

function EnemyTrackingBullet(data) {
	this.accuracy = data.accuracy || 100;
	EnemyBullet.call(this, data);


	this.trackPlayer = function() {
		var d = (Math.atan2(player.y - this.y, player.x - this.x) * (180/Math.PI));
		accModifier = this.accuracy;

		accModifier = 15 * 1 - (random(1, 100/this.accuracy))
		this.direction = -d + random(-accModifier, accModifier);
	}

	this.trackPlayer();
}

function EnemyUFOBullet(data) {
	EnemyTrackingBullet.call(this, data);
	this.speed = data.speed || 2;
	this.damage = 10;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Particles												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function BulletParticle(data) {
	Object.call(this, data);
	this.speed = random(0.5, 1.5);
	this.direction =  random(0, 360);
	this.sprite = data.sprite || s_bullet_particle;
	this.depth = -1;	
	this.image_index = Math.floor(random(0, this.sprite.total_frames));
	this.affectedByLightning = false;

	this.step = function() {
		this.move();
		this.speed *= 0.95;	
		this.fadeOut();
	}
}

function BulletParticleCircle(data) {
	BulletParticle.call(this, data);
	this.speed = data.speed || 0.8 + random(0, 0.2);
	this.sprite = data.sprite || s_bullet_particle_white;
	this.image_index = 0;
}

function HealthParticle(data) {
	BulletParticle.call(this, data);
	this.speed = data.speed || 0.3 + random(0, 0.3);
	this.sprite = data.sprite || s_health_particle;
	this.image_index = random(0, this.sprite.total_frames);
}


function ParticleEnemyBits(data) {
	BulletParticle.call(this, data);
	variance = data.variance || 0.4;
	this.speed = data.speed + random(0, variance) || 0.7 + random(0, variance);
	this.depth = -2;
	this.image_rotation = this.direction;
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Enemies												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* An enemy */
function Enemy(data) {
	Object.call(this, data);
	this.direction = 270;
	this.bits_sprite = data.bits_sprite || MISSING_SPRITE;
	this.bits_count = data.bit_count || 5;
	this.bits_speed = 0.7;
	this.bits_variance = 0.4;
	this.health = 100;
	this.blink_style = BLINK_RED;
	this.blinking_sprite = MISSING_SPRITE;
	this.score_value = 5;
	this.death_sound = data.death_sound || sound_alien_dead;
	this.damage = 1;

	// Shooting
	this.shootCooldown = FRAME_RATE;
	this.shootCooldownMax = FRAME_RATE;
	this.randomShootChance = 1/20;
	this.canShoot = true;
	this.shootingSound = sound_enemy_laser;
	this.accuracy = 100;

	this.immune = false;
	
	this.step = function() {
		this.checkCollision();
		this.checkDie();
	}
	
	this.checkDie = function() {
		if(this.health <= 0) {
			this.die();
		}
	}
	
	this.shootPlayer = function() {
		if(this.canShoot == true && this.y > 0 && this.y < player.y) {
			r = random(0, 1);
			if(r < this.randomShootChance) {
				this.shootingSound.play();
				this.start_shooting();
				var bullet = new EnemyUFOBullet(data = {x: this.x + 6, y: this.y + 12, accuracy: this.accuracy});
				this.shooting = true;
				this.shootCooldown = this.shootCooldownMax;
				if(player.hasPowerup("quick reflexes")) {
					this.shootCooldown = this.shootCooldownMax * 3;
				}
				this.canShoot = false;
			}
		} else {
			this.shootCooldown -= 1;
			if(this.shootCooldown == 0) {
				this.canShoot = true;
			}
		}		
	}

	this.die = function(scoreless = false) {		
		for(var i = 0; i < 12; i++) {
			new BulletParticleCircle(data = {x: this.x + this.sprite.w/2, y: this.y + this.sprite.h/2});					
		}
		for(var i = 0; i < this.bits_count; i++) {
			new ParticleEnemyBits(data = {x: this.x + this.sprite.w/2, y: this.y + this.sprite.h/2, sprite: this.bits_sprite, total_frames: this.bits_total_frames, speed: this.bits_speed, variance: this.bits_variance});
		}
		this.death_sound.play();
		if(!scoreless) {
			if(this.score_value > 0) new ScorePopUp(data = {x: this.x + this.sprite.w/2, y: this.y + this.sprite.h/2, score_value: this.score_value});
		}
		this.destroy();		
	}
	
	this.collideWithBullet = function(collisionObj) {			
		this.health -= collisionObj.damage;
		this.start_blinking();			
		
		for(var i = 0; i < 4; i++) {
			new BulletParticle(data = {x: this.x + this.sprite.w/2, y: this.y + this.sprite.h/2});					
		}
		if(collisionObj instanceof BasicSpecialBullet) {
			for(var i = 0; i < 4; i++) {
				new BulletParticleCircle(data = {x: this.x + this.sprite.w/2, y: this.y + this.sprite.h/2, sprite: s_bullet_particle_blue});					
			}				
		}		
		
		collisionObj.destroy();
	}

	this.collideWithDecoObject = function(collisionObj) {			
		this.health -= collisionObj.damage;
		this.start_blinking();			
		
		collisionObj.die();
	}
	
	this.collideWithPlayer = function() {
		if(!player.immune) {
			player.start_blinking();
			sound_player_damaged.play();
			player.health -= this.damage;
			Camera.shakeBriefly();
		}
	}	
	
	
	this.checkCollision = function() {
		
		var collisionObj = null;
		
		if(!this.immune) {
			// Check for collisions with bullets
			for(var i = 0, ii = bullets.length; i < ii; i++) {
				collisionObj = this.checkCollisionWithObj(bullets[i]);			
				if(collisionObj != undefined) {				
					this.collideWithBullet(collisionObj);			
				}
			}		

			// Check for collisions with deco objects (rocks, for example)
			if(this.y > 0) {	// Ensure this object is past the start of the screen
				for(var i = 0, ii = decoObjects.length; i < ii; i++) {
					collisionObj = this.checkCollisionWithObj(decoObjects[i]);			
					if(collisionObj != undefined && collisionObj != this) {		
						this.collideWithDecoObject(collisionObj);	
					}
				}
			}
		}
		// Check for collision with the player
		collisionObj = this.checkCollisionWithObj(player);
		if(collisionObj == player) {
			this.collideWithPlayer();			
		}
	}
}


// The most basic enemy. The green guys on purple ships that move downwards and don't do anything other than that.
function EnemyBasic(data) {
	Enemy.call(this, data);
	this.health = 25;	
	this.speed = 0.75;	
	this.image_speed = 0.1;
	this.sprite = s_enemy_1;
	this.bits_sprite = s_enemy_1_bits;
	this.blinking_sprite = s_enemy_1_red;
	this.bits_count = 5;
	this.damage = 10;
	
	this.score_value = 5;
	
	this.step = function() {
		this.checkDie();
		this.checkCollision();		
		this.move();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
}

// The green UFO guy.
function EnemyUFO(data) {
	Enemy.call(this, data);
	this.health = 25;	
	this.speed = 1;	
	this.image_speed = 0;
	this.sprite = s_enemy_2;
	this.bits_sprite =  s_enemy_2_bits;
	this.blinking_sprite = s_enemy_2_red;
	this.bits_count = 5;
	this.damage = 10;
	this.lifetime = 0; // for movement stuff
	this.score_value = 10;
	
	// UFO stuff
	
	this.move_timer = 0;
	this.move_frequency = FRAME_RATE * 2;
	
	this.moveUFO = function(persistent = false) {
	
		this.change_direction = function(options) {
			var new_direction = options[Math.floor(Math.random() * options.length)];
			this.direction = new_direction;	
		}
	
		this.move_timer += delta();
		this.lifetime += delta();
		if(this.move_timer > this.move_frequency) {
			this.move_timer = 0;
			this.change_direction([0, 45, 90, 135, 180, 225, 270, 315]);
			if(this.lifetime > FRAME_RATE * 10) {
				this.direction = 270; // Fly away.
			}
		}
		
		if(this.x < 16) 									{ this.change_direction([0, 45, 315]); 		this.move_timer = 0; }
		if(this.x > canvas.width - 16)						{ this.change_direction([135, 180, 225]);   this.move_timer = 0; }
		if(this.y < 16 && this.lifetime > FRAME_RATE * 2)	{ this.change_direction([225, 270, 315]);   this.move_timer = 0; }
		if(persistent) {
			if(this.y > canvas.height / 2) {
				this.change_direction([45, 90, 135]);
			}
		} else {
			if(this.y > canvas.height + 32) { this.destroy(); }
		}
	
	}
	
	this.step = function() {
		this.checkDie();
		this.checkCollision();		
		this.moveUFO();
		this.move();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
}

// The gold UFO guy, who shoots.
function EnemyGoldUFO(data) {
	EnemyUFO.call(this, data);
	this.health = 50;	
	this.speed = 1.5;	
	this.image_speed = 0;
	this.sprite = s_enemy_2_gold;
	this.bits_sprite =  s_enemy_2_gold_bits;
	this.blinking_sprite = s_enemy_2_gold_red;
	this.shooting_sprite = s_enemy_2_gold_shooting;
	this.bits_count = 7;
	this.damage = 10;
	this.score_value = 20;
	this.accuracy = 75;
	
	// UFO stuff
	
	this.move_timer = 0;
	this.move_frequency = FRAME_RATE * 2;
	
	this.step = function() {
		this.checkDie();
		this.checkCollision();		
		this.moveUFO(persistent = true);
		this.move();
		this.shootPlayer();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
}

// A ghost
function EnemyGhost(data) {
	Enemy.call(this, data);
	this.health = 50;	
	this.speed = 0.75;	
	this.image_speed = 0.03;
	this.sprite = s_enemy_3;
	this.bits_sprite =  s_enemy_3_bits;
	this.blinking_sprite = s_enemy_3_red;
	this.bits_count = 7;
	this.damage = 10;
	this.score_value = 12;
	this.affectedByLightning = false;
	this.lifetime = 0;
	this.xstart = this.x;
	this.swing_amount = data.swing_amount || 40;
	
	this.checkLightning = function() {
		if(lightning_on) {
			this.sprite = s_ghost_eyes;
		} else {
			this.sprite = s_enemy_3;
		}
	}

	this.step = function() {
		this.checkLightning();
		this.checkDie();
		this.checkCollision();	
		this.moveGhost();
		this.move();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
	
	this.moveGhost = function() {

		this.canMove = function() {
			this.lifetime += delta();
			rads = this.lifetime * (Math.PI/180);
			this.x = Math.floor(this.xstart + (this.swing_amount * Math.sin(rads * 0.8)));
		}
		if(player.hasPowerup("quick reflexes")) {
			if(step_number % FRAME_RATE < FRAME_RATE / 3) {
				this.canMove();
			}
		} else {
			this.canMove();
		}
	
	}
}

// A scary ghost
function EnemyPinkGhost(data) {
	EnemyGhost.call(this, data);
	this.sprite 		 = s_enemy_4;
	this.bits_sprite 	 = s_enemy_4_bits;
	this.blinking_sprite = s_enemy_4_red;
	
	this.speed = 0.5;
	this.health = 25;
	this.damage = 20;
	this.score_value = 15;
	
	// Enrage/morph
	var morphing = false;
	var enraged = false;
	
	this.morph = function() {
		this.sprite = s_enemy_4_morph;
		morphing = true;
	}	
	
	this.checkMorph = function() {
		this.y -= delta();
		if(this.image_index >= this.sprite.total_frames - 0.5) {
			morphing = false;
			enraged = true;
			this.sprite = s_enemy_4_er;
			this.speed = 5;
			this.bits_sprite = s_enemy_4_er_bits;
			this.shake_intensity = 4;
		}
	}
	
	this.checkEnrage = function() {
		var x1 = this.x; var x2 = this.x + this.sprite.w;
		if(player.x >= x1 && player.x <= x2 && this.y < player.y && this.y > 0) {
			this.morph();
			this.image_speed = 0.4;
		}		
	}
	
	this.shake = function() {
		this.x_displacement = random(-this.shake_intensity, this.shake_intensity);
		this.y_displacement = random(-this.shake_intensity, this.shake_intensity);		
	}
	
	this.step = function() {
		this.checkDie();
		this.checkCollision();					
		if(morphing) {
			this.checkMorph();
		} else {
			if(!(enraged)) {
				this.checkEnrage();
				this.moveGhost();
			} else {
				this.shake();
			}
		}
		this.move();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
}


// The most basic enemy. The green guys on purple ships that move downwards and don't do anything other than that.
function EnemyBossGhost(data) {
	Enemy.call(this, data);
	this.health = 1;
	this.speed = 0.75;	
	this.image_speed = 0.1;
	this.sprite = s_enemy_boss_ghost;
	this.bits_sprite = s_enemy_ghost_boss_bits;
	this.blinking_sprite = s_enemy_boss_ghost_red;
	this.bits_count = 15;
	this.damage = 10;
	this.affectedByLightning = false;
	this.introduced = false;
	SpawnHandler.rockConstant = 0;
	this.score_value = 500;
	this.affectedByQuickReflexes = false;

	this.xstart = this.x;
	this.ystart = this.y;
	this.lifetime = 0;
	
	this.actionTimer = 0;
	this.actionTimerMax = 0;
	this.accuracy = 80;
	this.swing_amount = data.swing_amount || 80;
	hand = 1;

	this.hasTimers = true;
	this.timers = [];
	timerObjects.push(this);

	this.bossAction = "introduction";

	this.rage = 0; // The amount of rage the boss has. The higher this number, the scarier he is.

	this.maxHealth = 1000;	
	bossObject = this;
	this.bossBarAlpha = 0;

	this.immune = true;

	this.bossActions = {
		"introduction": {
			"duration": 5,
			"initialAction": function() {
				this.speed = 0.75;
			},
			"ongoingAction": function() {				
				if(this.y >= 40) {
					this.speed = 0;
					this.bossBarAlpha += 0.02;
					if(this.health <= this.maxHealth) {
						this.health += 10;
					}

				}
			},
			"nextAction": "roaring"
		},
		"roaring": {
			"duration": 6,
			"initialAction": function() {
				this.immune = false;
				// Destroy UFOs on the initial roar
				destroyUFOs = function() {
					for(var i = 0; i < objects.length; i++) {
						if(objects[i] instanceof EnemyGoldUFO) {
							objects[i].affectedByLightning = false;
							objects[i].die(scoreless = true);
						}
					}
				}

				spawnGhosts = function(numberOfWaves) {					
					var spawnData = [];
			
					for(var w = 0; w < numberOfWaves; w++) {
						for(var x = 0; x <= 20; x += 2) {
							var enemy = {"id": 2, "x": x,"y": random(-1, -3) - (w * 1/numberOfWaves * 15)};
							var r = random(0, 1);
							if(r >= 0.6) {
								spawnData.push(enemy);
							}
						}
					}
					SpawnHandler.spawnGroup(spawnData);
				}

				var numberOfWaves = Math.min(15, Math.floor(7 + this.rage/2));

				spawnGhosts(numberOfWaves);
				if(this.rage == 2) {
					destroyUFOs();
				}

				this.speed = 0;
				sound_ghost_boss.play();
				this.introduced = true;
				Camera.shakeBriefly(intensity = 7);
				lightning_on = true;
			},
			"ongoingAction": function() {
				// Speeds up ghosts to make them more scary over time
				this.influenceGhosts = function() {					
					for(var i = 0; i < objects.length; i++) {
						if(objects[i] instanceof EnemyGhost) {
							objects[i].speed *= 1.0 + random(0, 0.008 + this.rage/2000);
							if(objects[i].health > 30) {
								objects[i].health = 30;
							}
							//if(objects[i].swing_amount == 40) {
							//	objects[i].swing_amount = random(20, 60);
							//}
						}
					}					
				}				
				this.influenceGhosts();

			},
			"nextAction": "shooting"
		},
		"shooting": {
			"duration": 9,
			"initialAction": function() {
				lightning_on = false;
				this.ystart = 40;				
				this.lifetime = 0;
			},
			"ongoingAction": function() {
				this.moveGhost = function() {
					this.lifetime += delta();
					rads = this.lifetime * (Math.PI/180);
					this.x = Math.floor(this.xstart + (this.swing_amount * Math.sin(rads * 2)));
					this.y = Math.floor(this.ystart + (this.swing_amount / 4 * Math.sin(rads * 1.25)));	
				}

				this.shootPlayer = function() {
					// Will shoot faster when angrier
					var delay = Math.max(5, Math.floor(8 - this.rage / 5));

					if(step_number % delay == 0) {
						hand = -hand;						
						var bullet = new EnemyUFOBullet(data = {sprite: s_bullet_ghostboss, x: this.x + 32 + (20 * hand), y: this.y + 44, accuracy: this.accuracy});
					}
				}
				this.moveGhost();
				this.shootPlayer();
			},
			"nextAction": "charging"
		},
		"charging": {
			"duration": 2,
			"initialAction": function() {
				var d = (Math.atan2(player.y - this.y, player.x - this.x) * (180/Math.PI));
				this.direction = -d;
				this.speed = 6;
				sound_ghost_boss_shoot.play();
			},
			"ongoingAction": null,
			"nextAction": "fading in"
		},
		"fading in": {
			"duration": 3,
			"initialAction": function() {
				this.x = this.xstart;
				this.y = this.ystart;
				this.speed = 0;
				this.image_alpha = 0;
			},
			"ongoingAction": function() {
				this.image_alpha += 0.01;
			},
			"nextAction": "roaring"
		}
	}




	this.checkLightning = function() {
		if(lightning_on) {
			this.sprite = s_ghost_boss_eyes;
		} else {
			this.sprite = s_enemy_boss_ghost;
		}
	}



	// Roaring -> shooting -> charging -> fading in -> shooting -> etc

	// Changes the boss's action to a set action and creates a timer for the next action.
	this.changeAction = function(action) {
		this.rage += 1;

		this.bossAction = action;

		//var nextAction = null;
		//var nextActionDuration = 0; // In seconds

		var bossAction 		= this.bossActions[action];

		
		var initialAction 			= bossAction.initialAction;
		var nextAction 				= bossAction.nextAction;
		var nextActionDuration 		= bossAction.duration;

		// Run the code held within the initialAction object.
		if(initialAction) {
			initialAction.call(this);
		}

		var _this = this;
		var newBossActionTimer = new Timer(function() {
			_this.changeAction(nextAction);
			_this.timers.splice(_this.timers.indexOf(newBossActionTimer), 1);
		}, nextActionDuration * 1000);

		this.timers.push(newBossActionTimer);	
	}

	

	// Checks for continuous actions to perform whilst in a bossAction state.
	this.checkBossAction = function() {
		// Events whilst boss action is active
		var action = this.bossActions[this.bossAction]["ongoingAction"]
		if(action) {
			action.call(this);
		}
	}

	this.destroy = function() {
		objects_to_delete.push(this);
		bossObject = null;
		for(var i = 0; i < this.timers.length; i++) {
			this.timers[i].cancel();
		}		
		lightning_on = false;
		// Game end
	}

	this.step = function() {
		this.checkBossAction();
		this.checkLightning();
		this.checkDie();
		this.checkCollision();		
		this.move();
	}

	this.changeAction("introduction");
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  Miscellaneous												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Draws a score to the screen
function ScorePopUp(data) {
	Object.call(this, data);
	this.score_value = data.score_value || 0;
	
	scorePopUps.push(this);
	this.score_value = GameInfo.addToCombo(this.score_value);
	
	this.step = function() {
		this.y -= 0.3;
		this.speed *= 0.95;	
		this.fadeOut();
	}
	
	this.destroy = function() {
		objects_to_delete.push(this);
		scorePopUps_to_delete.push(this);
	}	
	
	this.draw = function() {
		ctx_overlay.globalAlpha = this.processImageAlpha();
		ctx_overlay.textAlign = 'center';
		ctx_overlay.textBaseline = 'middle';
		ctx_overlay.font = 35 + this.score_value + "px fixedsys";
		ctx_overlay.fillText(this.score_value * 10, this.x * 4, this.y * 4);	
		ctx_overlay.font="40px fixedsys";	
		ctx_overlay.textAlign = 'left';	
		ctx_overlay.textBaseline = 'alphabetic';
		ctx_overlay.globalAlpha = 1;
	}
	
}

/* A hologram - an object that can't be interacted with, and fades away.
   Used during the Quick Reflexes powerup. */
function Hologram(data) {
	Object.call(this, data);
	this.image_alpha = 0.15;
	this.fadeOutSpeed = 0.001;
	this.startFadingOut();
	this.doNotProcessAlpha = true;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											Decorative Objects											 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/* A decorative object, like a rock */
function DecoObject(data) {
	Enemy.call(this, data);
	this.direction = 260 + random(0, 20);
	this.bits_sprite = data.bits_sprite || MISSING_SPRITE;
	this.bits_count = data.bit_count || 5;
	this.health = 1;
	//this.blink_style = BLINK_RED;
	//this.blinking_sprite.src = MISSING_SPRITE;
	this.score_value = 0;
	this.death_sound = data.death_sound || sound_rock_dead;
	this.blink_time_total = 0;
	this.damage = 5;
	decoObjects.push(this);

	this.destroy = function() {
		objects_to_delete.push(this);
		decoObjects_to_delete.push(this);
	}	

	this.step = function() {
		this.checkCollision();	
		this.checkDie();	
		this.move();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
	
	this.collideWithPlayer = function() {
		if(!player.immune) {		
			player.start_blinking();
			sound_player_damaged.play();
			player.health -= this.damage;
			Camera.shakeBriefly();
		}
		this.die();
	}
}

function DecoObjectRock1(data) {
	DecoObject.call(this, data);
	this.sprite = s_rock_1;
	this.bits_sprite = s_rock_1_bits
	this.speed = data.speed + random(data.speed, data.speed * 1.2) || 3 + random(0, 0.5);
	this.bits_speed = this.speed * 0.5;
	this.bits_variance = this.speed * 0.2;
	this.bits_count = 7;
	this.damage = 10;
}

function DecoObjectRock2(data) {
	DecoObject.call(this, data);
	this.sprite = s_rock_2;
	this.bits_sprite = s_rock_2_bits;
	this.bits_count = 10;
	this.speed = data.speed + random(data.speed, data.speed * 1.2) || 4 + random(0, 0.5);
	this.image_speed = this.speed/25;
	this.bits_speed = this.speed * 0.2;
	this.bits_variance = this.speed * 0.6;	
	this.damage = 20;
}




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*												Pickup Objects											 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/* A decorative object, like a rock */
function PickupObject(data) {
	Object.call(this, data);
	this.direction = 270;
	this.speed = data.speed || 0.6;
	this.affectedByLightning = false;

	//this.death_sound = data.death_sound || sound_alien_dead;

	this.die = function() {		
		for(var i = 0; i < 24; i++) {
			new BulletParticleCircle(data = {x: player.x + player.sprite.w/2, y: player.y + player.sprite.h/2, speed: 1.8});					
		}
		this.destroy();		
	}

	this.checkCollision = function() {
		
		var collisionObj = null;
		
		// Check for collision with the player
		collisionObj = this.checkCollisionWithObj(player);
		if(collisionObj == player) {
			this.collideWithPlayer();			
		}
	}

	this.step = function() {
		this.checkCollision();	
		this.move();
		if(this.y > canvas.height) {
			this.destroy();
		}
	}
}

function PickupHealthObject(data) {
	PickupObject.call(this, data);
	this.sprite = s_pickup_health_1;
	this.healthValue = data.healthValue || 20;	

	this.die = function() {		
		for(var i = 0; i < this.healthValue; i++) {
			new HealthParticle(data = {x: player.x + player.sprite.w/2, y: player.y + player.sprite.h/2});					
		}
		this.destroy();		
	}


	this.collideWithPlayer = function() {
		if(player.health < 100) {
			player.restoreHealth(this.healthValue);		
			this.die();
		}
	}
}

function Pickup20HealthObject(data) {
	PickupHealthObject.call(this, data);
	this.healthValue = 20;
}

function PowerupObject(data) {
	PickupObject.call(this, data);
	this.sprite = s_crate;
	this.powerup = data.powerup || "none";
	this.powerupDuration = data.powerupDuration || 15 * 1000; // 15 Seconds

	this.collideWithPlayer = function() {
		player.addPowerup(this.powerup, this.powerupDuration);		
		this.die();
	}

}

function PowerupSpeed(data) {
	PowerupObject.call(this, data);
	this.powerup = "quick reflexes";
	this.sprite = s_powerup_speed;
	this.image_speed = 0.05;
}






/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											 Weather Objects											 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* Prototype at the moment. Needs more work */
function LightningObject(data) {
	Object.call(this, data);
	var intensity = data.intensity || 5;
	this.depth = 10000;
	this.image_alpha = 0;
	this.blend_mode = "lighter";
	
	
	var on_time_base = 10;
	
	var light_counter = on_time_base;
	this.on = false;
	
	// Change based on level in future
	this.sprite = s_nebula_1_lightning;
	
	this.lightUp = function() {
		this.image_alpha = random(0.04, 0.07);
		lightning_on = false;
		this.on = true;
		Nebula.image_alpha = random(0.2, 0.3);
	}
	
	this.step = function() {
		var r = random(0, FRAME_RATE * 3);
		if(r < intensity)	{ this.lightUp(); }
		
		if(this.on) {
			light_counter -= delta();
			if(light_counter <= 0) {
				this.on = false;
				lightning_on = true;
				this.image_alpha = 0;
				light_counter = on_time_base + random(0, 3);
				Nebula.image_alpha = 0.05;

			}
		}
		
		//else				{ this.image_alpha = 0; lightning_on = true; }
	}
}