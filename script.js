//MEMORY GAME
const gameBoard = document.getElementById('game-board'); //this is where the cards will live
const scoreDisplay = document.getElementById('score'); // where we show the player's score
const timerDisplay = document.getElementById('timer'); // where the countdown timer shows up
const messageDisplay = document.getElementById('message'); //where win/lose messages appear
const restartBtn = document.getElementById('restart-btn'); // the restart button
let cardsArray = ['A','B','C','D','E','F','H','I']; //8 different symbols for our cards
let cardValues = [...cardsArray, ...cardsArray]; // make two of each one so we have matching pairs
let flippedCards = []; //cards that are currently face-up
let matchedCards = []; //cards that have already been matched
let score = 0; // player's score starts at zero
let time = 60; // game lasts 60 seconds
let timerId; // we'll store our timer here so we can stop it later
let flipTimeout; // used to flip cards back if player takes too long
// MIXING UP THE CARDS 
function shuffle(array) {
    // start from the last card and work backwards
    for(let i = array.length - 1; i > 0; i--){
        // pick a random card from the ones we haven't shuffled yet
        const j = Math.floor(Math.random() * (i + 1));
        // swap the current card with the randomly picked one
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array; // give back the nicely shuffled deck
}

// SETTING UP THE GAME BOARD
function createBoard() {
    // mix up the cards so they're in random order
    cardValues = shuffle(cardValues);

    //create each card and put it on the board
    for(let i = 0; i < cardValues.length; i++){
        const card = document.createElement('div'); //make a new card element
        card.classList.add('card'); // give it the "card" style
        card.setAttribute('data-value', cardValues[i]); // remember what symbol is on this card
        card.innerText = ''; // start with the card face-down (no text showing)

        //when clicked, it'll flip over
        card.addEventListener('click', flipCard);

        //put this card on the game board
        gameBoard.appendChild(card);
    }
}

//WHAT HAPPENS WHEN YOU CLICK A CARD 
function flipCard() {
    // Only flip if: we haven't flipped 2 cards already, this card isn't flipped, and it's not already matched
    if(flippedCards.length < 2 && !this.classList.contains('flip') && !matchedCards.includes(this)){
        this.classList.add('flip'); // add the flip animation
        this.innerText = this.getAttribute('data-value'); // show what's on the card
        flippedCards.push(this); // remember that this card is now face-up
        
        // if this is the first card flipped, start a 2-second timer
        if(flippedCards.length === 1){
            flipTimeout = setTimeout(() => {
                // if after 2 seconds, only one card is flipped, flip it back
                if(flippedCards.length === 1){
                    const [firstCard] = flippedCards; // get that lonely first card
                    firstCard.classList.remove('flip'); // flip it back over
                    firstCard.innerText = ''; // hide the symbol again
                    flippedCards = []; // forget about it
                }
            }, 2000); // wait 2 seconds
        }

        // if we now have 2 cards flipped, check if they match
        if(flippedCards.length === 2){
            clearTimeout(flipTimeout); // stop the 2-second timer
            setTimeout(checkMatch, 300); // wait a tiny bit so player can see both cards
        }
    }
}

//CHECKING IF TWO CARDS MATCH 
function checkMatch() {
    // get the two cards that are currently face-up
    const [card1, card2] = flippedCards;
    // do these cards have the same symbol?
    if(card1.getAttribute('data-value') === card2.getAttribute('data-value')){
        matchedCards.push(card1, card2); // remember these are matched
        score += 12.5; // add points (100 total / 8 pairs = 12.5 per pair)
        scoreDisplay.innerText = `Score: ${score}`; // update the score display
    } else {
        card1.classList.remove('flip'); // flip them back over
        card2.classList.remove('flip');
        card1.innerText = ''; // hide the symbols
        card2.innerText = '';
    }

    // reset for the next turn
    flippedCards = [];

    // check if all cards are matched (did we win?)
    if(matchedCards.length === cardValues.length){
        endGame(true); 
    }
}

//THE COUNTDOWN TIMER 
function startTimer() {
    // every second, do this:
    timerId = setInterval(() => {
        time--; // count down one second
        timerDisplay.innerText = `Time: ${time}s`; // update the timer display
        // did we run out of time?
                // Color changes based on time left
        if (time <= 10) {
            timerDisplay.style.color = 'red'; // red when time is critical
            timerDisplay.style.fontWeight = 'bold';
        } else if (time <= 30) {
            timerDisplay.style.color = 'orange'; // orange when time is low
        } else {
            timerDisplay.style.color = 'green'; // green when plenty of time
        }
        
        timerDisplay.innerText = `Time: ${time}s`;
        if(time <= 0){
            endGame(false); // time's up, game over
        }
    }, 1000); // run every 1000 milliseconds (that's 1 second)
}
//ENDING THE GAME 
function endGame(win) {
    clearInterval(timerId); // stop the timer

    // show a message depending on whether we won or lost
    if(win){
        messageDisplay.innerText = 'You Win! ';
    } else {
        messageDisplay.innerText = 'Time Up! Game Over ';
    }
    // make all cards unclickable
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.removeEventListener('click', flipCard));
}
//STARTING OVER 
function restartGame() {
    // reset everything to how it was at the beginning
    flippedCards = [];
    matchedCards = [];
    score = 0;
    time = 60;
    
    // update all the displays
    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Time: ${time}s`;
    messageDisplay.innerText = '';

    //stop any timers that might still be running
    clearInterval(timerId);
    clearTimeout(flipTimeout);

    //clear the game board
    gameBoard.innerHTML = '';

    //set everything up again
    createBoard();
    startTimer();
}

//MAKE THE RESTART BUTTON WORK
restartBtn.addEventListener('click', restartGame);
createBoard(); // Set up the cards
startTimer(); // Start the countdown
