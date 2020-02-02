class SpaceShipGame extends Phaser.Scene {
    constructor() {
        super({key:"SpaceShipGame"});
    }
    
    // CENTER = x: 960; y: 540;
    
    // LOADING ALL THE ASSETS 
    preload() {
        this.load.image('spaceShip', 'Assets2/spaceShip.png');
        
    }
    
    
    create() {
        // Spaceship node
        this.spaceShip = this.physics.add.image(960, 900, 'spaceShip');
        
        // POINTER
        this.myPointer = this.input.activePointer;
        
        // VELOCITY
        this.velocity = 0;
        
        
        this.MAXSPEED = 500;
    }
    
    // Called before each frame gets rendered 
    update() {
        
        if (this.myPointer.isDown) { // User holding the pointer down
            
            if (this.myPointer.x < 960){ //The pointer on the right side
                
                if (this.spaceShip.body.velocity.x > -this.MAXSPEED){this.spaceShip.body.velocity.x -= 15} // Move towards left
                
            }else{ //The pointer on the left side
        
                if (this.spaceShip.body.velocity.x < this.MAXSPEED){this.spaceShip.body.velocity.x += 15} // Move towards right
                
            }
        }else{ // Pointer is UP
            
            // -- Slow down gradually -- 
            if (this.spaceShip.body.velocity.x < 30 && this.spaceShip.body.velocity.x > -30){
                this.spaceShip.body.velocity.x = 0;
            }else{
                this.spaceShip.body.velocity.x -= (this.spaceShip.body.velocity.x * 0.06);
            }
        }
        
    }
    
}