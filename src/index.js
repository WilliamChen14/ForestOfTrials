// index.js

export function animate(stateManager) {
    // Main animation loop
    function render() {
        requestAnimationFrame(render);

        // Update the current game state
        stateManager.update();

        // Render the scene
        stateManager.renderer.render(stateManager.scene, stateManager.camera);
    }

    render();
}