const drawButton = document.getElementById('drawButton');
const result = document.getElementById('result');
const cardImage = document.getElementById('cardImage');
const cardName = document.getElementById('cardName');
const cardOrientation = document.getElementById('cardOrientation');
const cardKeywords = document.getElementById('cardKeywords');
const cardMeaning = document.getElementById('cardMeaning');
const cardList = document.getElementById('cardList');
const cardItemTemplate = document.getElementById('cardItemTemplate');

const BACK_IMAGE_PATH = 'assets/back/back_mirror_tarot_adopted.png';
let cards = [];

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function drawOneCard() {
  if (!cards.length) return;

  const card = pickRandom(cards);
  const isReversed = Math.random() < 0.5;
  const orientation = isReversed ? '逆位置 (Reversed)' : '正位置 (Upright)';
  const meaning = isReversed ? card.reversed_meaning : card.upright_meaning;
  const keywords = isReversed ? card.reversed_keywords : card.upright_keywords;

  cardImage.src = card.image;
  cardImage.alt = `${card.name_en} - ${orientation}`;
  cardImage.style.transform = isReversed ? 'rotate(180deg)' : 'none';

  cardName.textContent = `${card.roman} ${card.name_en} / ${card.name_ja}`;
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
  image.alt = card.name_en;
  image.onerror = () => {
    image.src = BACK_IMAGE_PATH;
    image.alt = `${card.name_en} (back image fallback)`;
  };
  name.textContent = `${card.roman} ${card.name_en} / ${card.name_ja}`;

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
function createTwinkleStars() {
  const layer = document.querySelector('.twinkle-layer');
  if (!layer) return;

  layer.innerHTML = "";

  const symbols = ['✦', '✧', '✶', '⋆'];
  const starCount = 42;

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement('span');

    star.className = 'twinkle-star';
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.setProperty('--star-size', `${10 + Math.random() * 12}px`);

    // マイナス遅延にすると、ページを開いた瞬間からどこかが光ってる状態になる
    star.style.setProperty('--star-delay', `${-Math.random() * 4}s`);

    // 早めにチカチカする
    star.style.setProperty('--star-duration', `${1.8 + Math.random() * 2.4}s`);
    star.style.setProperty('--star-rotate', `${Math.random() * 90}deg`);

    layer.appendChild(star);
  }
}

createTwinkleStars();
