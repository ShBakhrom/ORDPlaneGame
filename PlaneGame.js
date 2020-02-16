class PlaneGame extends Phaser.Scene {
    constructor() {
        super({key:"PlaneGame"});
    }
    
    // CENTER = x: 960; y: 540;
    
    // ------------------- ************ LOADING ALL THE ASSETS    ************ ------------------- 
    preload() {
        this.load.image('plane', 'assets/plane.png');
        this.load.image('topPlane', 'assets/topPlane.png');
        for ( this.i = 1; this.i < 16; this.i++) {
            this.load.image(''+this.i, 'assets/luggage/'+this.i+'.png');
        }
        this.load.image('blryCld1', 'assets/clouds/bluryCloud1.png');
        this.load.image('blryCld2', 'assets/clouds/bluryCloud2.png');
        this.load.image('blryCld3', 'assets/clouds/bluryCloud3.png');
        this.load.image('blryCld4', 'assets/clouds/bluryCloud4.png');
        this.load.image('blryCld5', 'assets/clouds/bluryCloud5.png');
        this.load.image('blryCld6', 'assets/clouds/bluryCloud6.png');
        this.load.image('cld1', 'assets/clouds/cloud1.png');
        this.load.image('cld2', 'assets/clouds/cloud2.png');
        this.load.image('cld3', 'assets/clouds/cloud3.png');
        this.load.image('cld4', 'assets/clouds/cloud4.png');
        this.load.image('cld5', 'assets/clouds/cloud5.png');
        this.load.image('cld6', 'assets/clouds/cloud6.png');
        this.load.image('luggageIcon', 'assets/luggageIcon.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.image('X', 'assets/X.png');
    }
    
    
    create() {
        this.menuShown = true;
        this.gameOver = true;
        this.showTheStartButton()
        this.input.on('pointerdown', function (e) {
            if (this.menuShown) {
                this.startBtn.destroy();
                this.menuShown = false;
                this.START_THE_GAME();
            }
        }, this);
         
            
        
        this.X = this.add.image(-100, -100, 'X');
        
        
    }
    
    // Called before each frame gets rendered 
    update() {
        
        if (!this.gameOver) { // if game is not over
            
            
            //------------------- ************   HERO MOVEMENT  ************ -------------------
            if (this.myPointer.isDown) { // User holding the pointer down
                if (this.myPointer.x < 960){ //The pointer is on the left side
                    if (this.moveBy > -this.MAXSPEED){this.moveBy -= 0.2} // Move towards left
                }else{ //The pointer is on the right side
                    if (this.moveBy > -this.MAXSPEED){this.moveBy += 0.2} // Move towards left
                }
            }else{ // Pointer is UP
                // -- Slow down gradually -- 
                if (this.moveBy < 0.5 && this.moveBy > -0.5){
                    this.moveBy = 0;
                }else{
                    this.moveBy -= (this.moveBy * 0.04);
                }
            }
            if (this.hero.body.position.x + this.moveBy < 0 || this.hero.body.position.x + this.moveBy > 1615){ // BOUNDARY CHECK
                this.moveBy = 0;
            }
            this.hero.body.position.x += this.moveBy;
            //------------------- ************   HERO MOVEMENT END ************ -------------------



            // ------------------- ************  LUGGAGE MOVEMENT ************ -------------------
            if (this.physics.overlap(this.hero, this.luggage)) {
                this.score += 1;
                
                this.scoreLabel.text = this.score;
                this.randomLuggageDrop();
            }
            if (this.luggage != null){
                this.luggage.angle += this.luggageRotation;
                if (this.luggage.body.position.y > 1080){
                    this.X.x = this.luggage.body.position.x + 50;
                    this.X.y = 1020;
                    let disolve = this.tweens.add({
                        targets: this.X,
                        alpha: {from: 1.0, to: 0.0},
                        duration:5000,
                        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                        duration: 1000
                    });
                    this.missedLuggageCount++;
                    if (this.missedLuggageCount > 3){
                        this.END_THE_GAME();
                    }
                    this.randomLuggageDrop();

                }
            }
            // ------------------- ************  LUGGAGE MOVEMENT END************ -------------------



            //------------------- ************   CLOUDS MOVEMENT  ************ -------------------
            this.cloudsMovementCycle(); 
            //------------------- ************   CLOUDS MOVEMENT END  ************ -------------------
            
        }else if (!this.menuShown){
            this.menuShown = true;
            this.showTheStartButton();
        }
    }
    START_THE_GAME = function() {
        // ------------------- ************ START THE GAME   ************ -------------------
        this.gameOver = false;
        this.menuShown = false;
        
        
        // ------------------- ************ BACKGROUND CLOUDS   ************ -------------------
        this.generateBackClouds();
        
        
        // ------------------- ************ HERO  ************ -------------------
        this.hero = this.physics.add.image(960, 945, 'plane');
        //Move hero node by 
        this.moveBy = 0;
        this.MAXSPEED = 100;
        // Controller 
        this.myPointer = this.input.activePointer;
        // ------------------- ************ HERO  END ************ -------------------
        
        
           
        // ------------------- ************ LUGGAGE   ************ -------------------
        this.generateLuggage();

         
        
        // ------------------- ************ SCORE LABEL  ************ -------------------
        this.score = 0;
        this.missedLuggageCount = 0;
        this.luggageIcon = this.add.image(1730, 75, 'luggageIcon');
        this.luggageIcon.angle = 20 ;
        this.scoreLabel = this.add.text(1780, 50, "0", { font: "60px Arial", fill: "#ffffff" });
        
        
        
        
        // ------------------- ************ FOREGROUND CLOUDS   ************ -------------------
        this.generateForClouds();
    }
    
    
    END_THE_GAME = function() {
        // ------------------- ************  GAME OVER   ************ -------------------
        this.gameOver = true;
        this.removeAllClouds(); 
        this.hero.body.x = -500;
        this.luggage.body.x = -500;
        this.luggageIcon.destroy();
        this.scoreLabel.destroy();
        // ------------------- ************  GAME OVER   ************ -------------------
    }
    
    
    
    
    // ------------------- ************  LUGGAGE ************ -------------------
    generateLuggage = function() {  
        this.luggage = this.physics.add.image(Phaser.Math.Between(220, 1700) , -100, ''+Phaser.Math.Between(1, 15));
        this.luggageRotation = -1;
        this.randomLuggageDrop();
    }
    
    randomLuggageDrop = function() {  
        //this.luggage = this.physics.add.image(Phaser.Math.Between(220, 1700) , -100, ''+Phaser.Math.Between(1, 15));
        
        this.luggage.angle = Phaser.Math.Between(1, 360);
        this.luggageRotation = -this.luggageRotation;
        this.luggage.body.velocity.y = 0;
        this.luggage.body.position.y = -120;
        if (!this.gameOver) {
            this.luggage.body.position.x = Phaser.Math.Between(220, 1700)
            this.luggage.setTexture(''+Phaser.Math.Between(1, 15));
            this.luggage.setGravity(0, 300);
        }else{
            this.luggage.setGravity(0, 0);
        }
        
    }
    // ------------------- ************  LUGGAGE END************ -------------------
    
    
    
    
    
    
    
    //------------------- ************  CLOUDS ************ -------------------
    generateForClouds = function() {
        this.foregroundCloudsArray = [];
        this.generateForegroundClouds();
    }
    generateBackClouds = function() {
        this.backgroundCloudsArray = [];
        this.generateBackgroundClouds();
    }
    generateForegroundClouds = function() {
        if (this.foregroundCloudsArray.length == 0) {
            let numberOfClouds = Phaser.Math.Between(2, 3);
            for (var i = 0; i < numberOfClouds; i++) {
                let cloud = this.add.image(Phaser.Math.Between(220, 1700) , -100 - (i * Phaser.Math.Between(500, 600)), 'cld'+Phaser.Math.Between(1, 6));
                //let cloud = this.add.image(1400 + (i * Phaser.Math.Between(300, 600)), Phaser.Math.Between(50, 550), 'cld'+Phaser.Math.Between(1, 6));
                cloud.alpha = 0.8;
                this.foregroundCloudsArray.push(cloud);
            }
        }
    }
    generateBackgroundClouds = function() {
        if (this.backgroundCloudsArray.length == 0) {
            let numberOfClouds = Phaser.Math.Between(2, 3);
            for (var i = 0; i < numberOfClouds; i++) {
                let cloud = this.add.image(Phaser.Math.Between(220, 1700) , -100 - (i * Phaser.Math.Between(500, 600)), 'blryCld'+Phaser.Math.Between(1, 6));
                cloud.alpha = 0.8;
                this.backgroundCloudsArray.push(cloud);
            }
        }
    }
    cloudsMovementCycle = function() {
        
        for (var i = 0; i < this.foregroundCloudsArray.length; i++) {
            let crntCloud = this.foregroundCloudsArray[i]
            moveTheCloud (crntCloud, 'cld', 2);
        }
        
        for (var i = 0; i < this.backgroundCloudsArray.length; i++) {
            let crntCloud = this.backgroundCloudsArray[i]
            moveTheCloud (crntCloud, 'blryCld', 1);
        }
        function moveTheCloud (crntCloud, pref, spd){
            
            if (crntCloud.y > 1180) {
                    crntCloud.y -= 1300;
                    crntCloud.x = Phaser.Math.Between(220, 1700);
                    crntCloud.setTexture(pref+''+Phaser.Math.Between(1, 6));
                }
                crntCloud.y += spd;
        }
    }
    
    removeAllClouds = function() {
        
        for (var i = 0; i < this.foregroundCloudsArray.length; i++) {
            this.foregroundCloudsArray[i].destroy();
        }
        
        for (var i = 0; i < this.backgroundCloudsArray.length; i++) {
            this.backgroundCloudsArray[i].destroy();
        }
    }
    //------------------- ************  CLOUDS END ************ -------------------
    
    
    
    showTheStartButton = function() {
        this.menuShown = true;
        this.startBtn = this.add.image(960, 540, 'startButton');
        this.startBtn.setOrigin(0.5, 1.0);
        this.startBtn.alpha = 0;
        let tween2 = this.tweens.add({
            targets: this.startBtn,
            alpha: {from: 0.1, to: 1.0},
            duration:5000,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
    }
    
    removeX = function() {
        this.X.x = -100;
        this.X.y = -100;
    }
    
    
}

