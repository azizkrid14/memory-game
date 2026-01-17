// Select the main game board element
const gameBoard=document.getElementById('game-board');
// Score display element
const scoreDisplay=document.getElementById('score');
// Timer display element
const timerDisplay=document.getElementById('timer');
// Message display element
const messageDisplay=document.getElementById('message');
// restart btn
const restartBtn=document.getElementById('restart-btn');
// Game variables
let cardsArray=['A','B','C','D','E','F','H','I']; // 8 unique symbols
let cardValues=[...cardsArray, ...cardsArray]; // Duplicate for pairs
let flippedCards=[];
let matchedCards=[];
let score=0;
let time=60; // 60 seconds countdown
let timerId;
// Randomizes the array of cards
function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
}

// CREATE GAME BOARD
function createBoard() {
    // Shuffle the cards before displaying
    cardValues = shuffle(cardValues);
    // Create card elements
    for(let i = 0; i < cardValues.length; i++){
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', cardValues[i]); // Store the card value
        card.innerText = ''; // Keep face-down initially
        // Add click event to flip card
        card.addEventListener('click', flipCard);
        // Append card to the board
        gameBoard.appendChild(card);
    }
}
function flipCard() {
    // Prevent flipping more than 2 cards or already matched cards
    if(flippedCards.length < 2 && !this.classList.contains('flip') && !matchedCards.includes(this)){
        this.classList.add('flip'); // Add flip class to show
        this.innerText = this.getAttribute('data-value'); // Show the contents of cards
        flippedCards.push(this);
        if(flippedCards.length === 1){
            flipTimeout = setTimeout(() => {
                if(flippedCards.length === 1){ // Check if second card not clicked
                    const [firstCard] = flippedCards;
                    firstCard.classList.remove('flip');
                    firstCard.innerText = '';
                    flippedCards = [];
                }
            }, 2000); // 2 seconds delay
        }
        // Check for match if 2 cards are flipped
        if(flippedCards.length === 2){
            clearTimeout(flipTimeout); // Cancel auto-flip
            setTimeout(checkMatch, 300); // Small delay to see the second card
        }
    }
}
function checkMatch() {
    const [card1, card2] = flippedCards;

    if(card1.getAttribute('data-value') === card2.getAttribute('data-value')){
        // It's a match
        matchedCards.push(card1, card2);
        score += 12.5; // Increase score
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        // Not a match, flip back
        card1.classList.remove('flip');
        card2.classList.remove('flip');
        card1.innerText = '';
        card2.innerText = '';
    }
    flippedCards = []; // Reset flipped cards
    // Check for win condition
    if(matchedCards.length === cardValues.length){
        endGame(true);
    }
}
function startTimer() {
    timerId = setInterval(() => {
        time--;
        timerDisplay.innerText = `Time: ${time}s`;

        if(time <= 0){
            endGame(false);
        }
    }, 1000);
}
function endGame(win) {
    clearInterval(timerId); // Stop timer
    if(win){
        messageDisplay.innerText = ' You Win! ';
    } else {
        messageDisplay.innerText = ' Time Up! Game Over ';
    }
    // Disable remaining cards
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.removeEventListener('click', flipCard));
}
function restartGame() {
    // Reset game variables
    flippedCards = [];
    matchedCards = [];
    score = 0;
    time = 60;
    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Time: ${time}s`;
    messageDisplay.innerText = '';
    // Clear any previous timer or timeout
    clearInterval(timerId);
    clearTimeout(flipTimeout);
    // Clear previous board
    gameBoard.innerHTML = '';
    // Recreate the board and restart timer
    createBoard();
    startTimer();
}
// ----- EVENT LISTENER FOR RESTART BUTTON -----
restartBtn.addEventListener('click', restartGame);
// ----- START THE GAME -----
createBoard();
startTimer();
