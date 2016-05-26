/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Sprites												 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


function Sprite(src, w, h, total_frames, hitboxSize = []) {
	this.image = new Image();
	this.image.src = src;
	this.total_frames = total_frames;
	this.w = w || 16;
	this.h = h || 16;

	// Generic hitbox, for colliding with everything except the player
	// x1, y1, x2, y2
	if(hitboxSize.length == 0) {
		
		this.hitbox = [0, 0, w, h];
	} else {
		var x1 = (w - hitboxSize[0]) / 2;
		var y1 = (h - hitboxSize[1]) / 2;
		var x2 = w - x1; 
		var y2 = h - y1;
		//console.log(x1, y1, x2, y2);
		this.hitbox = [x1, y1, x2, y2];
	}
}


MISSING_SPRITE 			= new Sprite("images/sprites/missing.png", 16, 16, 1);
s_player 				= new Sprite("images/sprites/player.png", 16, 16, 1, hitboxSize = [8, 8]);	
s_player_menu			= new Sprite("images/sprites/player_menu.png", 16, 16, 1);	
s_player_shooting 		= new Sprite("images/sprites/player_shooting.png", 16, 16, 3);
s_player_hitbox 		= new Sprite("images/sprites/player_hitbox.png", 8, 8, 1);

// Bullets
s_bullet 				= new Sprite("images/sprites/bullets/boolet.png", 1, 8, 1);
s_bullet_special		= new Sprite("images/sprites/bullets/boolet_special.png", 3, 8, 1);

s_bullet_alien			= new Sprite("images/sprites/bullets/alien_bullet.png", 4, 4, 1);
s_bullet_ghostboss		= new Sprite("images/sprites/bullets/ghostboss_bullet.png", 4, 4, 1);


s_bullet_particle		= new Sprite("images/sprites/bullets/bullet_particle.png", 1, 1, 3);
s_bullet_particle_blue	= new Sprite("images/sprites/bullets/bullet_particle_blue.png", 1, 1, 1);
s_bullet_particle_white	= new Sprite("images/sprites/bullets/bullet_particle_white.png", 1, 1, 1);

s_health_particle		= new Sprite("images/sprites/pixel_health.png", 4, 4, 3);


// Enemies
s_enemy_1 				= new Sprite("images/sprites/enemy_1.png", 16, 16, 2);
s_enemy_1_red 			= new Sprite("images/sprites/enemy_1_red.png", 16, 16, 2);
s_enemy_2 				= new Sprite("images/sprites/enemy_2.png", 16, 16, 1);
s_enemy_2_red 			= new Sprite("images/sprites/enemy_2_red.png", 16, 16, 1);
s_enemy_3	 			= new Sprite("images/sprites/enemy_3.png", 20, 20, 2, hitboxSize = [16, 16]);
s_enemy_3_red 			= new Sprite("images/sprites/enemy_3_red.png", 20, 20, 2, hitboxSize = [16, 16]);
s_enemy_4	 			= new Sprite("images/sprites/enemy_4.png", 20, 20, 2);
s_enemy_4_red 			= new Sprite("images/sprites/enemy_4_red.png", 20, 20, 2);
s_enemy_4_er 			= new Sprite("images/sprites/enemy_4_enraged.png", 20, 20, 1);
s_enemy_4_morph			= new Sprite("images/sprites/enemy_4_morph.png", 20, 20, 8);
s_enemy_2_gold 			= new Sprite("images/sprites/enemy_2_gold.png", 16, 16, 1);
s_enemy_2_gold_shooting	= new Sprite("images/sprites/enemy_2_gold_shooting.png", 16, 16, 1);
s_enemy_2_gold_red 		= new Sprite("images/sprites/enemy_2_gold_red.png", 16, 16, 1);
s_enemy_6 				= new Sprite("images/sprites/enemy_6.png", 20, 20, 2);
s_enemy_6_red 			= new Sprite("images/sprites/enemy_6_red.png", 20, 20, 1);
s_enemy_6_shooting		= new Sprite("images/sprites/enemy_6_shooting.png", 20, 20, 2);

s_enemy_boss_ghost		= new Sprite("images/sprites/black_ghost_2.png", 64, 64, 1, hitboxSize = [48, 64]);
s_enemy_boss_ghost_red	= new Sprite("images/sprites/black_ghost_2_red.png", 64, 64, 1, hitboxSize = [48, 64]);

s_ghost_eyes 			= new Sprite("images/sprites/ghost_eyes.png", 16, 16, 1, hitboxSize = [6, 6]);
s_ghost_boss_eyes 		= new Sprite("images/sprites/black_ghost_eyes.png", 64, 64, 1, hitboxSize = [48, 64]);

