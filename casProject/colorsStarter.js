import {MainColorsView}  from './main-colors/js/home.js';
import {BlueSquaresView, BlueSquaresController} from "./section-blue/js/Squares.js";
import {BlueButterfliesView, BlueButterfliesPresentationView, BlueButterfliesController} from "./section-blue/js/Butterflies.js";
import {GreenMatrixController, GreenMatrixView} from "./section-green/js/Matrix.js";

import {TreeHeaderView} from "./section-green/js/TreeHeaderView.js";
import {TreeGreenView} from "./section-green/js/TreeView.js";
import {TreeGreenController} from "./section-green/js/TreeController.js";

import {PurpleController} from "./section-purple/js/c-purple.js";
import {PurpleView} from "./section-purple/js/c-purple.js"
import { listController, selectionController } from './main-colors/js/nav-model.js';
import { ColorBar, DetailView, MasterView, noColor } from './main-colors/js/ColorBar.js';

let mainController;

const mainStarter = () => {
    const navItems = ['green','blue','purple'];
    const lController = listController(ColorBar,navItems);
    const sController = selectionController(noColor);

    MasterView(lController,sController);
    DetailView(sController);

    lController.addItems();

    mainController = sController;

    const hero=document.querySelector('.main-photo-container');
    const credits_box = document.querySelector('.credits-box');
    const credit_canvas = document.querySelector('.credits-canvas');
    const home = document.querySelector('.home-icon');
    const cas = document.querySelector('.v-text-space');

    home.onclick = () =>  mainController.closeColor();

    const mainView = MainColorsView(mainController);
    mainView.initHtmlEl(hero,credits_box, credit_canvas,home,cas);
}

const blueSquareStarter =()=> {
    const close= document.getElementById('iconCloseBlue');
    const squareCanvas = document.querySelector('.blueish');
    const writeEl= document.querySelector('#write_effect');
    const startEl = document.querySelector('#startSquareGame');
    const cardP = document.querySelector('.squares-presentation');
    const cardR = document.querySelector('.squares-results');
    const squareLevel1= document.querySelector('#squareLevel1');
    const squareLevel2= document.querySelector('#squareLevel2');
    const squareLevel3= document.querySelector('#squareLevel3');
    const squareLevel4= document.querySelector('#squareLevel4');
    const squareLevel5= document.querySelector('#squareLevel5');
    const squareLevel6= document.querySelector('#squareLevel6');
    const squareLevel7= document.querySelector('#squareLevel7');
    const expectedR = document.querySelectorAll('.expected');
    const squareResultEl = document.querySelector('#squareResult');

    const squareController = BlueSquaresController();
    const blueSquareView = BlueSquaresView(squareController);

    startEl.onclick =   () =>   squareController.nextLevel();
    close.onclick =     () =>   mainController.closeColor();

    blueSquareView.initSquares(squareCanvas,writeEl,cardP,cardR,
        squareLevel1, squareLevel2,squareLevel3,squareLevel4,squareLevel5,squareLevel6,squareLevel7,expectedR,squareResultEl)

}


/*
 * bCover:
 *         Start click to open the curtain
 * playAgain:
 *         Reload all game, playing curtain animation and with a new set of butterflies
 */
const blueButterfliesStarter = ()=> {
    const butterflyCurtainLeft = document.querySelectorAll('.presentation-left');
    const butterflyCurtainRight = document.querySelectorAll('.presentation-right');
    const butterflyContainer = document.querySelector('.butterflies-container');
    const butterflyPContainer = document.querySelector('.butterflies-presentation-container');

    const bCover = document.querySelector('.butterflies-cover');
    const coverImg = document.getElementById('bCoverImg');
    const playAgain = document.querySelector('.blue-playAgain');
    const blueCanvas = document.querySelector('.blue-canvas');

    const butterflyContent = document.querySelector('.butterfly-content');
    const statsContent = document.querySelector('.stats-bcontent');
    const statsBlue = document.getElementById('nButtBlue');
    const statsPink = document.getElementById('nButtPink');
    const statsPurp = document.getElementById('nButtPurple');
    const statsMag = document.getElementById('nButtMag');
    const catchNet = document.querySelector('.statsCatchNet');

    const butterflyController = BlueButterfliesController(blueCanvas.width, blueCanvas.height);
    BlueButterfliesView(blueCanvas,butterflyContent,statsContent,statsBlue,
                        statsPink,statsPurp,statsMag,catchNet,butterflyController);
    BlueButterfliesPresentationView( butterflyCurtainLeft,butterflyCurtainRight,bCover,
                                                        butterflyContainer, butterflyPContainer, coverImg, playAgain,
                                                        butterflyController);

    bCover.onclick      = ()=> butterflyController.startAnimation();
    playAgain.onclick   = ()=> butterflyController.setUpAnimation();

}


const greenMatrixStarter = ()=> {
    const close= document.getElementById('iconCloseGreen');
    const matrix =    document.querySelector('.container-matrix');
    const ctrls = document.querySelectorAll('.controls');
    const cover = document.getElementById('canvas-coverMatrix');
    const playAgain= document.getElementById('playAgainMatrix');
    const powerOff=document.querySelector('.powerOff');
    const on = powerOff.children[0];

    let sliderGreen= ctrls[0];
    let sliderRed = ctrls[1];
    let sliderBk = ctrls[2];
    const matrixController = GreenMatrixController();
    GreenMatrixView(matrixController,matrix,playAgain);

    close.onclick =     () =>   mainController.closeColor();

    on.onclick =        () => matrixController.on_off();
    playAgain.onclick = ()=> matrixController.reset();
    cover.onclick =     () => matrixController.startMatrixAnim();
    
    sliderGreen.onchange =  (e) => matrixController.changeColorFont(e,'green');
    sliderRed.onchange =    (e) => matrixController.changeColorFont(e,'red');
    sliderBk.onchange =     (e) => matrixController.changeColorBk(e);
}

const greenTreeStarter = () => {
    const treeHeader = document.querySelector('.tree-header');
    const chooseGreenRed= document.getElementById('chooseGreenRed');
    const greenSide = document.getElementById('greenSide');
    const redSide = document.getElementById('redSide');
    const treeStartContent =document.querySelector('.treeStartContent');
    const stText= document.querySelector('.treeStartAllText');
    const colorBar = document.querySelectorAll('.startColorBar');
    const canvasCont = document.querySelector('.canvas-container-tree');
    const canvasTree = document.querySelector('.canvas-tree');
    const colorSel =document.querySelectorAll('.colorSelected');
    const colorExp = document.querySelectorAll('.colorExpected');
    const colorExpT =document.querySelector('.colorExpectedTitle');
    const pAgain = document.querySelector('.green-playAgain');

    const htmlEl = [canvasTree,chooseGreenRed,
                    treeStartContent,colorBar,
                    colorSel, colorExp,
                    colorExpT,pAgain,canvasCont ];

    const treeController = TreeGreenController();
    TreeHeaderView(treeController, treeHeader);
    TreeGreenView(treeController, htmlEl);

    greenSide.onclick = ( )=> treeController.startTree('green');
    redSide.onclick =   () => treeController.startTree('red');
    pAgain.onclick = () => treeController.replay();


}

const purpleStarter = () => {
   
    const close = document.querySelector('section.purple > div > ion-icon');

    close.onclick =     () =>   mainController.closeColor();
    const rootEl = document.querySelector('.layout-container');
    const purpleController= PurpleController();
    PurpleView(purpleController, rootEl);
    
}

mainStarter();
blueSquareStarter();
blueButterfliesStarter();
greenMatrixStarter();
greenTreeStarter();

purpleStarter();