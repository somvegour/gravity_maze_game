const ball = document.getElementById('ball');
const star = document.getElementById('star');
const container = document.getElementById('container');
const scoreboard = document.getElementById('scoreboard');
const controlButton = document.getElementById('controlButton');

let score = 0;
let starSpeedMultiplier = 1.0;

const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;
const ballDiameter = ball.offsetWidth;
const starDiameter = star.offsetWidth;

// Retrieve ball speed and border game-over settings from localStorage
let ballSpeed = parseInt(localStorage.getItem('ballSpeed')) || 2;
let borderGameOverEnabled = localStorage.getItem('borderGameOver') === 'true';
let ballDirection = 'Up';

// Initial positions
let ballX = containerWidth / 2 - ballDiameter / 2;
let ballY = containerHeight / 2 - ballDiameter / 2;

let starX = Math.random() * (containerWidth - starDiameter);
let starY = Math.random() * (containerHeight - starDiameter);
let starXSpeed = (Math.random() - 0.5) * 4 * starSpeedMultiplier;
let starYSpeed = (Math.random() - 0.5) * 4 * starSpeedMultiplier;

// Change direction of the ball on button click
controlButton.addEventListener('click', () => {
    switch (ballDirection) {
        case 'Up':
            ballDirection = 'Right';
            controlButton.textContent = 'Move Ball (Right)';
            break;
        case 'Right':
            ballDirection = 'Down';
            controlButton.textContent = 'Move Ball (Down)';
            break;
        case 'Down':
            ballDirection = 'Left';
            controlButton.textContent = 'Move Ball (Left)';
            break;
        case 'Left':
            ballDirection = 'Up';
            controlButton.textContent = 'Move Ball (Up)';
            break;
    }
});

// Check collision
function isColliding(x1, y1, r1, x2, y2, r2) {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < r1 + r2;
}

// End the game
function gameOver() {
    localStorage.setItem('finalScore', score);
    window.location.href = 'gameover.html';
}

// Animation loop
function animate() {
    // Move the star
    starX += starXSpeed;
    starY += starYSpeed;

    // Star collision with walls
    if (starX <= 0 || starX >= containerWidth - starDiameter) {
        starXSpeed *= -1;
    }
    if (starY <= 0 || starY >= containerHeight - starDiameter) {
        starYSpeed *= -1;
    }

    // Move the ball in the current direction
    switch (ballDirection) {
        case 'Up':
            ballY -= ballSpeed;
            if (ballY < 0 && borderGameOverEnabled) gameOver();
            ballY = Math.max(0, ballY);
            break;
        case 'Right':
            ballX += ballSpeed;
            if (ballX > containerWidth - ballDiameter && borderGameOverEnabled) gameOver();
            ballX = Math.min(containerWidth - ballDiameter, ballX);
            break;
        case 'Down':
            ballY += ballSpeed;
            if (ballY > containerHeight - ballDiameter && borderGameOverEnabled) gameOver();
            ballY = Math.min(containerHeight - ballDiameter, ballY);
            break;
        case 'Left':
            ballX -= ballSpeed;
            if (ballX < 0 && borderGameOverEnabled) gameOver();
            ballX = Math.max(0, ballX);
            break;
    }

    // Check for collision between ball and star
    if (isColliding(ballX + ballDiameter / 2, ballY + ballDiameter / 2, ballDiameter / 2,
                    starX + starDiameter / 2, starY + starDiameter / 2, starDiameter / 2)) {
        gameOver();
        return;
    }

    // Update score
    score++;
    scoreboard.textContent = `Score: ${score}`;

    // Increase star speed every 100 points
    if (score % 100 === 0) {
        starSpeedMultiplier += 0.2;
        starXSpeed *= starSpeedMultiplier;
        starYSpeed *= starSpeedMultiplier;
    }

    // Update positions of elements
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    star.style.left = `${starX}px`;
    star.style.top = `${starY}px`;

    requestAnimationFrame(animate);
}

animate();
