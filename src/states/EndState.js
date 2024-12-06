import * as THREE from 'three';
import { HomeState } from './HomeState';

class Confetti {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.colors = [
            0xff0000, // red
            0x00ff00, // green
            0x0000ff, // blue
            0xffff00, // yellow
            0xff00ff, // magenta
            0x00ffff  // cyan
        ];
        this.createParticles();
    }

    createParticles() {
        const geometry = new THREE.PlaneGeometry(0.1, 0.1);
        
        for (let i = 0; i < 200; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                side: THREE.DoubleSide
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random starting position
            particle.position.x = Math.random() * 10 - 5;
            particle.position.y = Math.random() * 10 + 5;
            particle.position.z = Math.random() * 10 - 5;
            
            // Random rotation
            particle.rotation.x = Math.random() * Math.PI;
            particle.rotation.y = Math.random() * Math.PI;
            particle.rotation.z = Math.random() * Math.PI;
            
            // Add velocity properties
            particle.userData.velocity = {
                x: (Math.random() - 0.5) * 0.1,
                y: -0.05 - Math.random() * 0.05,
                z: (Math.random() - 0.5) * 0.1,
                rotationX: (Math.random() - 0.5) * 0.02,
                rotationY: (Math.random() - 0.5) * 0.02,
                rotationZ: (Math.random() - 0.5) * 0.02
            };
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }

    update() {
        for (const particle of this.particles) {
            // Update position
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;
            
            // Update rotation
            particle.rotation.x += particle.userData.velocity.rotationX;
            particle.rotation.y += particle.userData.velocity.rotationY;
            particle.rotation.z += particle.userData.velocity.rotationZ;
            
            // Reset particle if it falls below the screen
            if (particle.position.y < -5) {
                particle.position.y = 10;
                particle.position.x = Math.random() * 10 - 5;
                particle.position.z = Math.random() * 10 - 5;
            }
        }
    }

    dispose() {
        for (const particle of this.particles) {
            particle.geometry.dispose();
            particle.material.dispose();
            this.scene.remove(particle);
        }
        this.particles = [];
    }
}

