const drawButton = document.getElementById('drawButton');
const result = document.getElementById('result');
const cardImage = document.getElementById('cardImage');
const cardName = document.getElementById('cardName');
const cardOrientation = document.getElementById('cardOrientation');
const cardKeywords = document.getElementById('cardKeywords');
const cardMeaning = document.getElementById('cardMeaning');
const cardList = document.getElementById('cardList');
const cardItemTemplate = document.getElementById('cardItemTemplate');

const BACK_IMAGE_PATH = 'assets/back/card-back.png';
let cards = [];

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function drawOneCard() {
  if (!cards.length) return;

  const card = pickRandom(cards);
  const isReversed = Math.random() < 0.5;
  const orientation = isReversed ? '逆位置 (Reversed)' : '正位置 (Upright)';
  const meaning = isReversed ? card.meaningReversed : card.meaningUpright;
  const keywords = isReversed ? card.keywordsReversed : card.keywordsUpright;

  cardImage.src = card.image;
  cardImage.alt = `${card.name} - ${orientation}`;
  cardImage.style.transform = isReversed ? 'rotate(180deg)' : 'none';

  cardName.textContent = card.name;
  cardOrientation.textContent = orientation;
  cardKeywords.textContent = `Keywords: ${keywords.join(' / ')}`;
  cardMeaning.textContent = meaning;

  result.classList.remove('hidden');
}

function createCardListItem(card) {
  const node = cardItemTemplate.content.cloneNode(true);
  const image = node.querySelector('.card-item__img');
  const name = node.querySelector('.card-item__name');

  image.src = card.image;
  image.alt = card.name;
  image.onerror = () => {
    image.src = BACK_IMAGE_PATH;
    image.alt = `${card.name} (back image fallback)`;
  };
  name.textContent = card.name;

  return node;
}

async function setup() {
  const response = await fetch('cards.json');
  cards = await response.json();

  const fragment = document.createDocumentFragment();
  cards.forEach((card) => fragment.appendChild(createCardListItem(card)));
  cardList.appendChild(fragment);

  drawButton.addEventListener('click', drawOneCard);
}

setup().catch((error) => {
  console.error('Failed to load cards:', error);
});
