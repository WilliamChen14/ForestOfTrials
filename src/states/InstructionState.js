import * as THREE from 'three';
import { HomeState } from './HomeState';

export class InstructionState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.homeScreenElement = null;
        this.handleClick = this.handleClick.bind(this);
    }

    async enter() {
        try {
            this.homeScreenElement = document.createElement('div');
            this.homeScreenElement.style.position = 'fixed';
            this.homeScreenElement.style.top = '0';
            this.homeScreenElement.style.left = '0';
            this.homeScreenElement.style.width = '100%';
            this.homeScreenElement.style.height = '100%';
            this.homeScreenElement.style.zIndex = '1';
            this.homeScreenElement.style.pointerEvents = 'auto';
            this.homeScreenElement.style.background = '#b8c5b9'; // Set background as per provided HTML

            // Set the HTML structure (excluding <html>, <head>, and <body>)
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
                <div class="content-container">
                    <div class="title-banner">
                        <div class="chains">
                            <div class="chain"></div>
                            <div class="chain"></div>
                            <div class="chain"></div>
                            <div class="chain"></div>
                        </div>
                        <h1 class="title">Instructions</h1>
                    </div>
                    <div class="instructions-box">Use wasd to move. <br />j to attack in the last inputed direction.  <br />k to pick up and drop items.  <br />r to reset the level.</div>

                    <div class="mushroom-container">
                        <a href="#" class="mushroom">
                            <span class="mushroom-top play">Return to Home</span>
                            <span class="mushroom-stem"></span>
                        </a>
                    </div>
                </div>
            `;

            // Add styles
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
                    margine-bottom: 20px;
                    transform: translateX(-50%);
                    background: #e8c4b8;
                    padding: 30px 160px; /* Increased padding for larger buttons */
                    border-radius: 15px;
                    border: 4px solid #b39c94;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 60%;
                    min-width: 600px;
                    text-align: center;
                }
                .content-container {
                    position: absolute;
                    top: 10%;  /* Adjust for overall positioning */
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 90%;  /* Adjust height as needed */
                    width: 60%;
                    text-align: center;
                }

                .instructions-box {
                    background: #e8c4b8;
                    padding: 40px;
                    height: auto;
                    border-radius: 15px;
                    border: 4px solid #b39c94;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    font-size: 1.5em;  /* Adjust font size for better readability */
                    color: #443328;
                    width: 100%;
                    margin-top: 20px;
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
                    font-size: 4.5em; /* Increased font size */
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
                    padding: 0 10%; /* Adjusted padding for better spacing */
                }

                .mushroom {
                    text-decoration: none;
                    text-align: center;
                    color: #443328;
                    font-size: 2.5em; /* Increased font size for larger buttons */
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
                    transform: scale(1.2); /* Increased scale on hover for bigger effect */
                }

                .mushroom-top {
                    display: block;
                    background: #e8c4b8;
                    padding: 25px 70px; /* Increased padding for larger buttons */
                    border-radius: 60px 60px 0 0;
                    position: relative;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .mushroom-top.play {
                    background: #ff4d4d; /* Changed to a more prominent red */
                }

                .mushroom-top:hover {
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                }

                .mushroom-stem {
                    width: 40px; /* Increased width for larger buttons */
                    height: 60px; /* Increased height for larger buttons */
                    background: #d4b5a9;
                    margin: 0 auto;
                    border-radius: 0 0 12px 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); } /* Increased float distance */
                }
            `;

            document.head.appendChild(styleElement);
            document.body.appendChild(this.homeScreenElement);

            // Add event listeners
            const mushrooms = this.homeScreenElement.querySelectorAll('.mushroom');
            mushrooms.forEach(mushroom => {
                mushroom.addEventListener('click', this.handleClick);
            });
        } catch (error) {
            console.error('Error creating homescreen:', error);
        }
    }

    handleClick(e) {
        e.preventDefault();
        const buttonText = e.currentTarget.querySelector('.mushroom-top').textContent.toLowerCase();

        switch(buttonText) {
            case 'return to home':
                console.log('Return to Home clicked');
                this.stateManager.changeState(HomeState);
                break;
            default:
                console.log('Unknown button clicked:', buttonText);
        }
    }

    update() {
        //maybe later
    }

    exit() {
        //cleanup
        if (this.homeScreenElement) {
            // Remove event listeners
            const mushrooms = this.homeScreenElement.querySelectorAll('.mushroom');
            mushrooms.forEach(mushroom => {
                mushroom.removeEventListener('click', this.handleClick);
            });

            // Remove the element
            document.body.removeChild(this.homeScreenElement);
            this.homeScreenElement = null;

            // Remove the style element
            /*
            const style = document.querySelector('style');
            if (style) {
                document.head.removeChild(style);
            }
            */
        }
    }
}
