import { BlueSquaresView, BlueSquaresController } from "./Squares.js";
import {BlueButterfliesView, BlueButterfliesController} from "./Butterflies.js";


test("blue-squares", (assert) => {
  const collect = [];

  // prepare the environment
  const squareCanvas = document.createElement("CANVAS");
  squareCanvas.setAttribute("width", "400");
  squareCanvas.setAttribute("height", "400");
  const writeEl = document.createElement("DIV");
  const cardP = document.createElement("DIV");
  const cardR = document.createElement("DIV");
  const squareLevel1 = document.createElement("DIV");
  const squareLevel2 = document.createElement("DIV");
  const squareLevel3 = document.createElement("DIV");
  const squareLevel4 = document.createElement("DIV");
  const squareLevel5 = document.createElement("DIV");
  const squareLevel6 = document.createElement("DIV");
  const squareLevel7 = document.createElement("DIV");

  const squareResultEl = document.createElement("DIV");

  const expectedR0 =document.createElement("DIV");
  const expectedR1 =document.createElement("DIV");
  const expectedR2=document.createElement("DIV");
  const squareLevelE1 = document.createElement("DIV");
  const squareLevelE2 = document.createElement("DIV");
  const squareLevelE3 = document.createElement("DIV");
  const squareLevelE4 = document.createElement("DIV");
  const squareLevelE5 = document.createElement("DIV");
  const squareLevelE6 = document.createElement("DIV");
  const squareLevelE7 = document.createElement("DIV");
  expectedR2.appendChild(squareLevelE1);
  expectedR2.appendChild(squareLevelE2);
  expectedR2.appendChild(squareLevelE3);
  expectedR2.appendChild(squareLevelE4);
  expectedR2.appendChild(squareLevelE5);
  expectedR2.appendChild(squareLevelE6);
  expectedR2.appendChild(squareLevelE7);


  const expectedR = [expectedR0,expectedR1,expectedR2]

  const squareController = BlueSquaresController();


  const blueSquares = BlueSquaresView(squareController);
  blueSquares.initSquares(
    squareCanvas,
    writeEl,
    cardP,
    cardR,
    squareLevel1,
    squareLevel2,
    squareLevel3,
    squareLevel4,
    squareLevel5,
    squareLevel6,
    squareLevel7,
    expectedR,
    squareResultEl
  );

  //Start Game
    let newLevel =squareController.nextLevel();
    // create observers
    let clickFound;
    squareController.onChangeClick((val) => (clickFound = val));
    let numLevelCompleted;
    squareController.onFinish((val) => (numLevelCompleted = val))
    squareController.onNextLevel(val => newLevel =val );

  // appear canvas,  presentation card less visible , result card visible
  assert.equals(squareCanvas.style.opacity, "1");
  assert.equals(cardP.style.opacity, "0.5");
  assert.equals(cardR.style.opacity, "1");

  // all levels initialized
  for (let i = 1; i < 8; i++) {
    assert.equals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)");
  }



  /*********************************************
   * Simulate click OK 4 times . Then simulate a click false and end test
   * check results are correct.
   ********************************************/

  // first level and loop 4 times
  let level = 1; 
  while (level < 5) {
    const x = newLevel.magPositions.x;
    const y = newLevel.magPositions.y;

    newLevel.checkClick(x, y);  // will go to next level
    assert.equals(clickFound, true); // click ok
    for (let i = 1; i <= level; i++) {
      assert.notEquals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)","level " + Number(level+1) + " is colored");
    }
    for (let i = Number(level + 1); i < 8; i++) {
      assert.equals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)", "level " + Number(level+1) + " remains white" );
    }
    level = squareController.numLevel();
  }

  // Simulate click not OK
 
  const x = squareController.squareSize + newLevel.magPositions.x + 1;
  const y =  squareController.squareSize + newLevel.magPositions.y + 1;

  newLevel.checkClick(x, y);  // will not go to next level and set up finish
  assert.equals(numLevelCompleted, 4);  // finish with 4 levels completed

  for (let i = 1; i <= 4; i++) {
    assert.notEquals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)","level " + Number(level+1) + " is colored");
  }
  for (let i = 5; i < 8; i++) {
    assert.equals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)", "level " + Number(level+1) + " remains white" );
  }

  assert.equals(squareCanvas.style.opacity, "0.5", "canvas disable");
  assert.equals(cardP.style.opacity, "1","card Presentation to re-start available");
  assert.equals(cardR.style.opacity, "1","card results available");

  /*********************************************
   * Re-start tests
   ********************************************/

    squareController.nextLevel();
    console.log(squareController.numLevel());
 // appear canvas,  presentation card less visible , result card visible
  assert.equals(squareCanvas.style.opacity, "1");
  assert.equals(cardP.style.opacity, "0.5");
  assert.equals(cardR.style.opacity, "1");

  // all levels initialized
  for (let i = 1; i < 8; i++) {
    assert.equals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)");
  }

   /*********************************************
   * Simulate click OK all times until the end
   * check results are correct.
   ********************************************/

