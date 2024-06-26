import "core-js/stable";
import "regenerator-runtime/runtime.js";

import { Grid } from "./grid.js";
import { Tile } from "./tile.js";
import { changeScoreForStart, messageWin } from "./cell.js";

const gameField = document.getElementById("game-field");
const buttonStart = document.getElementById("btnStart");
const buttonShowControl = document.getElementById("btnShowControl");
const buttonsControl = document.getElementById("buttonsControl");
const buttonUp = document.getElementById("buttonUp");
const buttonDown = document.getElementById("buttonDown");
const buttonLeft = document.getElementById("buttonLeft");
const buttonRight = document.getElementById("buttonRight");

let continueHandlingInput = true;
let isShowControl = false;

const grid = new Grid(gameField);

function messageLose(action) {
  const messageLoseScreen = document.getElementById("message-lose");

  if (action === "add") {
    messageLoseScreen.classList.add("hidden");
  }

  if (action === "remove") {
    messageLoseScreen.classList.remove("hidden");
  }
}

buttonStart.addEventListener("click", function () {
  startGame();
});

buttonShowControl.addEventListener("click", function () {
  if (!isShowControl) {
    buttonsControl.style.display = "flex";
    buttonShowControl.classList.add("closeControl");
    buttonShowControl.classList.remove("showControl");

    buttonShowControl.innerHTML = "Close Control";
    isShowControl = true;

    return;
  }

  buttonShowControl.classList.remove("closeControl");
  buttonShowControl.classList.add("showControl");
  buttonsControl.style.display = "none";
  buttonShowControl.innerHTML = "Show Control";
  isShowControl = false;
});

function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(inputEvent) {
  if (!continueHandlingInput) {
    return;
  }

  switch (inputEvent.code) {
    case "ArrowUp":
    case "KeyW":
      if (!canMoveUp()) {
        setupInputOnce();

        return;
      }

      await moveUp();
      break;

    case "ArrowDown":
    case "KeyS":
      if (!canMoveDown()) {
        setupInputOnce();

        return;
      }

      await moveDown();
      break;

    case "ArrowLeft":
    case "KeyA":
      if (!canMoveLeft()) {
        setupInputOnce();

        return;
      }

      await moveLeft();
      break;

    case "ArrowRight":
    case "KeyD":
      if (!canMoveRight()) {
        setupInputOnce();

        return;
      }

      await moveRight();
      break;

    default:
      setupInputOnce();

      return;
  }

  const newTile = new Tile(gameField);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();

    messageLose("remove");

    return;
  }

  setupInputOnce();
}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach((group) => slideTilesInGroup(group, promises));

  await Promise.all(promises);

  grid.cells.forEach((cell) => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];
    let targetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
  return groupedCells.some((group) => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];

    return targetCell.canAccept(cell.linkedTile);
  });
}

function removeTiles() {
  grid.cells.forEach((cell) => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeFromDOM();
      cell.unlinkTile();
    }
  });
}

function startGame() {
  const messageStart = document.getElementById("message-start");

  messageWin();
  messageLose("add");
  messageStart.classList.add("hidden");
  buttonStart.classList.remove("start");
  buttonStart.classList.add("restart");
  buttonStart.textContent = "Restart";
  removeTiles();
  changeScoreForStart();
  continueHandlingInput = true;

  grid.getRandomEmptyCell().linkTile(new Tile(gameField));
  grid.getRandomEmptyCell().linkTile(new Tile(gameField));
  setupInputOnce();
}

buttonUp.addEventListener("click", async function () {
  if (canMoveUp()) {
    await moveUp();
    handleNewTile();
  }
});

buttonDown.addEventListener("click", async function () {
  if (canMoveDown()) {
    await moveDown();
    handleNewTile();
  }
});

buttonLeft.addEventListener("click", async function () {
  if (canMoveLeft()) {
    await moveLeft();
    handleNewTile();
  }
});

buttonRight.addEventListener("click", async function () {
  if (canMoveRight()) {
    await moveRight();
    handleNewTile();
  }
});

function handleNewTile() {
  const newTile = new Tile(gameField);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForAnimationEnd().then(() => messageLose("remove"));
  }
}

export function stopGame() {
  continueHandlingInput = false;
}
