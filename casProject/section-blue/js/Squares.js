import {nTuple,toggle} from  "../../utils/lambda.js";
import {ObservableList,Observable} from "../../utils/Observables.js";
import { colorPrefix } from "../../utils/constants.js";

export { BlueSquaresView,BlueSquaresController};

/*
 * Control the level is passed once the user has click the right color
 * @returns {{
 *            blueFormule:  {nTuple}   // to keep different formulas for tons and shades of blue
 *            isAllFinish: {boolean},  // Method from ObservableList used to keep the array of all levels.
 *            getBlueish: *,          // from nTuple
 *            getOtherBlues: *,       // from nTuple
 *            onNextLevel: onNextLevel,  // Method from ObservableList used to keep the array of all levels.
 *            numLevel: count, //  control game progress
 *            getLightBlue: *,
 *            squareSize: number,
 *            nextLevel:
 *            onChangeClick: onChange,
 *            onFinish: onChange}}
 */
const BlueSquaresController = () => {
  const squareSize = 40;
  const squaresGameModel = ObservableList([]);
  const clickOk = Observable(false);
  const numFinish = Observable(0);

  /**
   * Builds next level if needed
   * @returns
   * {{checkClick: (function(*=, *=): undefined), //whether users has clicked right
   * magPositions: {x: number, y: number}, magArray: []}}   // magenta positions
   * @constructor
   */
  const SquaresLevel = () => {
    const maxLEVEL = 7;
    let numLevel = squaresGameModel.count();
    const magPositions = {
      x: Math.floor(Math.random() * 10) * squareSize,
      y: Math.floor(Math.random() * 10) * squareSize,
    };
    const magArray = [];
    magArray.push(`#${colorPrefix[numLevel]}00FF`);
    magArray.push(`#${colorPrefix[numLevel + 1]}00FF`);
    const inRange = (x, y) => {
      const xRange = x >= magPositions.x && x <= magPositions.x + squareSize;
      const yRange = y >= magPositions.y && y <= magPositions.y + squareSize;
      if (false === (xRange && yRange)) {
        numFinish.setValue(numLevel);
        return;
      }
      clickOk.setValue(true);
      if (numLevel == maxLEVEL - 1) {
        numFinish.setValue(numLevel + 1);
      }
    };
    return {
      magPositions,
      magArray,
      checkClick: (x, y) => inRange(x, y),
    };
  };


   numFinish.onChange(() => squaresGameModel.onFinish());

  const nextLevel = () => {
    const newLevel = SquaresLevel();
    squaresGameModel.newLevel(newLevel);
    return newLevel;
  };

  const [BlueFormula, getLightBlue, getBlueish, getOtherBlues] = nTuple(3);
  const blueFormule = BlueFormula(
    (c) => `rgb(0, ${Math.floor(c * 80) + 80}, 255)`,
    (c) => `rgb(${Math.floor(c * 50)}, 0, 255)`,
    (c) => `rgb(${Math.floor(c * 10) + 60 - 50}, 50, 255)`
  );

  return {
    blueFormule,
    getLightBlue,
    getBlueish,
    getOtherBlues,
    squareSize,
    nextLevel,
    onNextLevel: squaresGameModel.onNextLevel,
    numLevel: squaresGameModel.count,
    onChangeClick: clickOk.onChange,
    onFinish: numFinish.onChange,
    isAllFinish: squaresGameModel.isAllFinish
  };
};


/**
 *
 * @param squareController
 * @returns {{initSquares: initSquares}}
 * @constructor
 */
