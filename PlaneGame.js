class PlaneGame extends Phaser.Scene {
    constructor() {
        super({key:"PlaneGame"});
    }
    
    // CENTER = x: 960; y: 540;
    
    // ------------------- ************ LOADING ALL THE ASSETS    ************ ------------------- 
    preload() {
        this.load.image('plane', 'Assets/plane.png');
        this.load.image('topPlane', 'Assets/topPlane.png');
        for ( this.i = 1; this.i < 16; this.i++) {
            this.load.image(''+this.i, 'Assets/luggage/'+this.i+'.png');
        }
        this.load.image('blryCld1', 'Assets/clouds/bluryCloud1.png');
        this.load.image('blryCld2', 'Assets/clouds/bluryCloud2.png');
        this.load.image('blryCld3', 'Assets/clouds/bluryCloud3.png');
        this.load.image('blryCld4', 'Assets/clouds/bluryCloud4.png');
        this.load.image('blryCld5', 'Assets/clouds/bluryCloud5.png');
        this.load.image('blryCld6', 'Assets/clouds/bluryCloud6.png');
        this.load.image('cld1', 'Assets/clouds/cloud1.png');
        this.load.image('cld2', 'Assets/clouds/cloud2.png');
        this.load.image('cld3', 'Assets/clouds/cloud3.png');
        this.load.image('cld4', 'Assets/clouds/cloud4.png');
        this.load.image('cld5', 'Assets/clouds/cloud5.png');
        this.load.image('cld6', 'Assets/clouds/cloud6.png');
        this.load.image('luggageIcon', 'Assets/luggageIcon.png');
    }
    
    
    create() {
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
        let luggageIcon = this.add.image(1730, 75, 'luggageIcon');
        luggageIcon.angle = 20 ;
        this.scoreLabel = this.add.text(1780, 50, "0", { font: "60px Arial", fill: "#ffffff" });
        
        
        
        
        // ------------------- ************ FOREGROUND CLOUDS   ************ -------------------
        this.generateForClouds();
        
    }
    // Called before each frame gets rendered 
    update() {
        
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

                this.randomLuggageDrop();

            }
        }
        // ------------------- ************  LUGGAGE MOVEMENT END************ -------------------
        
        
        
        //------------------- ************   CLOUDS MOVEMENT  ************ -------------------
        this.cloudsMovementCycle(); 
        //------------------- ************   CLOUDS MOVEMENT END  ************ -------------------
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
        this.luggage.body.position.x = Phaser.Math.Between(220, 1700)
        this.luggage.setTexture(''+Phaser.Math.Between(1, 15));
        this.luggage.setGravity(0, 300);
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
    //------------------- ************  CLOUDS END ************ -------------------
}


/*
// ------------------- ************ Top plane  ************ -------------------
        this.topPlane = this.add.image(960, 100, 'topPlane');
        this.topPlaneMoveBy = 0;
        this.targetX = 960;
        this.switchAfter = 100;
        // ------------------- ************            ************ -------------------
    // ------------------- ************ TOP PLANE MOVEMENT  ************ -------------------
        if (this.switchAfter>0){
            this.switchAfter --;
        }else{
            this.topPlaneRandomMovement()
        }
        if (this.topPlane.x < this.targetX) {
            this.topPlaneMoveBy += 0.1;
        }else{
            this.topPlaneMoveBy -= 0.1;
        }
        
        this.topPlane.x += this.topPlaneMoveBy;
        // ------------------- ************              ************ -------------------
    
    topPlaneRandomMovement = function() {  
        this.switchAfter = Phaser.Math.Between(220, 1700);
        this.targetX = this.switchAfter;
        
    }
    */
