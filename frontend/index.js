import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    speed: 5,
    jumpForce: 10,
    velocityY: 0,
    isJumping: false
};

const platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 200, y: 250, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 600, y: 150, width: 100, height: 20 }
];

let score = 0;
let gameLoop;
let gameOver = false;

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') player.x -= player.speed;
    if (e.key === 'ArrowRight') player.x += player.speed;
    if (e.key === 'ArrowUp' && !player.isJumping) {
        player.velocityY = -player.jumpForce;
        player.isJumping = true;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowUp') player.isJumping = false;
}

function update() {
    if (gameOver) return;

    // Apply gravity
    player.velocityY += 0.5;
    player.y += player.velocityY;

    // Check collision with platforms
    for (const platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    // Check if player falls off the screen
    if (player.y > canvas.height) {
        endGame();
    }

    // Update score
    score++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = 'green';
    for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Update score display
    document.getElementById('scoreValue').textContent = score;
}

function gameLoopFunction() {
    update();
    draw();
}

function startGame() {
    gameOver = false;
    score = 0;
    player.x = 50;
    player.y = 200;
    player.velocityY = 0;
    gameLoop = setInterval(gameLoopFunction, 1000 / 60); // 60 FPS
}

function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('game-over').style.display = 'block';
}

async function submitScore() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        await backend.addHighScore(playerName, score);
        updateHighScores();
    }
}

async function updateHighScores() {
    const highScores = await backend.getHighScores();
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = '';
    highScores.forEach(([name, score]) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${score}`;
        highScoresList.appendChild(li);
    });
}

document.getElementById('submitScore').addEventListener('click', submitScore);
document.getElementById('restartGame').addEventListener('click', () => {
    document.getElementById('game-over').style.display = 'none';
    startGame();
});

// Initialize the game
updateHighScores();
startGame();
