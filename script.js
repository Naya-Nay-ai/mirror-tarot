const BACK_IMAGE_PATH = 'assets/back/back_mirror_tarot_adopted.png';

const elements = {
  drawButton: document.getElementById('drawButton'),
  deckPreview: document.getElementById('deckPreview'),
  result: document.getElementById('result'),
  cardImage: document.getElementById('cardImage'),
  cardName: document.getElementById('cardName'),
  cardOrientation: document.getElementById('cardOrientation'),
  cardKeywords: document.getElementById('cardKeywords'),
  cardMeaning: document.getElementById('cardMeaning'),
  cardList: document.getElementById('cardList'),
  cardItemTemplate: document.getElementById('cardItemTemplate'),

  cardModal: document.getElementById('cardModal'),
  cardModalClose: document.getElementById('cardModalClose'),
  modalCardImage: document.getElementById('modalCardImage'),
  modalCardNumber: document.getElementById('modalCardNumber'),
  modalCardName: document.getElementById('modalCardName'),
  modalUprightKeywords: document.getElementById('modalUprightKeywords'),
  modalUprightMeaning: document.getElementById('modalUprightMeaning'),
  modalReversedKeywords: document.getElementById('modalReversedKeywords'),
  modalReversedMeaning: document.getElementById('modalReversedMeaning'),
　twinkleLayer: document.querySelector('.twinkle-layer'),
};

let cards = [];

/* ===========================
   Utilities
   =========================== */

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getCardDisplayName(card) {
  return `${card.roman} ${card.name_en} / ${card.name_ja}`;
}

function getCardCatalogName(card) {
  return `
    <span class="card-item__name-en">${card.roman} ${card.name_en}</span>
    <span class="card-item__name-ja">${card.name_ja}</span>
  `;
}

/* ===========================
   One card draw
   =========================== */

function revealResult() {
  elements.deckPreview.classList.add('is-hidden');
  elements.drawButton.classList.add('is-hidden');

  elements.result.classList.remove('hidden');
  elements.result.classList.remove('is-revealing');

  void elements.result.offsetWidth;

  elements.result.classList.add('is-revealing');
}

function drawOneCard() {
  if (!cards.length) return;

  const card = pickRandom(cards);
  const isReversed = Math.random() < 0.5;

  const orientation = isReversed ? '逆位置 (Reversed)' : '正位置 (Upright)';
  const keywords = isReversed ? card.reversed_keywords : card.upright_keywords;
  const meaning = isReversed ? card.reversed_meaning : card.upright_meaning;

  elements.cardImage.src = card.image;
  elements.cardImage.alt = `${card.name_en} - ${orientation}`;
  elements.cardImage.style.transform = isReversed ? 'rotate(180deg)' : 'none';

  elements.cardName.textContent = getCardDisplayName(card);
  elements.cardOrientation.textContent = orientation;
  elements.cardKeywords.textContent = `Keywords: ${keywords.join(' / ')}`;
  elements.cardMeaning.textContent = meaning;
  
  revealResult();
}

/* ===========================
   Card catalog modal
   =========================== */

function openCardModal(card) {
  elements.modalCardImage.src = card.image;
  elements.modalCardImage.alt = `${card.name_en} / ${card.name_ja}`;

  elements.modalCardNumber.textContent = `Major Arcana ${card.roman}`;
  elements.modalCardName.textContent = `${card.name_en} / ${card.name_ja}`;

  elements.modalUprightKeywords.textContent = card.upright_keywords.join(' / ');
  elements.modalUprightMeaning.textContent = card.upright_meaning;

  elements.modalReversedKeywords.textContent = card.reversed_keywords.join(' / ');
  elements.modalReversedMeaning.textContent = card.reversed_meaning;

  elements.cardModal.showModal();
}

function closeCardModal() {
  elements.cardModal.close();
}

function setupModalEvents() {
  elements.cardModalClose.addEventListener('click', closeCardModal);

  elements.cardModal.addEventListener('click', (event) => {
    if (event.target === elements.cardModal) {
      closeCardModal();
    }
  });
}

/* ===========================
   Card catalog
   =========================== */

function createCardListItem(card) {
  const node = elements.cardItemTemplate.content.cloneNode(true);
  const item = node.querySelector('.card-item');
  const image = node.querySelector('.card-item__img');
  const name = node.querySelector('.card-item__name');

  image.src = card.image;
  image.alt = card.name_en;

  image.onerror = () => {
    image.src = BACK_IMAGE_PATH;
    image.alt = `${card.name_en} (back image fallback)`;
  };

  name.innerHTML = getCardCatalogName(card);

  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `${card.name_en} / ${card.name_ja} の詳細を見る`);

  item.addEventListener('click', () => {
    openCardModal(card);
  });

  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCardModal(card);
    }
  });

  return node;
}

function renderCardCatalog() {
  const fragment = document.createDocumentFragment();

  cards.forEach((card) => {
    fragment.appendChild(createCardListItem(card));
  });

  elements.cardList.appendChild(fragment);
}

/* ===========================
   Twinkle stars
   =========================== */

function pickStarPosition() {
  const isMobile = window.innerWidth < 760;
  const r = Math.random();

  if (isMobile) {
    if (r < 0.35) {
      return { x: Math.random() * 20, y: Math.random() * 100 };
    }

    if (r < 0.7) {
      return { x: 80 + Math.random() * 20, y: Math.random() * 100 };
    }

    if (r < 0.85) {
      return { x: 8 + Math.random() * 84, y: Math.random() * 16 };
    }

    return { x: 8 + Math.random() * 84, y: 84 + Math.random() * 12 };
  }

  if (r < 0.4) {
    return { x: Math.random() * 18, y: Math.random() * 100 };
  }

  if (r < 0.8) {
    return { x: 82 + Math.random() * 18, y: Math.random() * 100 };
  }

  if (r < 0.9) {
    return { x: 10 + Math.random() * 80, y: Math.random() * 14 };
  }

  return { x: 10 + Math.random() * 80, y: 86 + Math.random() * 10 };
}

function createTwinkleStars() {
  if (!elements.twinkleLayer) return;

  elements.twinkleLayer.innerHTML = '';

  const symbols = ['✦', '✧', '✶', '⋆'];
  const starCount = 90;

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement('span');
    const position = pickStarPosition();

    star.className = 'twinkle-star';
    star.textContent = pickRandom(symbols);

    star.style.left = `${position.x}%`;
    star.style.top = `${position.y}%`;
    star.style.setProperty('--star-size', `${9 + Math.random() * 10}px`);
    star.style.setProperty('--star-delay', `${-Math.random() * 14}s`);
    star.style.setProperty('--star-duration', `${8 + Math.random() * 8}s`);
    star.style.setProperty('--star-rotate', `${Math.random() * 90}deg`);

    elements.twinkleLayer.appendChild(star);
  }
}

/* ===========================
   Setup
   =========================== */

async function setupCards() {
  const response = await fetch('cards.json');
  cards = await response.json();

  renderCardCatalog();
  elements.drawButton.addEventListener('click', drawOneCard);
}

function setup() {
  createTwinkleStars();
  setupModalEvents();
  setupCards().catch((error) => {
    console.error('Failed to load cards:', error);
  });
}

setup();
