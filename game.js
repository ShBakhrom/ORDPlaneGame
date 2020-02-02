var config = {
	type:Phaser.AUTO,
	width:1920,
	height:1080,
    backgroundColor:"#4c4c4c",
	physics: {
		default:'arcade',
		arcade: {
			gravity: {y : 0}
		}
	},
	scene: [ SpaceShipGame ]
};

var game = new Phaser.Game(config);