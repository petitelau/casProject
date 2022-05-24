import {TreeGreenView} from "./TreeView.js";
import {TreeGreenController} from "./TreeController.js";

test("green-trees", (assert) => {
    const collect = [];

    const canvasContainer = document.createElement("DIV");
    const treeCanvas = document.createElement("CANVAS");

    const chooseGreenRed= document.createElement("DIV");
    const treeStartContent =document.createElement("DIV");
    const sT = document.createElement("DIV");
    treeStartContent.appendChild(sT);
    const txt1 = document.createElement("DIV");
    const txt2 = document.createElement("DIV");
    const txt3 = document.createElement("DIV");
    sT.appendChild(txt1);
    sT.appendChild(txt2);
    sT.appendChild(txt3);


    const green1 = document.createElement("DIV");
    green1.setAttribute("id", "green1");
    green1.style.backgroundColor ="rgb(0,1,0)";
    const green2 = document.createElement("DIV");
    green2.setAttribute("id", "green2");
    const green3 = document.createElement("DIV");
    green3.setAttribute("id", "green3");
    const green4 = document.createElement("DIV");
    green4.setAttribute("id", "green4");

    const brown1 = document.createElement("DIV");
    brown1.setAttribute("id", "brown1");
    brown1.style.backgroundColor ="rgb(0,1,0)";
    const brown2 = document.createElement("DIV");
    brown2.setAttribute("id", "brown2");
    const brown3 = document.createElement("DIV");
    brown3.setAttribute("id", "brown3");
    const brown4 = document.createElement("DIV");
    brown4.setAttribute("id", "brown4");

    const red1 = document.createElement("DIV");
    red1.setAttribute("id", "red1");
    const red2 = document.createElement("DIV");
    red2.setAttribute("id", "red2");
    const red3 = document.createElement("DIV");
    red3.setAttribute("id", "red3");
    const red4 = document.createElement("DIV");
    red4.setAttribute("id", "red4");

    const xRemove = document.createElement("SPAN");
    const xRemove2 = document.createElement("SPAN");
    const xRemove3 = document.createElement("SPAN");
    const xRemove4 = document.createElement("SPAN");

    const colorS1 = document.createElement("DIV");
    const colorS2 = document.createElement("DIV");
    const colorS3 = document.createElement("DIV");
    const colorS4 = document.createElement("DIV");
    colorS1.appendChild(xRemove);
    colorS2.appendChild(xRemove2);
    colorS3.appendChild(xRemove3);
    colorS4.appendChild(xRemove4);

    const colorB = [green1,green2,green3,green4, brown1,brown2,brown3,brown4,red1,red2,red3,red4];
    const colorS = [colorS1,colorS2,colorS3, colorS4];

    const colorE1 = document.createElement("DIV");
    const colorE2 = document.createElement("DIV");
    const colorE3 = document.createElement("DIV");
    const colorE4 = document.createElement("DIV");
    const colorE = [colorE1, colorE2, colorE3, colorE4];
    const colorET = document.createElement("DIV");
    const pAgain = document.createElement("DIV");

    const htmlEl = [treeCanvas,chooseGreenRed,
        treeStartContent,colorB,
        colorS, colorE,
        colorET,pAgain,canvasContainer ];

    const treeController = TreeGreenController();

    const treeView = TreeGreenView(treeController, htmlEl);

    // Choose color
    treeController.startTree('green');

    // Start selecting colors from color bar
    // onClickColorBar : simulate click from all colors bar
  
    treeView.onClickColorBar(green3);

    assert.equals('green3', treeController.getTree().getColorSelected()[0]);
    assert.equals(txt3.innerHTML.includes('3'), true);  // 3 colors more to choose

    treeView.onClickColorBar(green2);
    assert.equals('green2', treeController.getTree().getColorSelected()[1]);
    assert.equals(txt3.innerHTML.includes('2'), true);  // 2 colors more to choose

    treeView.onClickColorBar(green4);
    assert.equals('green4', treeController.getTree().getColorSelected()[2]);
    assert.equals(txt3.innerHTML.includes('1'), true);  // 1 colors more to choose

    treeView.onClickColorBar(green1);
    assert.equals('green1', treeController.getTree().getColorSelected()[3]);
    assert.equals(txt3.innerHTML.includes('Draw'), true);  // ready to draw

    //de-select 3  color
    // onClickColorSelected : simulate click from all color Selected array of html elements
    treeView.onClickColorSelected(green4,2);
    assert.equals(txt3.innerHTML.includes('1'), true);
    assert.equals('0', treeController.getTree().getColorSelected()[2]);

    treeView.onClickColorSelected(green2,1);
    assert.equals(txt3.innerHTML.includes('2'), true);
    assert.equals('0', treeController.getTree().getColorSelected()[1]);

    treeView.onClickColorSelected(green3,0);
    assert.equals(txt3.innerHTML.includes('3'), true);
    assert.equals('0', treeController.getTree().getColorSelected()[0]);

    // select some mix brown and green
    treeView.onClickColorBar(brown1);
    assert.equals('brown1', treeController.getTree().getColorSelected()[0]);
    assert.equals(txt3.innerHTML.includes('2'), true); // 2 colors more to choose

    treeView.onClickColorBar(green3);
    assert.equals('green3', treeController.getTree().getColorSelected()[1]);
    assert.equals(txt3.innerHTML.includes('1'), true); // 1 colors more to choose

    treeView.onClickColorBar(brown2);
    assert.equals('brown2', treeController.getTree().getColorSelected()[2]);
    assert.equals(txt3.innerHTML.includes('Draw'), true); // ready to draw

    // Array un-order: [brown1, green3,brown2,green1 ]

    assert.equalsAllArray(['brown1', 'green3','brown2','green1' ], 
    treeController.getTree().getColorSelected());

    // simulate green color was chosen

    treeController.startDraw(true);

    // Array ordered : greens on their position:

    assert.equals('green1', treeController.getTree().getColorResult()[0]);
    assert.equals('green3', treeController.getTree().getColorResult()[2]);

    // simulate brown color was chosen
    //treeController.startTree('brown');
    //treeController.startDraw(true);

    //assert.equals('brown1', treeController.getTree().getColorResult()[0]);
    //assert.equals('brown2', treeController.getTree().getColorResult()[1]);


    // With a foliage degree * 4 colors * 4 positions
    assert.equals(treeController.getTree().getTreePositions().length, 
    treeController.getTree().FOLIAGE_DEGREE*4*4);

    // width and heigh 500--400 check formulas are correct
    const inbounds = (x,y) => x>0 && x<500 && y>0 && y<400
    treeController.getTree().getTreePositions().forEach(el=> 
        assert.equals(true, inbounds(el.x,el.y) ));

      
});