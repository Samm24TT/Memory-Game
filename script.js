const emojis = ['🍎', '🍎', '🚀', '🚀', '🎸', '🎸', '🐶', '🐶', '🍕', '🍕', '🚗', '🚗', '👻', '👻', '💎', '💎'];
let clickedCards = [];

// Game state object to keep things organized
const gameState = {
  score: 0,
  moves: 0,
  time: 0,
  timerInterval: null,
  isActive: false
};

// DOM Elements
const board = document.querySelector('.game-board');
const startButton = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');
const countDisplay = document.getElementById('count');
const timerDisplay = document.getElementById('timer');

// Event Listener for Starting the Game
startButton.addEventListener('click', startGame);

function startGame() {
  // 1. Reset Game State using Object updates
  gameState.score = 0;
  gameState.moves = 0;
  gameState.time = 0;
  gameState.isActive = true;
  clickedCards = [];

  // Update the DOM view
  scoreDisplay.textContent = gameState.score;
  countDisplay.textContent = gameState.moves;
  timerDisplay.textContent = gameState.time;
  board.innerHTML = '';

  // 2. Shuffle using a modern Fisher-Yates shuffle algorithm (or standard sort for brevity)
  const shuffledEmojis = [...emojis].sort(() => Math.random() - 0.5);

  // 3. Generate cards dynamically using .forEach()
  shuffledEmojis.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    // Using arrow function for the event listener
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });

  // 4. Manage the Timer Loop
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(() => {
    gameState.time++;
    timerDisplay.textContent = gameState.time;
  }, 1000);
}

function flipCard(card) {
  // Guard clauses: exit early if conditions aren't met
  if (!gameState.isActive) return;
  if (card.classList.contains('flipped') || clickedCards.length === 2) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  clickedCards.push(card);

  if (clickedCards.length === 2) {
    // Increment moves tracker
    gameState.moves++;
    countDisplay.textContent = gameState.moves;
    checkForMatch();
  }
}

function checkForMatch() {
  // Array destructuring to pull cards out cleanly
  const [card1, card2] = clickedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  if (isMatch) {
    // Handle Match
    card1.classList.add('matched');
    card2.classList.add('matched');
    gameState.score++;
    scoreDisplay.textContent = gameState.score;
    clickedCards = [];

    // Check for Win condition (8 pairs total)
    if (gameState.score === 8) {
      clearInterval(gameState.timerInterval);
      gameState.isActive = false;
      // Delaying the alert slightly so the last card animation can finish rendering
      setTimeout(() => alert(`🎉 Win! Time: ${gameState.time}s | Moves: ${gameState.moves}`), 300);
    }
  } else {
    // Handle Mismatch (Flip back after 1 second)
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
      clickedCards = [];
    }, 1000);
  }
}