// first level and loop 
newLevel = squareController.nextLevel();
level = squareController.numLevel();
while (level < 8) {

  const x = newLevel.magPositions.x;
  const y = newLevel.magPositions.y;

  newLevel.checkClick(x, y);  // will go to next level
  
  assert.equals(clickFound, true); // click ok
  for (let i = 1; i <= level; i++) {
    assert.notEquals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)","level " + Number(level+1) + " is colored");
  }
  for (let i = Number(level + 1); i < 8; i++) {
    assert.equals(eval("squareLevel" + i).style.backgroundColor,"rgb(255, 255, 255)", "level " + Number(level+1) + " remains white" );
  }
  level++;
}
// Important: list is again empty and last item colored.
 assert.equals(squareController.numLevel(),0);
 assert.notEquals(eval("squareLevel" + 7).style.backgroundColor,"rgb(255, 255, 255)","level " + Number(7) + " is colored"); 

 
 assert.equals(squareCanvas.style.opacity, "0.5", "canvas disable");
 assert.equals(cardP.style.opacity, "1","card Presentation to re-start available");
 assert.equals(cardR.style.opacity, "1","card results available");


});


test("blue-butterflies", (assert) => {
  const collect = [];

  // prepare the environment
  const blueCanvas = document.createElement("CANVAS");
  blueCanvas.setAttribute("width", "250");
  blueCanvas.setAttribute("height", "300");
  const butterflyContent = document.createElement("DIV");
  const statsContent = document.createElement("DIV");
  const statsBlue = document.createElement("DIV");
  const statsPink = document.createElement("DIV");
  const statsPurp = document.createElement("DIV");
  const statsMag = document.createElement("DIV");
  const catchNet = document.createElement("DIV");

  statsBlue.innerHTML ='';
  statsPink.innerHTML ='';
  statsPurp.innerHTML ='';
  statsMag.innerHTML ='';

  const butterflyController = BlueButterfliesController(blueCanvas.width, blueCanvas.height);
  const blueView =
        BlueButterfliesView(blueCanvas,butterflyContent,statsContent,statsBlue,
                            statsPink,statsPurp,statsMag,catchNet,butterflyController);

  const butterflies  = butterflyController.newSetButterflies();
  // init butterflies correctly
  const numOfButterflies=20
  assert.equals(butterflies.length, numOfButterflies) ;

  const result = v => speed  => direction => direction == '+' ? v+speed : v-speed;
  const expectedResultFly = [];
  let inBounds = 0;
  butterflies.forEach(b => {
    let newPositionX = result (b.position.x)(b.speed)(b.directionX );
    let newPositionY = result (b.position.y)(b.speed)(b.directionY );
    expectedResultFly.push({x:newPositionX, y:newPositionY});
    inBounds = b.validateInbounds(newPositionX)(newPositionY) ? inBounds + 1 : inBounds;
  });

  // check all positions expected for each buttefly after one fly.
  butterflyController.fly();
  butterflies.forEach( (b,idx) => {
    assert.equals(b.position.x , expectedResultFly[idx].x);
    assert.equals(b.position.y , expectedResultFly[idx].y);
  });
  
  assert.equals (statsBlue.innerHTML.includes('Blue'), true);
  // if all inbounds nothing updated by the observer on the first fly
  assert.equals (inBounds==numOfButterflies, true);

  //fly 100 times
  for (let i = 1;i<100;i++)
      butterflyController.fly();

  inBounds = 0;
  let blue = 0
      ,pink = 0,purp = 0,mag = 0
  butterflies.forEach(b => {
    // calculate total inbounds to compare with results
    const onGarden = b.validateInbounds(b.position.x)(b.position.y);
    inBounds = onGarden ? inBounds + 1 : inBounds;
    // flying has been reset by the observers at some point
    assert.equals (b.flying < 40, true);

    // calculate
    if (onGarden ) {
      if (b.src.includes('blue')) blue++;
      if (b.src.includes('pink')) pink++;
      if (b.src.includes('purple')) purp++;
      if (b.src.includes('mag')) mag++;
    }
  });

 const totInbounds =  Number(statsBlue.innerHTML.replace(' Blue', ''))  +
                      Number(statsPink.innerHTML.replace(' Pink', ''))  +
                      Number(statsPurp.innerHTML.replace(' Purple', ''))+
                      Number(statsMag.innerHTML.replace(' Violet', ''));

  //check number of butteflies on garden is correct.
  assert.equals(totInbounds, inBounds);

  // check number of butterlies by color on garden is correct.
  assert.equals( Number(statsBlue.innerHTML.replace(' Blue', '')), blue);
  assert.equals( Number(statsPink.innerHTML.replace(' Pink', '')), pink);
  assert.equals( Number(statsPurp.innerHTML.replace(' Purple', '')), purp);
  assert.equals( Number(statsMag.innerHTML.replace(' Violet', '')), mag);


});