// Create a list with 8 different types of card symbols
const cardSymbols = [
    "fa-bolt",
    "fa-cube",
    "fa-bomb",
    "fa-leaf",
    "fa-anchor",
    "fa-diamond",
    "fa-bicycle",
    "fa-paper-plane-o",
    "fa-bolt",
    "fa-cube",
    "fa-bomb",
    "fa-leaf",
    "fa-anchor",
    "fa-diamond",
    "fa-bicycle",
    "fa-paper-plane-o"
];

// List with star symbols
let starSymbols = [
    "fa-star",
    "fa-star",
    "fa-star"
];

// Variables
let shuffledCards = [];
let openCards = [];
let matchedCards = [];
let symbol1 = "";
let symbol2 = "";
let counter = 0;
let card1 = null;
let card2 = null;
let totalCards = 16;
let busy;
let ul = document.getElementById('deck');
const fragment = document.createDocumentFragment();

let moves = document.querySelector('.moves');
let totalMoves = document.querySelector('.total-moves span');

const fragmentStars = document.createDocumentFragment();
let ulStars = document.querySelector('.stars');
let starsEarned = document.querySelector('.stars-earned span');
let numStars = 3;

let time = document.querySelector('time');
let totalTime = document.querySelector('.total-time span');
let dateStart = Date.now();
let seconds = 0;
let minutes = 0;
let t;

let resetButton = document.querySelector('.fa-repeat');

// Timer 
function timer() {
    let dateNow = Date.now();
    minutes = Math.floor(((dateNow - dateStart) / 1000) / 60);
    seconds = Math.floor((((dateNow - dateStart) - (minutes * 60 * 1000)) / 1000));
    
    time.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
}

function startTimer() {
    t = setInterval(timer, 1000);
}

function stopTimer() {
    clearInterval(t);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Shuffle all 16 symbols
function shuffleSymbols() {
    shuffle(cardSymbols);
}

// Create HTML for a 16-card deck and display it on the page
function createDeck() {
    // Remove deck if it exists
    $('.card').remove(); 

    cardSymbols.forEach(function(symbol) {
        let li = document.createElement('li');
        // CSS added to class 'card' to display cards facing down
        li.classList.add('card'); 
        
        let i = document.createElement('i');
        i.classList.add('fa');
        // Add each symbol as a class on each i element
        i.classList.add(symbol); 

        li.appendChild(i);
        fragment.appendChild(li);
        // Store all cards with their shuffled symbols in variable 'shuffledCards'
        shuffledCards.push(li); 
    });

    ul.appendChild(fragment);
}

// Create HTML for a 3-star score
function createStars() {
    // Remove stars if they exist
    $('.fa-star').remove(); 

    starSymbols.forEach(function(symbol) {
        let li = document.createElement('li');

        let i = document.createElement('i');
        i.classList.add('fa');
        i.classList.add(symbol);

        li.appendChild(i);
        fragmentStars.appendChild(li);
    });

    ulStars.appendChild(fragmentStars);
}

// Set up the event listener for each card in 'shuffledCards'
function setCardListener(callback) {
    shuffledCards.forEach(function(card) {
        card.onclick = callback; 
        // If a card is clicked:
    });
}

function moveCounter() {
        counter += 1;
        moves.textContent = counter;
}

function starRating() {
    if(counter === 15) {
        ulStars.removeChild(ulStars.lastChild);
        numStars -= 1;
    } else if(counter === 25) {
        ulStars.removeChild(ulStars.lastChild);
        numStars -= 1;
    } else if(counter === 30) {
        $('.fa-star').remove();
        numStars -= 1;
    }
}

function isSameSymbol(card1, card2){
    return card1.firstChild.className == card2.firstChild.className;
}

// Callback
function callback(evt) {
    if(busy || evt.target.tagName == 'I')
        return;

    const card = evt.target;

    // Start timer when the first card is clicked
    if(!t && counter === 0) {
        dateStart = Date.now();
        startTimer();
    }
    
    //Display the card's symbol
    card.classList.add('open', 'shows'); 
    
    // If card1 doesn't have a clicked card stored in it:
    if(!card1){
        // Add first clicked card to card1
        card1 = card;  
    }else{
        // Add second clicked card to card2
        card2 = card;

        // Add 1 to the move counter 
        moveCounter(); 
        // Delete 1 star when counter is 15, 25 or 30
        starRating();

        // Check to see if the two cards match
        if(card1 != card2){
            // If the cards match:
            if(isSameSymbol(card1, card2)){
                // Lock the cards in the open position by adding the 'match' class
                card1.classList.add('match');
                card2.classList.add('match');

                // Add both cards to a list of matched cards
                matchedCards.push(card1, card2);

                // If all cards match:
                if(matchedCards.length == totalCards)
                    gameEnds();

                // Empty open cards variables
                card1 = null;
                card2 = null;
            }
            // If the cards do not match:
            else {
                busy = true;

                setTimeout(function () {
                    // Hide both card's symbols
                    card1.classList.remove('open', 'shows'); 
                    card2.classList.remove('open', 'shows'); 

                    // Empty open cards variables
                    card1 = null;
                    card2 = null;
                    busy = false;
                }, 1000);
            }
        }
    }
}

resetButton.onclick = function() {
    stopTimer();
    newGame();
}

function gameEnds() {
    stopTimer();
    
    setTimeout(function() {
        totalMoves.textContent = counter;
        starsEarned.textContent = numStars;
        totalTime.textContent = time.textContent;
        // Display a message with the final score
        $('#myModal').modal('show');
    }, 200); 

    $('#yes').click(newGame);
}

function newGame(){
    // Reset variables
    time.textContent = "00:00";
    numStars = 3;
    seconds = 0;
    minutes = 0;
    counter = 0;
    t = null;
    dateStart = Date.now();
    moves.textContent = counter;
    matchedCards = [];
    // Call functions
    shuffleSymbols();
    createDeck();
    createStars();
    setCardListener(callback);
}
// Start new game
newGame();
