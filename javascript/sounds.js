/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*											  	 Sounds													 */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var sounds = []

Sounds = {
	load: function() {
		function Sound(sound_source) {
			this.playbackRate = 1;
			if(typeof sound_source === 'string') {
				this.sound_source = [sound_source];
			} else {
				this.sound_source = sound_source;
			}
			this.play = function() {
				var a = new Audio(this.sound_source[Math.floor(random(0, this.sound_source.length))]);
				a.playbackRate = this.playbackRate;
				a.play();
			}
		}

		audio = new Audio('music/david_bowie-space_oddity.mp3');

		

		/* Sounds */
		sound_laser = new Sound(['sounds/laser_1.wav', 'sounds/laser_2.wav', 'sounds/laser_3.wav']);
		sound_enemy_laser = new Sound('sounds/enemy_laser.wav');
		sound_alien_dead = new Sound('sounds/alien_dead.wav');
		sound_rock_dead = new Sound('sounds/rock_dead.wav');
		sound_player_damaged = new Sound('sounds/player_damaged.mp3');
		sound_powerup = new Sound('sounds/powerup.wav');
		sound_ghost_boss = new Sound('sounds/ghost_boss.wav');
		sound_ghost_boss = new Sound('sounds/ghost_boss.wav');
		sound_ghost_boss_shoot = new Sound('sounds/ghost_boss_shoot.wav');
		sound_ghost_boss_shoot_short = new Sound('sounds/ghost_boss_shoot_short.wav');

		sounds.push(sound_laser)
		sounds.push(sound_enemy_laser)
		sounds.push(sound_alien_dead)
		sounds.push(sound_rock_dead)
		sounds.push(sound_player_damaged)
		sounds.push(sound_powerup)
	}
}