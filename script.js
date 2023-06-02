// prettier-ignore
let board = [ 0, 1, 2, 
              3, 4, 5, 
              6, 7, 8 ];

const O = 'O',
  X = 'X';

drawTheInterface3X3();

let firstStep = 'Bot';
// 1 бот ходить Нулем || 0 бот ходить Хрестиком
let botMode = 1;

const checkBoxX = document.getElementById('checkBoxX');
checkBoxX.addEventListener('click', () => {
  checkBoxO.checked = false;
  reset();
});
const checkBoxO = document.getElementById('checkBoxO');
checkBoxO.addEventListener('click', () => {
  checkBoxX.checked = false;
  reset();
});

if (checkBoxO.checked) firstStep = 'Bot';
if (checkBoxX.checked) firstStep = '!Bot';
if (
  (checkBoxX.checked && checkBoxO.checked) ||
  (!checkBoxX.checked && !checkBoxO.checked)
)
  firstStep = 'Duel';

//получаєм інформацію із поля хто ходить
const stepInfoText = document.querySelector('.stepInfo');
//получаєм доступ до усіх квадратиків
const arrCheckBox = document.querySelectorAll('.check');

const resetButton = document.getElementsByClassName('resetButton');

resetButton[0].addEventListener('click', () => {
  reset();
});

arrCheckBox.forEach((element, index) => {
  element.addEventListener('click', () => {
    if (findEmptyCells(board).length === 0) {
      stepInfoText.textContent = 'Draw';
      return 0;
    }
    if (arrCheckBox[index].classList.value.includes('cheked')) return 0;
    start(index);
  });
});

if (firstStep === 'Bot') {
  start();
}

function start(index) {
  if (findEmptyCells(board).length === 0) {
    stepInfoText.textContent = 'Draw';
    return 0;
  }

  if (firstStep === 'Bot') {
    if (botMode === 1) {
      botMode = 0;
      let botStep;
      if (findEmptyCells(board).length === 9) {
        botStep = Math.floor(Math.random() * 8);
      } else {
        botStep = minimax(board, X).idx;
      }
      arrCheckBox[botStep].children[1].classList.add('crossLineOne');
      arrCheckBox[botStep].children[3].classList.add('crossLineTwo');
      arrCheckBox[botStep].classList.add('cheked');
      board[botStep] = X;
      if (checkWinner3X3(board, X)) {
        deactivateDesk(board);
        stepInfoText.textContent = 'Skynet won';

        return 0;
      }
      if (findEmptyCells(board).length === 0) {
        stepInfoText.textContent = 'Draw';
        return 0;
      }
      stepInfoText.textContent = `/^'_'^\\`;
    } else {
      botMode = 1;

      for (let i = 0; i < 4; i++) {
        const arr = ['top', 'right', 'bottom', 'left'];
        arrCheckBox[index].children[i].classList.add(arr[i]);
      }
      arrCheckBox[index].classList.add('cheked');
      board[index] = O;
      if (checkWinner3X3(board, O)) {
        stepInfoText.textContent = 'You won';
        deactivateDesk(board);
        return 0;
      }
      stepInfoText.textContent = `/[]'_'[]\\`;
      setTimeout(start, 200);
      // start();
    }
  } else if (firstStep === '!Bot') {
    if (botMode === 1) {
      botMode = 0;
      arrCheckBox[index].children[1].classList.add('crossLineOne');
      arrCheckBox[index].children[3].classList.add('crossLineTwo');
      arrCheckBox[index].classList.add('cheked');
      board[index] = 'X';
      if (checkWinner3X3(board, X)) {
        deactivateDesk(board);
        stepInfoText.textContent = 'You won';
        return 0;
      }
      stepInfoText.textContent = `/[]'_'[]\\`;
      setTimeout(start, 200);
      // start()
    } else {
      botMode = 1;

      const botStep = minimax(board, O).idx;
      for (let i = 0; i < 4; i++) {
        const arr = ['top', 'right', 'bottom', 'left'];
        arrCheckBox[botStep].children[i].classList.add(arr[i]);
      }
      arrCheckBox[botStep].classList.add('cheked');
      board[botStep] = O;
      if (checkWinner3X3(board, O)) {
        stepInfoText.textContent = 'Skynet won';
        deactivateDesk(board);
        return 0;
      }
      stepInfoText.textContent = `/^'_'^\\`;
    }
  } else {
    if (botMode === 1) {
      botMode = 0;
      arrCheckBox[index].children[1].classList.add('crossLineOne');
      arrCheckBox[index].children[3].classList.add('crossLineTwo');
      arrCheckBox[index].classList.add('cheked');
      board[index] = 'X';
      if (checkWinner3X3(board, X)) {
        deactivateDesk(board);
        stepInfoText.textContent = 'X won';
        return 0;
      }
      if (findEmptyCells(board).length === 0) {
        stepInfoText.textContent = 'Draw';
        return 0;
      }
      stepInfoText.textContent = `/O'_'-\\`;
    } else {
      botMode = 1;
      for (let i = 0; i < 4; i++) {
        const arr = ['top', 'right', 'bottom', 'left'];
        arrCheckBox[index].children[i].classList.add(arr[i]);
      }
      arrCheckBox[index].classList.add('cheked');
      board[index] = O;
      if (checkWinner3X3(board, O)) {
        stepInfoText.textContent = 'Zero won';
        deactivateDesk(board);
        return 0;
      }
      if (findEmptyCells(board).length === 0) {
        stepInfoText.textContent = 'Draw';
        return 0;
      }
      stepInfoText.textContent = `/-'_'O\\`;
    }
  }
}

