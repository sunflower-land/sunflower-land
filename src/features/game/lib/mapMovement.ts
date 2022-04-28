type MovementIntervals = {
  moveUp?: ReturnType<typeof setInterval>;
  moveDown?: ReturnType<typeof setInterval>;
  moveLeft?: ReturnType<typeof setInterval>;
  moveRight?: ReturnType<typeof setInterval>;
};

let container: HTMLElement;
const sensitivity = 3;
const intervalTime = 1;
const movementIntervals: MovementIntervals = {};
const initialCoordinates = [1024, 1214];
// TODO dynamic initial coordinates based on tile dimensions

const keyDownListener = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  if (container && event.target === document.body) {
    if (key === "w" || key === "arrowup") {
      if (movementIntervals.moveUp === undefined) {
        movementIntervals.moveUp = setInterval(() => {
          container.scrollTop -= sensitivity;
        }, intervalTime);
      }
    } else if (key === "a" || key === "arrowleft") {
      if (movementIntervals.moveLeft === undefined) {
        movementIntervals.moveLeft = setInterval(() => {
          container.scrollLeft -= sensitivity;
        }, intervalTime);
      }
    } else if (key === "s" || key === "arrowdown") {
      if (movementIntervals.moveDown === undefined) {
        movementIntervals.moveDown = setInterval(() => {
          container.scrollTop += sensitivity;
        }, intervalTime);
      }
    } else if (key === "d" || key === "arrowright") {
      if (movementIntervals.moveRight === undefined) {
        movementIntervals.moveRight = setInterval(() => {
          container.scrollLeft += sensitivity;
        }, intervalTime);
      }
    } else if (key === " ") {
      container.scrollTop = initialCoordinates[0];
      container.scrollLeft = initialCoordinates[1];
      event.preventDefault();
    }
  }
};

//no fix for keyup, as the movement began before the opening of the modal, it needs to be stopped when the key is released
const keyUpListener = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  if (container) {
    if (key === "w" || key === "arrowup") {
      if (movementIntervals.moveUp !== undefined) {
        clearInterval(movementIntervals.moveUp);
        delete movementIntervals.moveUp;
      }
    } else if (key === "a" || key === "arrowleft") {
      if (movementIntervals.moveLeft !== undefined) {
        clearInterval(movementIntervals.moveLeft);
        delete movementIntervals.moveLeft;
      }
    } else if (key === "s" || key === "arrowdown") {
      if (movementIntervals.moveDown !== undefined) {
        clearInterval(movementIntervals.moveDown);
        delete movementIntervals.moveDown;
      }
    } else if (key === "d" || key === "arrowright") {
      if (movementIntervals.moveRight !== undefined) {
        clearInterval(movementIntervals.moveRight);
        delete movementIntervals.moveRight;
      }
    }
  }
};

const addListeners = (containerPointer?: HTMLElement | null) => {
  if (containerPointer !== undefined && containerPointer !== null) {
    container = containerPointer;
  }
  // adding setintervals for smooth movement for each relevant keypress and removing them on keyup
  window.addEventListener("keydown", keyDownListener);

  window.addEventListener("keyup", keyUpListener);
};

const removeListeners = () => {
  window.removeEventListener("keydown", keyDownListener);

  window.removeEventListener("keyup", keyUpListener);
};

export default { addListeners, removeListeners };
