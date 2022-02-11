const DOWN = 'down';
const UP = 'up';
let startingX = 100;
let startingY = 100;
let cards = [];
const gameState = {
  totalPairs: 6,
  flippedCards: [],
  numMatched: 0,
  attempts: 0,
  waiting: false
};
let cardfaceArray = [];
let cardback;
function preload () {
  cardback = loadImage('images/cardback.png');
  cardfaceArray = [
    loadImage('images/gene3.png'),
    loadImage('images/gene2.png'),
    loadImage('images/gene1.png'),
    loadImage('images/clare3.png'),
    loadImage('images/clare2.png'),
    loadImage('images/clare1.png')
  ]
}
function setup () {
  createCanvas(900, 790);
  let selectedFaces = [];
  // cardface pairs- [] & push 2x cuz pairs
  for (let z = 0; z < 6; z++) {
    const randomIdx = floor(random(cardfaceArray.length));
    const face = cardfaceArray[randomIdx];
    selectedFaces.push(face);
    selectedFaces.push(face);
    // remove the used cardface so it doesn't get randomly selected again
    cardfaceArray.splice(randomIdx, 1);
  }
  // grid array
  selectedFaces = shuffleArray(selectedFaces);
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 4; i++) {
      const faceImage = selectedFaces.pop();
      cards.push(new Card(startingX, startingY, faceImage));
      startingX += 185;
    }
    startingY += 210;
    startingX = 100;
  }
}
function draw () {
  background('#2b2b2b');
  // Title
  textFont('Oswald', 'sans-serif');
  textSize(39);
  noStroke();
  fill('#fff3e3');
  //text('CLARE & GENE MATCH GAME', 300, 80);
  text('MATCH GENE & CLARE', 286, 80);
  // box-left-attempts
  noFill(); 
  stroke('#fff3e3');
  strokeWeight(3);
  rect(100, 726, 190, 40);
  // box-right-matches
  noFill();
  stroke('#fff3e3');
  strokeWeight(3);
  rect(290, 726, 190, 40);
  strokeWeight(0);
 

  if (gameState.numMatched === gameState.totalPairs) {
    fill('#f5762f');
    textSize(55);
    textFont('Oswald', 'sans-serif');
    textStyle(BOLD);
    //text('All MATCHED!!', 55, 80);
    //text('WELL DONE!!', 640, 80);
    text('HAPPY', 120, 80);
    //text('HAPPY', 150, 80);
    text('BIRTHDAY!!', 623, 80);
    // this no work fill('#2b2b2b');
    // this no work- rect(400, 100, 100, 100);
    noFill();
  }
  for (let k = 0; k < cards.length; k++) {
    if (!cards[k].isMatch) {
      cards[k].face = DOWN;
    }
    cards[k].show(); // redraw the card call show(fxn) and it will redraw tile
  }
  // draw scoreboard
  noLoop();
  gameState.flippedCards.length = 0;
  gameState.waiting = false;
  fill('#fff3e3');
  textSize(30);
  textStyle(NORMAL);
  text('Attempts:  ' + gameState.attempts, 120, 758);
  text('Matches:  ' + gameState.numMatched, 310, 758);
}

function mousePressed () {
  if (gameState.waiting) {
    return;
  }
  for (let k = 0; k < cards.length; k++) {
    // first check flipped cards length, and then
    // we can trigger the flip
    if (gameState.flippedCards.length < 2 && cards[k].didHit(mouseX, mouseY)) {
      console.log('flipped', cards[k]);
      gameState.flippedCards.push(cards[k]);
    }
  }
  if (gameState.flippedCards.length === 2) {
    gameState.attempts++;
    if (gameState.flippedCards[0].cardFaceImg === gameState.flippedCards[1].cardFaceImg) {
    // 2 cards below-cards match! Time to score!
    // mark cards as matched so they don't flip back
      gameState.flippedCards[0].isMatch = true;
      gameState.flippedCards[1].isMatch = true;
      // empty the flipped cards array-this way is a shortcut-can do this instead of splicing
      gameState.flippedCards.length = 0;
      // increment the score
      gameState.numMatched++;
      loop();
    } else {
      gameState.waiting = true;
      const loopTimeout = window.setTimeout(() => {
        loop();
        window.clearTimeout(loopTimeout);
      }, 2000)
    }
  }
}

class Card {
  constructor (x, y, cardFaceImg) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 175;
    this.face = DOWN;
    this.cardFaceImg = cardFaceImg;
    this.isMatch = false;
    this.show();
  }

  show () {
    // show ()face of card was clicked or if cards have already been matched
    if (this.face === UP || this.isMatch) {
      rect(this.x, this.y, this.width, this.height, 10);
      image(this.cardFaceImg, this.x, this.y);
    } else {
    // show () card back
      rect(this.x, this.y, this.width, this.height, 10);
      image(cardback, this.x, this.y, this.width, this.height);
    }
  }

  // check for rect hits w/ nouse click
  didHit (mouseX, mouseY) {
    if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
      this.flip();
      return true;
    } else {
      return false;
    }
  }

  flip () {
    if (this.face === DOWN) {
      this.face = UP;
    } else {
      this.face = DOWN;
    }
    this.show();
  }
}

/*https://blog.gyanendra.tech/10-awesome-javascript-one-liners-635687a94f7 
const shuffle =(array) => array.sort(() => Math.random() - 0.5);
shuffle([3,7,6,5])
// [7, 5, 3, 6] 
*/

function shuffleArray (array) {
  let counter = array.length;
  while (counter > 0) {
    // Pick random index
    const idx = Math.floor(Math.random() * counter);
    // decrease counter by 1 (decrement)
    counter--;
    // swap the last element with it
    const temp = array[counter];
    array[counter] = array[idx];
    array[idx] = temp;
  }
  return array;
}
