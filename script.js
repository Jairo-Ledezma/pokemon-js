'use strict';
//objects
const backgrounds = {
  1: 'fire-background.jpg',
  2: 'leaf-background.jpg',
  3: 'electric-background.jpg',
  4: 'normal-background.jpg',
  5: 'leaf-background.jpg',
  6: 'pink-background.jpg',
  7: 'leaf-background.jpg',
};

const pokemonNames = [
  'Charmander',
  'Bulbasaur',
  'Pikachu',
  'Eve',
  'Chikorita',
  'Jigglypuff',
  'Caterpie',
];

// interactible elements
const attackButton = document.querySelector('.attack-button');
const catchButton = document.querySelector('.catch-button');
const fightScene = document.querySelector('.fight-sequence.hidden');
const map = document.querySelector('.map-section');
const pokemon = document.querySelector('.pokemon');
const text = document.getElementById('text');
const pokemonImage = document.querySelector('.pokemonImage');
const runButton = document.querySelector('.run-button');
const mapMusic = document.getElementById('palet-town');
const battleMusic = document.getElementById('in-battle');
let lifeText = document.querySelector('.life-amount');
let pokemonCaughtCountEl = document.getElementById('pokemon-caught');
const startGameButton = document.getElementById('start-game-button');
const overlay = document.getElementById('overlay');

//Variables
let pokemonCaught = 0;
const grassAreas = [
  {
    topLeft: 615,
    topRight: 1432,
    bottomLeft: 355,
    bottomRight: 407,
  },
  {
    topLeft: 315,
    topRight: 850,
    bottomLeft: 720,
    bottomRight: 776,
  },
  {
    topLeft: 312,
    topRight: 371,
    bottomLeft: 783,
    bottomRight: 838,
  },
  {
    topLeft: 1248,
    topRight: 1300,
    bottomLeft: 554,
    bottomRight: 639,
  },
];

let fighting = false;
let pokemonLife = 0;
let pokemonNumber = 0;

//functions
//overlay function

const overlayOn = function (overlayText, image) {
  fighting = true;
  battleMusic.pause();
  document.getElementById('overlay-text').textContent = overlayText;
  overlay.classList.remove('overlay-hidden');
  startGameButton.src = image;
};

function overlayOff() {
  fighting = true;
  overlay.classList.add('overlay-hidden');
}

//this method switches to the map scene
const switchMapScene = function () {
  overlayOff();
  fighting = false;
  mapMusic.play();
  battleMusic.pause();
  battleMusic.currentTime = 0;
  document.querySelector('body').style = '';
  fightScene.classList.add('hidden');
  map.classList.remove('hidden');
  pokemon.classList.add('hidden');
  pokemon.classList.remove('flex');
  text.textContent =
    'This world is inhabited by creatures we call Pokemon.....';
};

const startGame = function (text, image) {
  fighting = true;
  overlayOn(text, image);
  startGameButton.addEventListener('click', switchMapScene);
};

startGame('Tap on the pokeball to start the game', 'pokeball.png');
// this method switches to the fight scene
const switchfightScene = function () {
  fighting = true;
  mapMusic.pause();
  mapMusic.currentTime = 0;
  battleMusic.play();
  fightScene.classList.remove('hidden');
  map.classList.add('hidden');
  pokemon.classList.remove('hidden');
  pokemon.classList.add('flex');
  pokemonNumber = Math.trunc(Math.random() * 7) + 1;
  text.textContent = `---A wild ${
    pokemonNames[pokemonNumber - 1]
  } has appeared!---`;
  pokemonImage.src = `pokemon-${pokemonNumber}.png`;
  document.body.style.backgroundImage = `url('${backgrounds[pokemonNumber]}')`;
  document.body.style.backgroundRepeat = 'repeat-y';
  document.body.style.backgroundSize = '100%';
  pokemonLife = Math.trunc(Math.random() * 100) + 1;
  lifeText.textContent = `${
    pokemonNames[pokemonNumber - 1]
  }'s HP : ${pokemonLife}`;
};

//this method generates a radom number and deducts it from the
//pokemon's life if the pokemon's life run to 0
//the user gets redirected to the map

//work here!!!!
const attack = function () {
  console.log('test');
  const damage = Math.trunc(Math.random() * 10) + 1;
  if (pokemonLife - damage > 0) {
    pokemonLife -= damage;
    lifeText.textContent = `${
      pokemonNames[pokemonNumber - 1]
    }'s HP : ${pokemonLife}`;
  } else if (pokemonLife - damage <= 0) {
    overlayOn(
      'The pokemon fainted and cant be caught ,click the pokeball to continue',
      'pokeball.png'
    );
    startGameButton.addEventListener('click', switchMapScene);
  }
};

//this methods receives the clicks and tests wether the click is inside a mapped zone then determines wether a
//pokemon should appear or not
const isThereAFight = function (event) {
  if (fighting == false) {
    const pokemonChance = Math.trunc(Math.random() * 5) + 1;
    console.log(pokemonChance);
    let x = event.pageX;
    let y = event.pageY;
    for (const obj of grassAreas) {
      if (
        x > obj.topLeft &&
        x < obj.topRight &&
        y > obj.bottomLeft &&
        y < obj.bottomRight &&
        pokemonChance == 2
      ) {
        switchfightScene();
        break;
      }
    }
  }
};

//this method generates a random number betwen 1 and 2
// for the pokemon to be captured its life has to be lower than
//40 and the random number must be a 1 if these conditions are met
// an alert is displayed telling the user the pokemon was caught
// increases the pokemon caught counter and redirects the user
// to the map if these conditions are not met an alert is displayed
// telling the user the pokemon has escaped
const catchPokemon = function () {
  const chance = Math.trunc(Math.random() * 2) + 1;
  if (chance == 1 && pokemonLife < 40) {
    overlayOn(
      'You caught the pokemon!!, click on the pokeball to continue',
      'pokeball.png'
    );
    startGameButton.addEventListener('click', switchMapScene);
    pokemonCaught++;
    pokemonCaughtCountEl.textContent = String(
      `pokemon caught: ${pokemonCaught}`
    );
  } else {
    overlayOn(
      'The pokemon escaped, click the pokeball to continue!',
      'open-pokeball.jpg'
    );
    startGameButton.addEventListener('click', overlayOff); // work here
  }
};

//run method
const run = function () {
  const chance = Math.trunc(Math.random() * 4) + 1;
  if (chance > 2) {
    overlayOn('you escaped!', 'run.png');
    startGameButton.addEventListener('click', switchMapScene);
  } else {
    overlayOn(`you couldn't escape`, 'no-escape.JPG');
    startGameButton.addEventListener('click', overlayOff); // work here
  }
};

//event listeners for the buttons
attackButton.addEventListener('click', attack);
catchButton.addEventListener('click', catchPokemon);
runButton.addEventListener('click', run);

//this determines wether a fight scene should be executed or not based on where the user clicks
document.addEventListener('click', isThereAFight);

/*
const box = document.querySelector('.box');
const pageX = document.getElementById('x');
const pageY = document.getElementById('y');

function updateDisplay(event) {
  pageX.innerText = event.pageX;
  pageY.innerText = event.pageY;
}

box.addEventListener('mousemove', updateDisplay, false);
box.addEventListener('mouseenter', updateDisplay, false);
box.addEventListener('mouseleave', updateDisplay, false);
*/