export class EndState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.homeScreenElement = null;
        this.handleClick = this.handleClick.bind(this);
        
        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.confetti = null;
        this.animate = this.animate.bind(this);
    }

    async enter() {
        try {
            // Set up Three.js scene
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.domElement.style.position = 'fixed';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.pointerEvents = 'none';
            this.renderer.domElement.style.zIndex = '2';
            document.body.appendChild(this.renderer.domElement);

            this.camera.position.z = 10;
            this.confetti = new Confetti(this.scene);
            
            // Start animation
            this.animate();

            this.homeScreenElement = document.createElement('div');
            this.homeScreenElement.style.position = 'fixed';
            this.homeScreenElement.style.top = '0';
            this.homeScreenElement.style.left = '0';
            this.homeScreenElement.style.width = '100%';
            this.homeScreenElement.style.height = '100%';
            this.homeScreenElement.style.zIndex = '1';
            this.homeScreenElement.style.pointerEvents = 'auto';
            this.homeScreenElement.style.background = '#b8c5b9';

            this.homeScreenElement.innerHTML = `
                <div class="trees-container">
                    <!-- SVG Trees -->
                    <svg class="tree" style="left: 5%" viewBox="0 0 200 300">
                        <!-- Tree 1 -->
                        <path d="M100,20 L160,280 L40,280 Z" fill="#849886"/>
                        <path d="M100,60 L150,260 L50,260 Z" fill="#7a8e7c"/>
                        <path d="M100,100 L140,240 L60,240 Z" fill="#6f836f"/>
                        <!-- Snow -->
                        <path d="M100,20 C120,30 140,45 160,280 C120,270 80,270 40,280 C60,45 80,30 100,20" fill="#b8c5b9" fill-opacity="0.3"/>
                        <!-- Trunk -->
                        <rect x="90" y="260" width="20" height="40" fill="#5d4037"/>
                    </svg>
                    <svg class="tree" style="left: 25%" viewBox="0 0 200 300">
                        <!-- Tree 2 -->
                        <path d="M100,30 L170,270 L30,270 Z" fill="#7a8e7c"/>
                        <path d="M100,80 L150,250 L50,250 Z" fill="#6f836f"/>
                        <path d="M100,130 L130,230 L70,230 Z" fill="#657a65"/>
                        <!-- Snow -->
                        <path d="M100,30 C120,40 150,55 170,270 C130,260 70,260 30,270 C50,55 80,40 100,30" fill="#b8c5b9" fill-opacity="0.3"/>
                        <!-- Trunk -->
                        <rect x="90" y="250" width="20" height="50" fill="#5d4037"/>
                    </svg>
                    <svg class="tree" style="left: 45%" viewBox="0 0 200 300">
                        <!-- Tree 3 -->
                        <path d="M100,10 L180,290 L20,290 Z" fill="#849886"/>
                        <path d="M100,70 L160,270 L40,270 Z" fill="#7a8e7c"/>
                        <path d="M100,130 L140,250 L60,250 Z" fill="#6f836f"/>
                        <!-- Snow -->
                        <path d="M100,10 C130,25 160,45 180,290 C130,280 70,280 20,290 C40,45 70,25 100,10" fill="#b8c5b9" fill-opacity="0.3"/>
                        <!-- Trunk -->
                        <rect x="90" y="270" width="20" height="30" fill="#5d4037"/>
                    </svg>
                    <svg class="tree" style="left: 65%" viewBox="0 0 200 300">
                        <!-- Tree 4 -->
                        <path d="M100,40 L165,280 L35,280 Z" fill="#7a8e7c"/>
                        <path d="M100,90 L145,260 L55,260 Z" fill="#6f836f"/>
                        <path d="M100,140 L125,240 L75,240 Z" fill="#657a65"/>
                        <!-- Snow -->
                        <path d="M100,40 C120,50 145,65 165,280 C125,270 75,270 35,280 C55,65 80,50 100,40" fill="#b8c5b9" fill-opacity="0.3"/>
                        <!-- Trunk -->
                        <rect x="90" y="260" width="20" height="40" fill="#5d4037"/>
                    </svg>
                    <svg class="tree" style="left: 85%" viewBox="0 0 200 300">
                        <!-- Tree 5 -->
                        <path d="M100,20 L170,280 L30,280 Z" fill="#849886"/>
                        <path d="M100,80 L150,260 L50,260 Z" fill="#7a8e7c"/>
                        <path d="M100,140 L130,240 L70,240 Z" fill="#6f836f"/>
                        <!-- Snow -->
                        <path d="M100,20 C120,35 150,55 170,280 C130,270 70,270 30,280 C50,55 80,35 100,20" fill="#b8c5b9" fill-opacity="0.3"/>
                        <!-- Trunk -->
                        <rect x="90" y="260" width="20" height="40" fill="#5d4037"/>
                    </svg>
                </div>

                <div class="title-banner">
                    <div class="chains">
                        <div class="chain"></div>
                        <div class="chain"></div>
                        <div class="chain"></div>
                        <div class="chain"></div>
                    </div>
                    <h1 class="title">Congratulations! You have won the game. You have freed the village from Birdman!</h1>
                </div>

                <div class="mushroom-container">
                    <a href="#" class="mushroom">
                        <span class="mushroom-top">Exit</span>
                        <span class="mushroom-stem"></span>
                    </a>
                    <a href="#" class="mushroom">
                        <span class="mushroom-top play">Return to Home</span>
                        <span class="mushroom-stem"></span>
                    </a>
                </div>
            `;

            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Griffy&display=swap');

                body {
                    margin: 0;
                    height: 100vh;
                    background: #b8c5b9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Griffy', cursive;
                    overflow: hidden;
                }

                .trees-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                }

                .tree {
                    position: absolute;
                    bottom: 0;
                    width: 180px;
                    height: 280px;
                }

                .title-banner {
                    position: absolute;
                    top: 10%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #e8c4b8;
                    padding: 30px 160px;
                    border-radius: 15px;
                    border: 4px solid #b39c94;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 60%;
                    min-width: 600px;
                    text-align: center;
                }

                .title-banner::before {
                    content: '';
                    position: absolute;
                    top: -25px;
                    left: 0;
                    right: 0;
                    height: 25px;
                    background: #e8c4b8;
                    border: 4px solid #b39c94;
                    border-bottom: none;
                    border-radius: 15px 15px 0 0;
                }

                .chains {
                    position: absolute;
                    top: -50px;
                    left: 15%;
                    right: 15%;
                    height: 50px;
                    display: flex;
                    justify-content: space-around;
                }

                .chain {
                    width: 6px;
                    height: 100%;
                    background: linear-gradient(to bottom, #999, #777);
                    border-radius: 2px;
                }

                .title {
                    margin: 0;
                    color: #443328;
                    font-size: 4.5em;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                    letter-spacing: 4px;
                }

                .mushroom-container {
                    position: absolute;
                    bottom: 15%;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: space-around;
                    padding: 0 10%;
                }

                .mushroom {
                    text-decoration: none;
                    text-align: center;
                    color: #443328;
                    font-size: 2.5em;
                    font-family: 'Griffy', cursive;
                    transition: transform 0.3s ease;
                    position: relative;
                    animation: float 3s ease-in-out infinite;
                }

                .mushroom:nth-child(2) {
                    animation-delay: -1s;
                }

                .mushroom:nth-child(3) {
                    animation-delay: -2s;
                }

                .mushroom:hover {
                    transform: scale(1.2);
                }

                .mushroom-top {
                    display: block;
                    background: #e8c4b8;
                    padding: 25px 70px;
                    border-radius: 60px 60px 0 0;
                    position: relative;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .mushroom-top.play {
                    background: #ff4d4d;
                }

                .mushroom-top:hover {
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                }

                .mushroom-stem {
                    width: 40px;
                    height: 60px;
                    background: #d4b5a9;
                    margin: 0 auto;
                    border-radius: 0 0 12px 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
            `;

            document.head.appendChild(styleElement);
            document.body.appendChild(this.homeScreenElement);

            // Add event listeners
            const mushrooms = this.homeScreenElement.querySelectorAll('.mushroom');
            mushrooms.forEach(mushroom => {
                mushroom.addEventListener('click', this.handleClick);
            });

            // Add window resize handler
            this.handleResize = () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', this.handleResize);

        } catch (error) {
            console.error('Error creating homescreen:', error);
        }
    }

    animate() {
        if (this.confetti) {
            this.confetti.update();
            this.renderer.render(this.scene, this.camera);
        }
        this.animationFrameId = requestAnimationFrame(this.animate);
    }

    handleClick(e) {
        e.preventDefault();
        const buttonText = e.currentTarget.querySelector('.mushroom-top').textContent.toLowerCase();

        switch(buttonText) {
            case 'return to home':
                console.log('Return to Home clicked');
                this.stateManager.changeState(HomeState);
                break;
            case 'exit':
                console.log('Exit clicked');
                alert("Press 'Ctrl + W' (Windows/Linux) or 'Cmd + W' (Mac) to close the tab.");
                break;
            default:
                console.log('Unknown button clicked:', buttonText);
        }
    }

    update() {
        // Future implementation if needed
    }

    exit() {
        if (this.homeScreenElement) {
            // Remove event listeners
            const mushrooms = this.homeScreenElement.querySelectorAll('.mushroom');
            mushrooms.forEach(mushroom => {
                mushroom.removeEventListener('click', this.handleClick);
            });

            // Clean up Three.js
            if (this.confetti) {
                this.confetti.dispose();
            }
            cancelAnimationFrame(this.animationFrameId);
            this.renderer.domElement.remove();
            window.removeEventListener('resize', this.handleResize);

            // Remove the element
            document.body.removeChild(this.homeScreenElement);
            this.homeScreenElement = null;
        }
    }
}