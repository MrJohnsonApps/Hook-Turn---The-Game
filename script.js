let car = document.getElementById('car');
let message = document.getElementById('message');
let carPosition = { left: 10, bottom: 10 };
let playerName = "";
let score = 0;
let level = 1;
let highScores = [];
let trafficSpeed = 10;  // Initial traffic speed in seconds

// Start the game
document.getElementById('start-game').addEventListener('click', () => {
    playerName = document.getElementById('player-name').value;
    if (playerName) {
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        startLevel(level);
    } else {
        alert("Please enter your name to start!");
    }
});

// Move the player's car
function moveCar(direction) {
    if (direction === 'left') {
        carPosition.left -= 10;
    } else if (direction === 'right') {
        carPosition.left += 10;
        carPosition.bottom += 20;
    }
    updateCarPosition();
}

// Update the player's car position
function updateCarPosition() {
    car.style.left = carPosition.left + '%';
    car.style.bottom = carPosition.bottom + '%';
    
    // Check if the car is in the intersection
    if (carPosition.left >= 30 && carPosition.left <= 50 && carPosition.bottom >= 30) {
        score += 10 * level;
        message.innerText = `Hook turn successful! Score: ${score}`;
        levelUp();
    }

    // Check for collisions with traffic cars
    checkCollisions();
}

// Start a level with increasing difficulty
function startLevel(level) {
    message.innerText = `Level ${level} - Avoid traffic and perform the hook turn!`;
    
    // Increase traffic speed each level
    trafficSpeed = Math.max(2, 10 - level);  // Speed up with each level
    document.querySelectorAll('.traffic-car').forEach(car => {
        car.style.animationDuration = `${trafficSpeed}s`;
    });
}

// Level up
function levelUp() {
    level++;
    carPosition = { left: 10, bottom: 10 };  // Reset car position for new level
    startLevel(level);
}

// Detect collision between player's car and traffic cars
function checkCollisions() {
    const playerCarRect = car.getBoundingClientRect();
    const trafficCars = document.querySelectorAll('.traffic-car');

    trafficCars.forEach(trafficCar => {
        const trafficCarRect = trafficCar.getBoundingClientRect();
        if (
            playerCarRect.left < trafficCarRect.right &&
            playerCarRect.right > trafficCarRect.left &&
            playerCarRect.top < trafficCarRect.bottom &&
            playerCarRect.bottom > trafficCarRect.top
        ) {
            gameOver();
        }
    });
}

// End the game when a collision happens
function gameOver() {
    message.innerText = `Game Over! You crashed. Final Score: ${score}`;
    saveHighScore();
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('high-scores').style.display = 'block';
}

// Save high score and display it
function saveHighScore() {
    highScores.push({ name: playerName, score: score });
    highScores.sort((a, b) => b.score - a.score);  // Sort high scores by score
    displayHighScores();
}

// Display high scores
function displayHighScores() {
    let scoresList = document.getElementById('scores-list');
    scoresList.innerHTML = '';
    highScores.forEach(entry => {
        let listItem = document.createElement('li');
        listItem.innerText = `${entry.name}: ${entry.score}`;
        scoresList.appendChild(listItem);
    });
}

// Add event listeners for car controls
document.getElementById('turn-left').addEventListener('click', () => moveCar('left'));
document.getElementById('turn-right').addEventListener('click', () => moveCar('right'));
document.getElementById('restart').addEventListener('click', () => window.location.reload());
