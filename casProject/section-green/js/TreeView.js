import { fst,snd} from "../../utils/lambda.js";

export {TreeGreenView}

/**
 *
 * @param treeController
 * @param htmlEl
 * @returns {{onClickColorBar: onClickColorBar, onClickColorSelected: onClickColorSelected}}
 * @constructor
 */
const TreeGreenView = (treeController, htmlEl )=> {

    const canvasTree = htmlEl[0];
    const chooseGreenRed = htmlEl[1];
    const startContent = htmlEl[2];
    let stT = startContent.children[0];
    const startText = stT.children[0];
    const chooseText = stT.children[1];
    const selText = stT.children[2];
    const colorBar = htmlEl[3];
    const colorSelectedEL = htmlEl[4];
    const colorExpectedEl =  htmlEl[5];
    const colorExpectedTitle= htmlEl[6];
    const pAgain =  htmlEl[7];
    const canvasContainer =  htmlEl[8];

    const allChecks = Array.from(colorSelectedEL, e=>e.children[1]);
    const checkColor1 =allChecks[0];
    const checkColor2= allChecks[1];
    const checkColor3=allChecks[2];
    const checkColor4=allChecks[3];

    let colorSelectedIdx = 0;
    let numSelected = 0;
    let copyEl;
    let colorChosen = '';

    const ctxTree = canvasTree.getContext('2d');
    canvasTree.style.cursor = 'pointer';


    // all reset style, variables, properties, ready to start .
    const initTree = () => {
        startContent.style.display='grid';
        chooseGreenRed.style.display = 'flex';
        chooseGreenRed.style.height = '40rem';

        startText.innerHTML="";
        chooseText.innerHTML ="";
        selText.innerHTML= "";
        colorSelectedIdx=0;
        numSelected = 0;

        colorExpectedEl.forEach(c=> c.style.display='none');
        colorExpectedTitle.style.display='none';
        canvasContainer.style.display='none';
      
        colorSelectedEL.forEach((c,idx)=> {
            c.style.display='none';
            c.style.height= '16rem';
            c.style.backgroundColor = '#fdfcfc';
            c.children[0].style.opacity='1';
            c.children[0].style.pointerEvents='auto';
            c.children[0].onclick = ()=> {
                onClickColorSelected(c,idx);
            }
        });
        colorBar.forEach( (c) => {
            c.onclick = () => {
                onClickColorBar(c);
            }
        });

        treeController.setColorsExpected(colorBar);
       
         selText.onclick =  () => {
             onClickDrawTree();
         }
    }

    // de-select color
    const onClickColorSelected = (c,idx)=> {
            c.style.backgroundColor = '#fdfcfc';
            const arr = treeController.getTree().getColorSelected();
            arr[idx] = '0';
            treeController.getTree().setColorSelected(arr);
    }

    // select color
    const onClickColorBar = (c) =>{
            if (colorSelectedIdx == -1) return;
            const id = c.id;
            const rgb = window.getComputedStyle(c).backgroundColor;
            colorSelectedEL[colorSelectedIdx].style.backgroundColor= rgb;
            const arr = treeController.getTree().getColorSelected();
            arr[colorSelectedIdx] = id;
            treeController.getTree().setColorSelected(arr);
    }

    const onClickDrawTree =()=> {
        if (selText.innerHTML !== 'Draw')
            return;
        canvasContainer.style.display='block';
        startContent.style.display="none";

        // colors can not be de-selected again at this stage
        colorSelectedEL.forEach(c=> {
            c.children[0].style.opacity='0';
            c.children[0].style.pointerEvents='none';
        });
        // callback to order Colors
        treeController.startDraw('start');
    }

    

    /************************************************************
     * From colorSelected observable, callback to  render the numbers
     * of colors still to choose
     * @param arr :colorSelected array
     ************************************************************/
    const updateColorSelected = (arr) => {
        const idx = arr.findIndex(c=> c === '0');
        colorSelectedIdx = idx;
        if (arr.every(c=> c !== '0')) {
            numSelected = 4;
            selText.innerHTML = 'Draw';
            selText.style.textDecoration='underline';
            selText.style.cursor ='pointer';
            selText.style.alignSelf='center';
            return;
        }
        numSelected = 4- arr.filter(c=> c=== '0').length;
        selText.innerHTML = `Still ${4-numSelected} to choose`;
    }


    /**************************************************
     * 3 animations simultaneously:
     * animationColorBar ():
     *              color bar animation  using css grid by changing colors from one row to the other.
     * animationImageGrow() on Header View:
     *              image growing animation, using css scale property to increase size by  interval:
     *
     * writing animation():
     *              writes letter by letter in a promise that is resolve when the text is finish .
     *              This will stop the other 2 animations and itself.
     *
     ***************************************************/
    const animationColorBar =()=> {
        let i= 0;
        let r =2;
        let r2=12;
        const timer = setInterval(()=>{
            const numRow = Number(r);
            colorBar[i].style.gridRow = `${numRow}`;
            const numRow2 =Number(r2);
            colorBar[i+8].style.gridRow = `${numRow2}`;
            r++;r2++;
            if (r >= 12) r=2;
            if (r2 >=12) r2=2;
        }, 200);
        return timer;
    }


    const animationWriting =() => {
        const txt="Let's draw a " + colorChosen + " Tree";
        const writing = new Promise((resolve, reject)=> {
            Array.from(txt).forEach((l,idx) => {
                setTimeout(()=> {
                    startText.innerHTML += l;
                    if (idx == txt.length-1)  resolve(true);
                }, 150*idx);
            });
        });
        return writing;
    }

    /***********************************************************
     * launch 3 animations and start to select colors
     ***********************************************************/
    const startTreeGame = () => {

       const timer1 = animationColorBar();
       const writing =  animationWriting();
      
        writing.then(r=>{
            clearInterval(timer1);
            chooseGreenRed.style.display ='none';
           chooseText.innerHTML += "<p>Select only types of " + colorChosen 
           + " from the list </p>";
           chooseText.style.opacity=1;
           colorSelectedEL.forEach(c=> c.style.display="flex");
        });
        // re-start button available
        tryAgain();
    }

    /***************************************************************************
     * From observable update colorResults callback
     * Order the html elements accordingly and set them on copyEl []
     *
     * @param colors : from colorResult user selected colors in order
     */
    const orderColorSelected = (colors) => {

        // colors id with order
        const c = colors.slice();
        copyEl =[];
        // colors id as elements order
        const colorsId = treeController.getTree().getColorSelected();
        Array.from(colorSelectedEL).forEach( (el,idx) => {
            copyEl.push( {bk:el.style.backgroundColor, id: colorsId[idx]} );
        });
        [0,1,2,3].forEach(num=> {
            let idx = copyEl.findIndex((arrEl) => arrEl.id == c[num]);
            copyEl.splice(num, 0,copyEl[idx]);
        })
        copyEl.splice(4,copyEl.length);
        const elements =  copyEl;
        treeController.getTree().colorsSelectedBk = elements.map(c=> c.bk);
      
    }

    /***************************************************************************
     * fallingLeaves
     * Animation on canvas, all leaves that does not correspond to  the color
     * expected will fall.
     ******************************************************************************/
    const fallingLeaves = ()=> {
        const pos = treeController.getTree().getTreePositions(); 
        const fall = new Promise( (resolve, reject) => {
            const timer = setInterval( ()=> {
                ctxTree.clearRect(0, 0, canvasTree.width, canvasTree.height);
                pos.forEach( (p,idx1) => {
                    ctxTree.beginPath();
                    const idx = copyEl.findIndex(cEl=> cEl.id == p.id);
                    if ( ! copyEl[idx].id.includes(colorChosen) ) {
                        p.y++;
                    }
                    ctxTree.fillStyle = copyEl[idx].bk;
                    ctxTree.arc(p.x, p.y, 8, 0, 2 * Math.PI);
                    ctxTree.fill();
                      // mirror effect
                    ctxTree.beginPath();
                    ctxTree.fillStyle = copyEl[idx].bk;
                    ctxTree.arc(canvasTree.width - p.x, p.y, 8, 0, 2 * Math.PI);
                    ctxTree.fill(); 
                    if (p.y > (canvasTree.height +120) ){
                        clearInterval(timer);
                        resolve(true);
                    }  
                })
            },10); 
        });
        fall.then(r=> {
            drawArrowFwd(30, true);
        });
    }


    //going backwards to select colors again.  disapearing canvas and show start window
    const startContentDisplay = () => {
        canvasContainer.style.display='none';
        startContent.style.display="grid";

        // able to deselect colors  again
        colorSelectedEL.forEach(c=> {
                        c.children[0].style.opacity='1';
                        c.children[0].style.pointerEvents='auto';
        });
    }

    // Once Tree is  drawn, clicking posibilities
    // inform the controller about it.
    canvasTree.onclick = (e) => {
        const rect = canvasTree.getBoundingClientRect();

        // transform to canvas.width units
        let percentageX = (rect.width*100)/canvasTree.width;
        let eq = 100 + (100-percentageX);
        let eqY  = (rect.height*100)/canvasTree.height;
        
        let xClick = e.clientX - rect.left;
        xClick = Math.round((xClick * eq) /100);

        let yClick = e.clientY - rect.top;
        yClick =Math.round((yClick * eqY) /100);



        //backwards to choose  colors
        if (xClick < 35 && yClick >= (canvasTree.height-180)) {
            startContentDisplay();
            treeController.reDraw(true);
           return;
        }        

        //forward validate colors
        if (xClick >= (canvasTree.width-180) && yClick >= (canvasTree.height-180)) {
            copyEl.every(c=> c.id.includes(colorChosen))
            if ( copyEl.every(c=> c.id.includes(colorChosen)) ) {
                drawCompareTree();
                finalCompare();
                treeController.treeCompare(true);
                treeController.treeFinish(true);
                return;
            }
            else {
                fallingLeaves();
                treeController.treeFalling(true);
                return;
            }
        }

        //forward final result
       if (xClick >= (canvasTree.width-180) && (yClick >= 10 && yClick <=40)) {
            drawCompareTree();    
            finalCompare();
            treeController.treeCompare(true);
            treeController.treeFinish(true);
       }
    }

    const drawArrowBkw = (corner) => {
        ctxTree.fillStyle = 'rgba(0,0,0,0.3)';
        ctxTree.fillRect(0,canvasTree.height-corner,corner,corner);
        ctxTree.beginPath();
        ctxTree.fillStyle = 'white';
        ctxTree.font = 'bold 28px Times';
        ctxTree.textAlign = 'center';
        ctxTree.fillText('<',corner-15,canvasTree.height-(corner-20));
    }

    const drawArrowFwd = (corner,top)=> {
        ctxTree.fillStyle = 'rgba(0,0,0,0.3)';
        top? ctxTree.fillRect(canvasTree.width-corner,10,corner,corner): 
            ctxTree.fillRect(canvasTree.width-corner,canvasTree.height-corner,corner,corner);
        ctxTree.beginPath();
        ctxTree.fillStyle = 'white';
        ctxTree.font = 'bold 28px Times';
        ctxTree.textAlign = 'center';
        top? ctxTree.fillText('>',canvasTree.width-(corner-15),(corner+5)): 
            ctxTree.fillText('>',canvasTree.width-(corner-15),canvasTree.height-(corner-20));
    }

    /***************************************************************************
     * drawCompareTree , finalCompare
     * Draw the tree comparision between selected and expected
     * On the bottom each color is evaluated and compared .
     ******************************************************************************/
    const finalCompare = ()=> {
        colorSelectedEL.forEach(c=> {
            c.style.height= '8rem';
        });
        colorExpectedEl.forEach( (c,i)=> {
            c.style.display='block';
            const idx = treeController.colorsExpected.findIndex(c=> c.id === `${colorChosen}${i+1}`);
            c.style.backgroundColor= `${treeController.colorsExpected[idx].rgb}`;
        });
        colorExpectedTitle.style.display='block';
        [0,1,2,3].forEach(num => {
            colorSelectedEL[num].style.backgroundColor = copyEl[num].bk;
            colorSelectedEL[num].style.color='white';
            colorSelectedEL[num].style.fontSize='2.2rem';
            if (! copyEl[num].id.includes(colorChosen) ) {
                eval(`checkColor${num+1}`).innerHTML = '&#9747;';      // html: X symbol
            }
            else {
                eval(`checkColor${num+1}`).innerHTML ='&#10003;';  // html: check symbol
            }
        });
    }

    const drawCompareTree = ()=> {
        const origPos = treeController.getTree().getFixedPositions();
        ctxTree.clearRect(0, 0, canvasTree.width, canvasTree.height);

        origPos.forEach( p => {
            ctxTree.beginPath();
            const idx = copyEl.findIndex(c=> c.id == p.id);
            ctxTree.fillStyle = copyEl[idx].bk;
            ctxTree.arc(p.xy(fst), p.xy(snd), 8, 0, 2 * Math.PI);
            ctxTree.fill();
              // mirror effect
            ctxTree.beginPath();
            const idx2= treeController.colorsExpected.findIndex(c=> c.id === p.correctId);
            ctxTree.fillStyle = treeController.colorsExpected[idx2].rgb;
            ctxTree.arc(canvasTree.width - p.xy(fst), p.xy(snd), 8, 0, 2 * Math.PI);
            ctxTree.fill();         
        });

        // draw vertical line
        ctxTree.strokeStyle = "black";
        ctxTree.beginPath();
        ctxTree.moveTo((canvasTree.width)/2,0); 
        ctxTree.lineTo((canvasTree.width)/2,canvasTree.height); 
        ctxTree.stroke();
        ctxTree.closePath();

    }


    /***************************************************************************
     * drawTree ,
     * Draw the tree with the colors the user has selected.
     ******************************************************************************/
    const drawTree = () => {
        const pos = treeController.getTree().getFixedPositions();
        ctxTree.clearRect(0, 0, canvasTree.width, canvasTree.height);
        pos.forEach( (p,i1) => {
            ctxTree.beginPath();
            const idx = copyEl.findIndex(c=> c.id == p.id);
            ctxTree.fillStyle = copyEl[idx].bk;
            ctxTree.arc( p.xy(fst),  p.xy(snd), 8, 0, 2 * Math.PI);
            ctxTree.fill();
              // mirror effect
            ctxTree.beginPath();
            ctxTree.fillStyle = copyEl[idx].bk;
            ctxTree.arc(canvasTree.width -  p.xy(fst), p.xy(snd), 8, 0, 2 * Math.PI);
            ctxTree.fill(); 
        });
        drawArrowFwd(30);
        drawArrowBkw(30);
    }

    const tryAgain = () => {
        pAgain.style.display='block';
    }

    const cleanColors =()=> {
        //each color selected reset
        [1,2,3,4].forEach (i=> {
            eval(`checkColor${i}`).innerHTML = '';
        });
    }
    

    const setColorChosen = (c) => {
        chooseGreenRed.style.height='0';     
        colorChosen = c;
    }

    const registerObs = ()=> {
        treeController.getTree().colorSelected.onChange(updateColorSelected);
        treeController.getTree().onChangeResult(orderColorSelected);
        treeController.getTree().onChangeReadyDraw(drawTree);
    }

    
    treeController.onTreeSetUp(initTree);
    treeController.onTreeSetUp(cleanColors);
    treeController.startView(setColorChosen);
    treeController.startView(startTreeGame); 
    treeController.startView(registerObs);

    initTree();

    return {onClickColorBar, onClickColorSelected}  // for testing
}