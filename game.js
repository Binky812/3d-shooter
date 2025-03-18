let scene, camera, renderer;
let player, bots = [], chests = [];
let victoryText;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(
        window.innerWidth / -2, 
        window.innerWidth / 2, 
        window.innerHeight / 2, 
        window.innerHeight / -2, 
        0.1, 
        1000
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create player
    const geometry = new THREE.BoxGeometry(50, 50, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(geometry, material);
    scene.add(player);
    player.position.set(0, 0, 0);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // Create bots
    for (let i = 0; i < 29; i++) {
        const botMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const bot = new THREE.Mesh(geometry, botMaterial);
        bot.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0);
        bots.push(bot);
    }

    // Create chests
    for (let i = 0; i < 10; i++) {
        const chestMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const chest = new THREE.Mesh(geometry, chestMaterial);
        chest.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0);
        chests.push(chest);
        scene.add(chest);
    }

    // Victory text
    victoryText = document.getElementById('victory');

    // Event listeners for player controls
    window.addEventListener('keydown', onKeyDown, false);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'w': player.position.y += 10; break;
        case 's': player.position.y -= 10; break;
        case 'a': player.position.x -= 10; break;
        case 'd': player.position.x += 10; break;
        case ' ': shoot(); break; // Space key to shoot
    }
}

function shoot() {
    // Simplified shooting logic
    bots.forEach((bot, index) => {
        if (bot.position.distanceTo(player.position) < 50) {
            scene.remove(bot);
            bots.splice(index, 1);
        }
    });

    // Check for victory
    if (bots.length === 0) {
        victoryText.style.display = 'block';
    }
}

function moveBots() {
    bots.forEach(bot => {
        const direction = new THREE.Vector3().subVectors(player.position, bot.position).normalize();
        bot.position.add(direction.multiplyScalar(2)); // Adjust speed as necessary

        // Check collision with player (for simplicity, just end the game if they collide)
        if (bot.position.distanceTo(player.position) < 50) {
            alert('You were caught by a bot!');
            window.location.reload();
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    moveBots();
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