const BlueSquaresView = (squareController) => {
  let squareCanvas;
  let writeEl;
  let cardP;
  let cardR;
  let squareLevel1;
  let squareLevel2;
  let squareLevel3;
  let squareLevel4;
  let squareLevel5;
  let squareLevel6;
  let squareLevel7;
  let expectedR;
  let squareResultEl;

  const initSquares = (
    sqC,wrEl,cP,cR,sq1,sq2,sq3,sq4,sq5,sq6,sq7,eR,sqR1) => {
    squareCanvas = sqC;
    writeEl = wrEl;
    cardP = cP;
    cardR = cR;
    squareLevel1 = sq1;
    squareLevel2 = sq2;
    squareLevel3 = sq3;
    squareLevel4 = sq4;
    squareLevel5 = sq5;
    squareLevel6 = sq6;
    squareLevel7 = sq7;
    expectedR = eR;
    squareResultEl = sqR1;
    Array.from("-like").forEach((letter, idx) =>
      setTimeout(() => (writeEl.innerHTML += letter), 500 * idx + 1)
    );
    // set up colors expected
    Array.from(expectedR[2].children).forEach( (e,idx)=> {
      e.style.backgroundColor = `#${colorPrefix[idx]}00FF`;
      e.innerHTML = `#${colorPrefix[idx]}00FF`;
    });
    // setup color description on levels
    for (let i=1; i<8; i++) {
      eval(`squareLevel${i}`).innerHTML =  `#${colorPrefix[i-1]}00FF`;
    }
  };


  const ssize = squareController.squareSize;
  let interval;

 /*
  *  drawSquares():
  *          Render the canvas with the blue squares blinking.
  *          Magenta color is drawn on the position and exact color calculated by the controller.
  *
  */
  const drawSquares = (newLevel) => {
    if (interval) {
      clearInterval(interval);
    }
    const squareArray = [
      squareController.getBlueish,
      squareController.getOtherBlues,
      squareController.getLightBlue,
      squareController.getBlueish,
    ];
    let currentColor = squareController.getLightBlue;
    let idx = 1;
    const ctxSquare = squareCanvas.getContext("2d");
    ctxSquare.beginPath();
    interval = setInterval(() => {
      for (let x = 0; x < squareCanvas.width; x = x + ssize) {
        for (let y = 0; y < squareCanvas.height; y = y + ssize) {
          currentColor =
            squareArray[squareArray.findIndex((s) => s == currentColor) + 1];
          ctxSquare.fillStyle = squareController.blueFormule(currentColor)(
            Math.random()
          );
          ctxSquare.fillRect(x, y, ssize, ssize);
        }
      }
      idx = toggle(idx);
      ctxSquare.fillStyle = newLevel.magArray[idx];
      ctxSquare.fillRect(
        newLevel.magPositions.x,
        newLevel.magPositions.y,
        ssize,
        ssize
      );
      ctxSquare.stroke();
    }, 700);
    squareCanvas.onclick = (e) => {
      onClickCanvas(e, newLevel);
    };
  };

  const onClickCanvas = (e, newLevel) => {
    const rect = squareCanvas.getBoundingClientRect();

    // transform to canvas.width units
    let percentage = (rect.width*100)/squareCanvas.width;
    let eq = 100 + (100-percentage);

    let xClick = e.clientX - rect.left;
    xClick = Math.round((xClick * eq) /100);

    let yClick = e.clientY - rect.top;
    yClick =Math.round((yClick * eq) /100);

    newLevel.checkClick(xClick, yClick);
  };

 /*
  *  statsUpdate():
  *          Render the status progress at all times during the test.
  */
  const statsUpdate = () => {
    const idx = squareController.numLevel() - 1;
    if (idx === 0) return;
    eval("squareLevel" + idx).style.backgroundColor = `#${
      colorPrefix[idx - 1]
    }00FF`;
  };

 /*   renderFinish():
  *          wrap up of test finish and put available the re-start/tryAgain button.
  */
  const renderFinish = (n) => {
    clearInterval(interval);
    if (squareController.isAllFinish()) {
      squareLevel7.style.backgroundColor = `#${colorPrefix[6]}00FF`;
    }
    expectedR.forEach((e) => e.classList.remove("expected"));
    squareResultEl.innerText = n + "/ 7";
    cardP.style.pointerEvents = "auto";
    cardP.style.opacity = 1;
    squareCanvas.style.opacity = 0.5;
    squareCanvas.style.pointerEvents = "none";
  };

  const clickResult = (result) => {
    if (true == result) squareController.nextLevel();
  };

  /**
   *  clickStart():
   *          Set up the environment via Opacity and pointeEvents css property
   */
  const clickStart = () => {
    // set up
    if (squareController.numLevel() > 1) return;
    squareCanvas.style.opacity = "1";
    squareCanvas.style.pointerEvents = "auto";
    cardP.style.gridColumn = "1";
    cardP.style.opacity = "0.5";
    cardP.style.alignSelf = "auto";
    cardP.style.pointerEvents = "none";
    cardR.style.opacity = 1;

    //clean-up
    expectedR.forEach((e) => e.classList.add("expected"));
    for (let i = 1; i < 8; i++) {
      eval("squareLevel" + i).style.backgroundColor = "#fff";
    }
  };

  squareController.onNextLevel(drawSquares);
  squareController.onNextLevel(statsUpdate);
  squareController.onChangeClick(clickResult);
  squareController.onFinish(renderFinish);
  squareController.onNextLevel(clickStart);


  return {
    initSquares
  };
}
