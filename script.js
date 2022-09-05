const btnRamColor = document.getElementById('button-random-color');
const board = document.getElementById('pixel-board');
const btnClearBoard = document.getElementById('clear-board');
const btnBoardSize = document.getElementById('generate-board');
const pixelDrawString = 'pixel drawn';
const pxTitle = document.getElementById('pixelsTitle');

function gerarPixels(num) {
  let value = num;
  if (value === 0) {
    if (localStorage.getItem('boardSize') !== null) {
      value = localStorage.getItem('boardSize');
      const result = Math.ceil(Math.sqrt(value));
      board.style.maxWidth = `${(40 * result) + (result + result)}px`;
      board.style.maxHeight = `${(40 * result) + (result + result)}px`;
    } else {
      value = 25;
    }
  }
  for (let i = 0; i < value; i += 1) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.id = i;
    board.appendChild(pixel);
  }
  const title = Math.ceil(Math.sqrt(value))
  pxTitle.innerHTML = `${title}x${title}`;
  localStorage.setItem('boardSize', value);
}

function removerPixels() {
  const pixels = document.getElementsByClassName('pixel');
  if (pixels.length > 0) {
    while (pixels.length > 0) {
      let i = 0;
      pixels[i].remove();
      i += 1;
    }
  }
}

// Paleta aleatoria mantida no localStorage

function saveColorData(array) {
  localStorage.setItem('colorPalette', JSON.stringify(array));
  if (array === 1) {
    const obj = {
      value0: [0, 0, 0],
      value1: [255, 0, 0],
      value2: [0, 255, 0],
      value3: [0, 0, 255],
    };
    localStorage.setItem('colorPalette', JSON.stringify(obj));
  }
}

function recuperarCores() {
  const storage = localStorage.getItem('colorPalette');
  const obj = JSON.parse(storage);
  const paletts = document.getElementsByClassName('color');
  paletts[0].style.backgroundColor = 'rgb(0,0,0)';
  for (let i = 1; i < paletts.length; i += 1) {
    paletts[i].style.backgroundColor = `rgb(${obj[`value${i}`].toString()})`;
  }
}

// Salvar e recuperar o desenho no locaslStorafge

const objPixelDraw = {};
function saveDraw(o, i) {
  if (o) {
    objPixelDraw[o] = [];
    objPixelDraw[o].push(i);
    localStorage.setItem('pixelBoard', JSON.stringify(objPixelDraw));
  }
}

function restoreDraw() {
  const storage = JSON.parse(localStorage.getItem('pixelBoard'));
  const pixels = board.children;

  for (let i = 0; i < pixels.length; i += 1) {
    if (storage[i]) {
      pixels[i].style.backgroundColor = storage[i].toString();
      pixels[i].classList = pixelDrawString;
    }
  }
}

// Gerar cores aleatorias
function gerarCoresAleatorias() {
  const paletts = document.getElementsByClassName('color');
  const obj = {};
  for (let i = 1; i < paletts.length; i += 1) {
    obj[`value${i}`] = [];
    for (let j = 0; j < 3; j += 1) {
      obj[`value${i}`].push(Math.floor(Math.random() * 255));
    }
    paletts[i].style.backgroundColor = `rgb(${obj[`value${i}`].toString()})`;
  }
  saveColorData(obj);
}
btnRamColor.addEventListener('click', gerarCoresAleatorias);

// Selecionar cor na paleta classe selected na cor

function selecionarCor() {
  const COLOR_CLASS = 'color selected';
  const sessaoPalett = document.getElementById('color-palette');
  const selected = document.getElementsByClassName(COLOR_CLASS);

  sessaoPalett.addEventListener('click', (event) => {
    const element = event.target;
    if (selected.length === 0) {
      element.classList = COLOR_CLASS;
    } else {
      selected[0].classList = 'color';
      element.classList = COLOR_CLASS;
    }
  });
}

// Preencher os pixels

board.addEventListener('click', (event) => {
  const corSelect = document.getElementsByClassName('color selected')[0].style.backgroundColor;
  const stylePixel = event.target.style.backgroundColor;
  const pixel = event.target;

  if (stylePixel !== corSelect) {
    pixel.style.backgroundColor = corSelect;
    pixel.classList = pixelDrawString;

    saveDraw(pixel.id, pixel.style.backgroundColor);
  }
});

// Restaurar do quadro

function ClearBoard() {
  const pixels = document.getElementsByClassName('pixel drawn');
  while (pixels.length > 0) {
    let pixel = 0;
    pixels[pixel].style.backgroundColor = 'white';
    pixels[pixel].classList = 'pixel';
    pixel += 1;
  }
  localStorage.removeItem('pixelBoard');
}
btnClearBoard.addEventListener('click', ClearBoard);

/* Bonus - Redimencionar quadro */
// Usuario escolher um novo tamanho para o quadro

function sizeBoard() {
  const input = document.querySelector('#board-size');
  if (input.value !== '' && input.value >= 5) {
    const result = input.value > 20 ? 20 : Number(input.value);
    removerPixels();
    board.style.maxWidth = `${(40 * result) + (result + result)}px`;
    board.style.maxHeight = `${(40 * result) + (result + result)}px`;
    gerarPixels(result * result);
  } else {
    alert('Board inválido!');
  }
}
btnBoardSize.addEventListener('click', sizeBoard);

function load() {
  gerarPixels(0);
  if (localStorage.getItem('colorPalette') === null) {
    saveColorData(1);
  }
  recuperarCores();
  if (localStorage.getItem('pixelBoard') === null) {
    saveDraw(false);
  } else {
    restoreDraw();
  }
  selecionarCor();
}

window.onload = load;