// Enemy bits
s_enemy_1_bits			= new Sprite("images/sprites/bits/bits_blob.png", 16, 16, 7);
s_enemy_2_bits			= new Sprite("images/sprites/bits/bits_ufo.png", 16, 16, 3);
s_enemy_3_bits			= new Sprite("images/sprites/bits/bits_ghost.png", 16, 16, 5);
s_enemy_4_bits			= new Sprite("images/sprites/bits/bits_ghost_pink.png", 16, 16, 5);
s_enemy_4_er_bits		= new Sprite("images/sprites/bits/bits_ghost_red.png", 16, 16, 5);
s_enemy_2_gold_bits		= new Sprite("images/sprites/bits/bits_ufo_gold.png", 16, 16, 8);
s_enemy_ghost_boss_bits	= new Sprite("images/sprites/bits/bits_ghost_boss.png", 16, 16, 5);



// Deco
s_rock_1 				= new Sprite("images/sprites/rock_1.png", 16, 16, 1);
s_rock_2				= new Sprite("images/sprites/rock_2.png", 32, 32, 16, hitboxSize = [28, 28]);

// Rock bits
s_rock_1_bits			= new Sprite("images/sprites/bits/bits_rock.png", 8, 8, 2);
s_rock_2_bits			= new Sprite("images/sprites/bits/bits_rock_large.png", 16, 16, 2);

// Pickups

s_crate					= new Sprite("images/sprites/crate.png", 16, 16, 1);	
s_crate_bits			= new Sprite("images/sprites/crate.png", 16, 16, 1);	

s_powerup_speed			= new Sprite("images/sprites/powerup_speed.png", 16, 16, 2);	


s_pickup_health_1		= new Sprite("images/sprites/pickup_health.png", 16, 16, 2);	

// Starfields

s_starfield_1			= new Sprite("images/backgrounds/starfield_1.png", 320, 240, 1);
s_starfield_2			= new Sprite("images/backgrounds/starfield_2.png", 320, 240, 1);
s_starfield_3			= new Sprite("images/backgrounds/starfield_3.png", 320, 240, 1);

s_asteroids_5_dark		= new Sprite("images/backgrounds/asteroids_5_dark.png", 320, 240, 1);
s_asteroids_4			= new Sprite("images/backgrounds/asteroids_4.png", 320, 240, 1);
s_asteroids_3			= new Sprite("images/backgrounds/asteroids_3.png", 320, 240, 1);
s_asteroids_2			= new Sprite("images/backgrounds/asteroids_2.png", 320, 240, 1);
s_asteroids_1			= new Sprite("images/backgrounds/asteroids_1.png", 320, 240, 1);

// Nebulae

s_nebula_menu			= new Sprite("images/backgrounds/nebulas/red_spider_nebula.png", 320, 240, 1)
s_nebula_1 				= new Sprite("images/backgrounds/nebulas/little_ghost_nebula.png", 320, 240, 1)
s_nebula_1_lightning	= new Sprite("images/backgrounds/nebulas/lightning/little_ghost_nebula.png", 320, 240, 1)

// Bars

s_healthbar_full 		= new Sprite("images/sprites/overlay/health_bar_full.png", 64, 16, 1);
s_healthbar_half 		= new Sprite("images/sprites/overlay/health_bar_half.png", 64, 16, 1);
s_healthbar_dying 		= new Sprite("images/sprites/overlay/health_bar_dying.png", 64, 16, 1);
s_bar_empty 			= new Sprite("images/sprites/overlay/bar_empty.png", 64, 16, 1);
s_bar_overlay 			= new Sprite("images/sprites/overlay/bar_overlay.png", 64, 16, 1);
s_bar_overlay_white		= new Sprite("images/sprites/overlay/bar_overlay_white.png", 64, 16, 1);
s_special_bar 			= new Sprite("images/sprites/overlay/special_bar.png", 64, 16, 1);
s_powerup_bar 			= new Sprite("images/sprites/overlay/purple_bar.png", 64, 16, 1);


s_healthbar_boss 		= new Sprite("images/sprites/overlay/healthbar_boss_full.png", 256, 16, 1);
s_healthbar_boss_empty	= new Sprite("images/sprites/overlay/healthbar_boss_background.png", 256, 16, 1);
s_healthbar_boss_ov		= new Sprite("images/sprites/overlay/healthbar_boss_overlay.png", 256, 16, 1);


// Powerup backgrounds

s_powerupbg_clocks		= new Sprite("images/backgrounds/powerups/clocks.png", 320, 240, 1)


