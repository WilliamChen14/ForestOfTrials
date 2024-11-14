// src/Controls.js
const moveSpeed = 0.1;

export class Controls {
    constructor() {
        this.keysPressed = {
            w: false,
            a: false,
            s: false,
            d: false,
            j: false,
            k: false,
            l: false,
            space: false,
            escape: false
        };
        this.moveX = 0;
        this.moveY = 0;
        this.moveZ = 0;
        this.jumpCooldownTime = 400;
        this.lastJumpTime = 0;

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyRelease = this.onKeyRelease.bind(this);

        // Event listeners for keydown and keyup
        window.addEventListener('keydown', this.onKeyPress);
        window.addEventListener('keyup', this.onKeyRelease);
    }

    
    onKeyPress(event) {
        switch (event.key) {
            case "w":  // Move up
                this.moveZ = -moveSpeed;
                this.keysPressed.w = true;
                break;
            case "a":  // Move left
                this.moveX = -moveSpeed;
                this.keysPressed.a = true;
                break;
            case "s":  // Move down
                this.moveZ = moveSpeed;
                this.keysPressed.s = true;
                break;
            case "d":  // Move right
                this.moveX = moveSpeed;
                this.keysPressed.d = true;
                break;
            case "j":
                console.log("Action J");
                break;
            case "k":
                console.log("Action K");
                break;
            case "l":
                console.log("Action L");
                break;
            case "r":
                console.log("Action reset game");
                //resetGame();
                break;
            case "Escape":
                console.log("Pause Game");
                break;
            case " ":
                this.keysPressed.space = true;
                break;
            default:
                break;
        }
    }

    // Stop movement when key is released
    onKeyRelease(event) {
        switch (event.key) {
            case "w":
                if(this.keysPressed.s){
                    this.moveZ = moveSpeed;
                }
                else{
                    this.moveZ = 0
                }
                this.keysPressed.w = false;
                break;
            case "a":  // Move left
                if(this.keysPressed.d){
                    this.moveX = moveSpeed;
                }
                else{
                    this.moveX = 0;
                }
                this.keysPressed.a = false;
                break;
            case "s":  // Move down
                if(this.keysPressed.w){
                    this.moveZ = -moveSpeed;
                }
                else{
                    this.moveZ = 0
                }
                this.keysPressed.s = false;
                break;
            case "d":  // Move right
                if(this.keysPressed.a){
                    this.moveX = -moveSpeed;
                }
                else{
                    this.moveX = 0;
                }
                this.keysPressed.d = false;
                break;
            case " ":
                this.keysPressed.space = false;
                break;
            default:
                break;
        }
    }

    // Method to get the state of a specific key
    isKeyPressed(key) {
        return this.keysPressed[key] || false;
    }

    // Optional: Method to reset all key states (useful when changing states)
    resetKeys() {
        for (let key in this.keysPressed) {
            this.keysPressed[key] = false;
        }
    }
}