let deep = 0;
let limmitPogygenia = 8;

function minimax(board, player) {
  const emptyCells = findEmptyCells(board);
  if (checkWinner3X3(board, X)) {
    return { score: -1 };
  } else if (checkWinner3X3(board, O)) {
    return { score: 1 };
  } else if (emptyCells.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  //проходиться по пустих клітинках
  for (let i = 0; i < emptyCells.length; i++) {
    //+++
    deep++;

    let move = [];
    board[emptyCells[i]] = player;
    move.idx = emptyCells[i];

    if (player === X) {
      const payload = minimax(board, O);
      move.score = payload.score;
    }
    if (player === O) {
      const payload = minimax(board, X);
      move.score = payload.score;
    }
    board[emptyCells[i]] = move.idx;
    moves.push(move);

    // +++
    if (deep >= limmitPogygenia) {
      deep--;
      let bestMove = null;
      if (player === O) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
      return moves[bestMove];
    }

    //+++
    deep--;
  }
  let bestMove = null;

  if (player === O) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function findEmptyCells(board) {
  return board.filter((c) => c !== X && c !== O);
}

function deactivateDesk(board) {
  let arr = findEmptyCells(board);
  arr.forEach((element) => {
    arrCheckBox[element].classList.add('cheked');
  });
}

function reset() {
  const arrClassList = [
    'topZeroLine',
    'rightZeroLine',
    'bottomZeroLine',
    'leftZeroLine',
  ];
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  stepInfoText.textContent = `/-'_'-\\`;
  for (let i = 0; i < arrCheckBox.length; i++) {
    arrCheckBox[i].classList = `check${i + 1} check`;
    for (let a = 0; a < 4; a++) {
      arrCheckBox[i].children[a].classList = arrClassList[a];
    }
  }
  botMode = 1;
  if (checkBoxO.checked) firstStep = 'Bot';
  if (checkBoxX.checked) firstStep = '!Bot';
  if (
    (checkBoxX.checked && checkBoxO.checked) ||
    (!checkBoxX.checked && !checkBoxO.checked)
  )
    firstStep = 'Duel';

  if (firstStep === 'Bot') {
    start(4);
  }
}

function checkWinner3X3(board, player) {
  // 0 1 2
  // 3 4 5
  // 6 7 8
  if (
    (board[0] === player && board[1] === player && board[2] === player) ||
    (board[3] === player && board[4] === player && board[5] === player) ||
    (board[6] === player && board[7] === player && board[8] === player) ||
    (board[0] === player && board[3] === player && board[6] === player) ||
    (board[1] === player && board[4] === player && board[7] === player) ||
    (board[2] === player && board[5] === player && board[8] === player) ||
    (board[0] === player && board[4] === player && board[8] === player) ||
    (board[2] === player && board[4] === player && board[6] === player)
  ) {
    return true;
  }
  return false;
}

function drawTheInterface3X3(params) {
  let mainDiv = document.getElementById('gameBox');
  for (let i = 1; i < 10; i++) {
    mainDiv.innerHTML += `<div class="check${i} check">
      <div class="topZeroLine"></div>
      <div class="rightZeroLine"></div>
      <div class="bottomZeroLine"></div>
      <div class="leftZeroLine"></div>
    </div>`;
  }
}
