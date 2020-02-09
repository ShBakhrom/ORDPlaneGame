var config = {
	type:Phaser.AUTO,
	width:1920,
	height:1080,
    backgroundColor:"#40aad6",
	physics: {
		default:'arcade',
		arcade: {
			gravity: {y : 0}
		}
	},
	scene: [ PlaneGame ]
};

var game = new Phaser.Game(config);