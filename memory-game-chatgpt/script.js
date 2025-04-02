// Memory Game in JavaScript

document.addEventListener("DOMContentLoaded", () => {
  const cardsArray = ["🍎", "🍌", "🍉", "🍇", "🍓", "🍒", "🍍", "🥝"]; // Fruit emojis
  let gameGrid = [...cardsArray, ...cardsArray]; // Duplicate to create pairs
  const matchColors = [
    "#FFDDC1",
    "#FFABAB",
    "#FFC3A0",
    "#D5AAFF",
    "#FACA1E",
    "#B9FBC0",
    "#E9CA01",
    "#FF9CEE",
  ];
  let colorMap = {};
  let wrongColorMap = {};

  const wrongColor = "#DD0000";

  // Shuffle function using Fisher-Yates algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  gameGrid = shuffle(gameGrid);

  const gameBoard = document.getElementById("game-board");
  const message = document.getElementById("win-message");
  const resetButton = document.getElementById("reset-button");
  const triesMessage = document.getElementById("tries");
  const triesNumber = document.getElementById("tries-number");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matches = 0;
  let tries = 0;

  // Assign unique background colors to each match pair
  cardsArray.forEach((emoji, index) => {
    colorMap[emoji] = matchColors[index];
    console.log(colorMap, matchColors);
  });

  // Function to create cards dynamically
  function createBoard() {
    gameBoard.innerHTML = ""; // Clear the board
    matches = 0;
    gameGrid.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = item;
      card.innerHTML = "?"; // Hidden state
      card.style.animation = `fadeIn 0.3s ease ${index * 0.03}s forwards`;
      card.style.opacity = "0";
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
      function gameStartAudio() {
        const gameStart = new Audio("game-start.wav");
        gameStart.volume = 0.05;
        gameStart.autoplay = true;
      }
      gameStartAudio();
    });
    message.style.visibility = "hidden";
    // resetButton.style.visibility = "hidden";

    triesMessage.style.visibility = "hidden";
  }

  // Function to flip a card
  function flipCard() {
    if (lockBoard || this === firstCard) return;
    function playClickSound() {
      const clickSound = new Audio("click.wav");
      clickSound.play();
    }
    playClickSound();
    tries++;

    this.innerHTML = this.dataset.value; // Show value
    this.classList.add("flipped");

    if (!firstCard) {
      firstCard = this;
    } else {
      secondCard = this;
      lockBoard = true;
      checkForMatch();
    }
  }

  // Function to check for a match
  function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      animateMatch(firstCard, secondCard);
      disableCards();
      function playCorrectSound() {
        // const correctSound = new Audio("correct.mp3");
        const correctSound = document.getElementById("correct-sound");
        correctSound.load();
        correctSound.play();
      }
      setTimeout(() => {
        playCorrectSound();
      }, 750);
      matches++;
      if (matches === cardsArray.length) {
        showWinMessage();
        triesMessage.visibility = "visible";
        triesNumber.innerText = tries;
        setTimeout(() => {
          gameBoard.classList.add("blurred");
        }, 1200);
      }
    } else {
      animateWrong(firstCard, secondCard);
      setTimeout(() => {
        unflipCards();
        function playWrongSound() {
          const wrongSound = new Audio("wrong.mp3");
          wrongSound.play();
        }
        playWrongSound();
      }, 500);
    }
  }

  // Function to animate matched cards
  function animateMatch(card1, card2) {
    setTimeout(() => {
      let bgColor = colorMap[card1.dataset.value];
      card1.style.backgroundColor = bgColor;
      card2.style.backgroundColor = bgColor;
      card1.classList.add("match-animation");
      card2.classList.add("match-animation");
    }, 750);
    setTimeout(() => {
      card1.classList.remove("match-animation");
      card2.classList.remove("match-animation");
    }, 750);
  }

  function animateWrong(card1, card2) {
    setTimeout(() => {
      card1.style.backgroundColor = wrongColor;
      card2.style.backgroundColor = wrongColor;
      card1.classList.add("wrong-animation");
      card2.classList.add("wrong-animation");
    }, 700);
    setTimeout(() => {
      card1.classList.remove("wrong-animation");
      card1.style.backgroundColor = "";
      card2.style.backgroundColor = "";
      card2.classList.remove("wrong-animation");
    }, 1200);
  }

  // Function to disable matched cards
  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
  }

  // Function to unflip unmatched cards
  function unflipCards() {
    setTimeout(() => {
      firstCard.innerHTML = "?";
      secondCard.innerHTML = "?";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 700);
  }

  // Function to reset board state
  function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // Function to display win message
  function showWinMessage() {
    setTimeout(() => {
      message.style.visibility = "visible";
      resetButton.style.visibility = "visible";
      triesMessage.style.visibility = "visible";
    }, 1200);
    function playWinSound() {
      const winSound = new Audio("win.mp3");
      winSound.play();
    }
    setTimeout(() => {
      playWinSound();
    }, 1200);
  }

  // Function to reset the game
  resetButton.addEventListener("click", () => {
    gameGrid = shuffle([...cardsArray, ...cardsArray]);
    createBoard();
    console.clear();
    slice();
    tries = 0;
    gameBoard.classList.remove("blurred");
  });

  // Initialize the game
  function slice() {
    for (let i = 0; i < gameGrid.length; i++) {
      if (i % 4 === 0) {
        console.log(gameGrid.slice(i, i + 4));
        // console.log(i);
      }
    }
  }
  slice();
  // console.log(gameGrid.slice(0, 4));
  createBoard();

  // Apply a fruit-themed emoji background
  document.body.classList.add("emoji-background");
});
