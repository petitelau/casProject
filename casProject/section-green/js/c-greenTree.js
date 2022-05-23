import { ObservableArrayEl, Observable, Pair,fst,snd,nTuple, KeepList } from "../../utils/utils.js";
import {MainColorsView} from "../../main-colors/js/colors.js";

export {closeIconFn,TreeGreenView}

const closeIconFn = (closeIcon) => {
    let closeIconEl = closeIcon;
    closeIconEl.onclick = () => MainColorsView().closeColor("green");
};

/***************************************************
 * TreeGreenController.
 *  Determine the positions on the tree and order the  colors as expected following a model of
 *  reds or greens. Following an order will let a easier comparision of the colors selected Vs Expected.
 *
 *  colorSelected: ObservableArrayEl. Updated when select or de-select a color. It observes the number the colors
 *  still to choose.
 *  colorResult: Observable keeping the order of the colors when user click on Draw, so draw the tree as model if
 *  correct colors where chosen.
 *
 * @returns {{
 * onChangeResult: onChange, userColor: setValue,
 * getTreePositions: [] array with positions calculated for canvas.
 * getFixedPositions:  [] array with positions calculated for canvas set up with pair. so they dont change.
 * onChangeReadyDraw: Observable when positions and colors are set.
 * getColorsSelected: [] user selecting colors observable
 * onChangeColorSel:
 *
 * @constructor
 */
const TreeGreenController = () => {
    const colorSelected = ObservableArrayEl([]);
    const userColor = Observable('');
    const colorResult = Observable(0);
    const readyToDraw = Observable(false);
    const FOLIAGE_DEGREE= 5;

    const [TreePosition, getOnLeft, getOnMitteA, getOnMitteB, getOnRight] = nTuple(4);
    const x1 = x => Math.max(Math.floor(x * 140), 20);
    const y1 = y => Math.max(Math.floor(y * 220),100);
    const pair1 = Pair(x1)(y1);
    const x2 = x => Math.max(Math.floor(x * 140), 50);
    const y2 = y => Math.max(Math.floor(y * 220),140);
    const pair2 = Pair(x2)(y2);
    const x3 = x => Math.max(Math.floor(x * 140), 60);
    const y3 = y => Math.max(Math.floor(y * 220),50);
    const pair3 = Pair(x3)(y3);
    const x4 = x => Math.max(Math.floor(x * 140), 80);
    const y4 = y =>Math.max(Math.floor(y * 240),30);
    const pair4 = Pair(x4)(y4);

    const positions = [getOnLeft, getOnMitteA, getOnMitteB, getOnRight];
    const treePositions = TreePosition(pair1, pair2, pair3, pair4);

    let dynamicPositions = [];
    const fixedPositions = KeepList([]);
    const setPositions = (colorChosen) => {
        const userColors = colorResult.getValue().slice();

        const userColorIdxArray =[];
        for(let count=1,i=0;count<=FOLIAGE_DEGREE;count++) {
            userColorIdxArray.push(i);
            userColorIdxArray.push(i+1);
            userColorIdxArray.push(i+2);
            userColorIdxArray.push(i+3);
        }

        fixedPositions.clean();
        dynamicPositions = [];
        positions.forEach(p => {
            userColorIdxArray.forEach(i => {
                const x = treePositions(p)(fst)(Math.random());
                const y = treePositions(p)(snd)(Math.random());
                fixedPositions.addItem({xy : Pair(x)(y),  id: userColors[i], correctId: `${colorChosen}${i+1}` });
                dynamicPositions.push({x: x, y: y, id: userColors[i]});
            });
        });
        readyToDraw.setValue(true);
    } 


    const getTreePositions = () => {
        return dynamicPositions.slice();
    }
    const getFixedPositions = ()=> {
        return fixedPositions.getList();
    }


    const orderColors = (colorChosen) => {
        const colors = colorSelected.getArr();
        const modelArr = [];
        const result = ['0','0','0','0'];
        for (let i= 0 ; i<4;i++) {
            modelArr[i] = `${colorChosen}${i+1}`;
        }
        modelArr.forEach( (c,idx)=> {
            const idxSelected = colors.findIndex(selected => c===selected);
            if (idxSelected > -1) {
                colors.splice(idxSelected,1);
                result[idx] = c;
            }
        });
        while (result.findIndex(r=> r==='0') > -1) {
            const rIdx = result.findIndex(r=> r==='0');
            result[rIdx] = colors.pop();
        }
        colorResult.setValue(result);
        setPositions(colorChosen);
    }

    userColor.onChange(orderColors);

    return {
        getColorsSelected:  colorSelected.getArr,
        setColorsSelected:  colorSelected.setArr,
        onChangeColorSel:   colorSelected.onChange,
        userColor :     userColor.setValue,
        onChangeResult:     colorResult.onChange,
        onChangeReadyDraw:  readyToDraw.onChange,
        getTreePositions,getFixedPositions,
        // for testing
        getColorResult: colorResult.getValue, 
        foliageDegree: FOLIAGE_DEGREE
    }

}

/************************************************************************************************
 * TreeGreenView
 * Starting by choosing  (greenSide.onclick/redSide.onclick) using flagStart as Observable when click
 * Following by 3 animations on startTreeGame().
 * Draw a Tree with user selected color
 * Falling leaves if not all colors expected are selected
 * Draw a Tree comparision.
 *
 * @param canvasTree  The Canvas where the Tree is going to be drawn.
 * @returns
 *   initHtmlEl:    Setup all html Elements
 * , initTree:      Setup the entire environment properties and variable to start and re-start
 *
 * @constructor
 *************************************************************************************************/

const TreeGreenView = (canvasTree)=> {

    const treeController=TreeGreenController();
    const ctxTree = canvasTree.getContext('2d');
    canvasTree.style.cursor = 'pointer';
    let flagStart =Observable(false);
    let colorSelectedIdx = 0;
    let numSelected = 0;
    let chooseGreenRed,greenSide,redSide, header,headerTitle, startText,chooseText,
    selText, startContent, canvasContainer;
    let colorBar, colorSelectedEL, colorExpectedEl, colorExpectedTitle, pAgain;
    let copyEl; 
    let checkColor1, checkColor2,checkColor3,checkColor4
    const colorsExpected = [];
    let colorChosen = '';
    let headerClass;


    const initHtmlEl = (choose, greenS,redS, h,hT, stT,stC,
        colorB, colorS, colorExp, colorExpT, pAg, canvasCont,
        checkC1,checkC2,checkC3,checkC4) =>{
        chooseGreenRed =choose;
        greenSide = greenS;
        redSide = redS;
        header =h;
        headerTitle=hT;
        startText = stT.children[0];
        chooseText = stT.children[1];
        selText = stT.children[2];
        startContent =stC;
        colorBar = colorB;
        colorSelectedEL = colorS;
        colorExpectedEl = colorExp;
        canvasContainer = canvasCont;
        colorExpectedTitle=colorExpT;
        pAgain = pAg;
        checkColor1 =checkC1;
        checkColor2= checkC2;
        checkColor3=checkC3;
        checkColor4=checkC4;

    }

    // all reset style, variables, properties, ready to start .
    const initTree = () => {
        colorChosen = '';
        treeController.setColorsSelected(['0','0','0','0']);
        chooseGreenRed.style.display = 'flex';
        chooseGreenRed.style.height = '40rem';
        startContent.style.display='grid';

        startText.innerHTML="";
        chooseText.innerHTML ="";
        selText.innerHTML= "";
        colorSelectedIdx=0;
        numSelected = 0;

        colorExpectedEl.forEach(c=> c.style.display='none');
        colorExpectedTitle.style.display='none';
        canvasContainer.style.display='none';
        header.style.display="none";

        const colorChosenFn = (c) => {
            chooseGreenRed.style.height='0';     
            colorChosen = c;
            flagStart.setValue(true);
        }
        greenSide.onclick = ()=> {
            colorChosenFn('green');
        }
        redSide.onclick = () => {
            colorChosenFn('red');
        }       

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

        if (colorsExpected.length ===0){
            colorBar.forEach( (c,i) => {
                const rgb = window.getComputedStyle(c).backgroundColor;
                if (i < 4)
                    colorsExpected.push({id: `green${i + 1}`, rgb: rgb});
                if (i >= 8)
                    colorsExpected.push({id: `red${i - 7}`, rgb: rgb});
            });
        }
       
        colorBar.forEach( (c) => {
            c.onclick = () => {
                onClickColorBar(c);
            }
        });
       
         selText.onclick =  () => {
             onClickDrawTree();
         }
    }

    // de-select color
    const onClickColorSelected = (c,idx)=> {
            c.style.backgroundColor = '#fdfcfc';
            const arr = treeController.getColorsSelected();
            arr[idx] = '0';
            treeController.setColorsSelected(arr);
    }

    // select color
    const onClickColorBar = (c) =>{
            if (colorSelectedIdx == -1) return;
            const id = c.id;
            const rgb = window.getComputedStyle(c).backgroundColor;
            colorSelectedEL[colorSelectedIdx].style.backgroundColor= rgb;
            const arr = treeController.getColorsSelected();
            arr[colorSelectedIdx] = id;
            treeController.setColorsSelected(arr);
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
        //pass colorChosen and callback to order Colors
        treeController.userColor(colorChosen);
    }



    // all operations over the header, being dynamically set.
    const HeaderViewClass = () => {
        const HEADER_TITLE_1 ='Your choice of ';
        const HEADER_TITLE_2 ='Not of type ';
        const HEADER_TITLE_3 ="Your Tree";
        const HEADER_TITLE_4="Expected Tree";

        const child = (colorChosen== 'red') ? 1 : 0;
        const no_child = (colorChosen== 'red') ? 0 : 1;

        const headerElement = header.children[0].children[child];
        const headerRightElement =  header.children[0].children[1];
        const headerLeftElement =  header.children[0].children[0];
        const headerImage = header.children[0].children[child].children[0];
        const headerImageOther = header.children[0].children[no_child].children[0];

        // remove image header
        const removeImg= ()=> {
            headerImage.style.display='none';
        }
        const removeImgOther = ()=> {
            headerImageOther.style.display="none";
        }
        const setImg = ()=> {
            headerImage.style.display='block';
        }

        const setTitle = (n)=> {
            let h = 'HEADER_TITLE_'+n;
            headerTitle[child].innerHTML =eval(`${h}`)+ colorChosen;
            headerTitle[child].style.padding= '0 1rem';
        }

        const setLeftTitle =()=> {
            headerTitle[0].innerHTML=HEADER_TITLE_3;
        }
        const setRightTitle = ()=> {
            headerTitle[1].innerHTML=HEADER_TITLE_4;
        }

        // header image initial state.
        const setInitialImageState =()=> {
            const transformTxt = `scale(0.1) translateY(-20%)`;
            [headerLeftElement,headerRightElement].forEach(el => {
                if (el.children[0]){
                    el.children[0].style.transform= transformTxt;
                    el.children[0].style.display= 'block';
                }
            })
        }

        const deleteHeader = ()=>{
            headerTitle[child].innerHTML ='';
            headerTitle[child].style.padding="";
        }

        const deleteFinalHeader = () => {
            headerTitle[0].innerHTML = "";
            headerTitle[1].innerHTML = "";

            headerLeftElement.style.background='';
            headerLeftElement.style.padding='';
            headerRightElement.style.background='';
            headerRightElement.style.padding='';

            headerLeftElement.style.backgroundColor='#2ad42a;';
            headerRightElement.style.backgroundColor='#ff3333;';
        }

        const setHeaderStartContent = () => {
            header.style.display="block";
            if (colorChosen == 'red' ) {
                headerLeftElement.style.display="none";
                headerRightElement.style.display="flex";
                headerRightElement.style.width="100%";
            } else {
                headerRightElement.style.display="none";
                headerLeftElement.style.display="flex";
                headerLeftElement.style.width="100%";
            }
        }

        const setCompareHeader =() => {
            const idx = colorsExpected.findIndex(c=> c.id === `${colorChosen}1`);
            headerLeftElement.style.backgroundColor='';
            headerLeftElement.style.background= `linear-gradient(45deg, ${copyEl[0].bk}, ${copyEl[3].bk})`;
            headerLeftElement.style.display='block';
            headerLeftElement.style.width='50%';
            headerLeftElement.style.color='#fdfcfc';
            headerLeftElement.style.padding='2rem 8rem';
            setLeftTitle();
            headerRightElement.style.display='block';
            headerRightElement.style.width='50%';
            headerRightElement.style.background= `linear-gradient(45deg, ${colorsExpected[idx].rgb}, ${colorChosen})`;
            headerRightElement.style.borderLeft = '2px solid grey';
            headerRightElement.style.color='#fdfcfc';
            headerRightElement.style.padding='2rem 6rem';
            setRightTitle();
        }

        return {
            removeImg,setTitle,setInitialImageState,
            deleteHeader,deleteFinalHeader, headerElement, headerImage,
            setHeaderStartContent,setImg,removeImgOther, setCompareHeader
        }
    }

    /************************************************************
     * From colorSelected observable, callback to  render the numbers
     * of colors still to choose
     * @param arr :colorsSelected array
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
     * animationImageGrow():
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

    const animationImageGrow = ()=> {
        let scale = 0.1
        const timer2 = setInterval (()=> {
            scale += 0.1;
            scale = Math.min(scale, 1);
            const transformTxt = `scale(${scale}) translateY(-20%)`;
            headerClass.headerImage.style.transform= transformTxt;
        },300);
        return timer2;
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
       //header for this section.
       headerClass = HeaderViewClass();
       headerClass.setHeaderStartContent();

       const timer1 = animationColorBar();
       const timer2 = animationImageGrow();
       const writing =  animationWriting();
      
        writing.then(r=>{
            clearInterval(timer1);
            clearInterval(timer2);
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
        const colorsId = treeController.getColorsSelected();
       Array.from(colorSelectedEL).forEach( (el,idx) => {
            copyEl.push( {bk:el.style.backgroundColor, id: colorsId[idx]} );
        });
        [0,1,2,3].forEach(num=> {
            let idx = copyEl.findIndex((arrEl) => arrEl.id == c[num]);
            copyEl.splice(num, 0,copyEl[idx]);
        })
        copyEl.splice(4,copyEl.length);
    }

    /***************************************************************************
     * fallingLeaves
     * Animation on canvas, all leaves that does not correspond to  the color
     * expected will fall.
     ******************************************************************************/
    const fallingLeaves = ()=> {
        headerClass.deleteHeader();
        headerClass.setTitle(2);
        const pos = treeController.getTreePositions(); 
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

        headerClass.setHeaderStartContent();
        headerClass.deleteHeader();
        headerClass.setImg();

        // able to deselect colors  again
        colorSelectedEL.forEach(c=> {
                        c.children[0].style.opacity='1';
                        c.children[0].style.pointerEvents='auto';
        });            

    }

    // Once Tree is  drawn, clicking posibilities
    canvasTree.onclick = (e) => {
        const rect = canvasTree.getBoundingClientRect();
        const xClick = e.clientX - rect.left;
        const yClick = e.clientY - rect.top;

        //backwards to choose  colors
        if (xClick < 35 && yClick >= (canvasTree.height-30)) {
            startContentDisplay();
           return;
        }        

        //forward validate colors
        if (xClick >= (canvasTree.width-30) && yClick >= (canvasTree.height-30)) {
            copyEl.every(c=> c.id.includes(colorChosen))
            if ( copyEl.every(c=> c.id.includes(colorChosen)) ) {
                drawCompareTree();
                finalCompare();
                return;
            }
            else {
                fallingLeaves();
                return;
            }
        }

        //forward final result
       if (xClick >= (canvasTree.width-30) && (yClick >= 10 && yClick <=40)) {
            drawCompareTree();    
            finalCompare();
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
            const idx = colorsExpected.findIndex(c=> c.id === `${colorChosen}${i+1}`);
            c.style.backgroundColor= `${colorsExpected[idx].rgb}`;
        });    

        headerClass.removeImgOther();
        headerClass.deleteHeader();
        headerClass.setCompareHeader();

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
        const origPos = treeController.getFixedPositions();
        ctxTree.clearRect(0, 0, canvasTree.width, canvasTree.height);

        origPos.forEach( p => {
            ctxTree.beginPath();
            const idx = copyEl.findIndex(c=> c.id == p.id);
            ctxTree.fillStyle = copyEl[idx].bk;
            ctxTree.arc(p.xy(fst), p.xy(snd), 8, 0, 2 * Math.PI);
            ctxTree.fill();
              // mirror effect
            ctxTree.beginPath();
            const idx2= colorsExpected.findIndex(c=> c.id === p.correctId);
            ctxTree.fillStyle = colorsExpected[idx2].rgb;
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

    const treeHeader = ()=> {
        // header image remove and set header.
        if (headerClass) {
            headerClass.removeImg();
            headerClass.setTitle(1);
        }
    }

    /***************************************************************************
     * drawTree ,
     * Draw the tree with the colors the user has selected.
     ******************************************************************************/
    const drawTree = () => {
        const pos = treeController.getFixedPositions();
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
        pAgain.onclick = ()=> {
            initTree();
            //each color selected reset
            [1,2,3,4].forEach (i=> {
                eval(`checkColor${i}`).innerHTML = '';
            });
            headerClass.setInitialImageState();
            headerClass.deleteHeader();
            headerClass.deleteFinalHeader();
        }
    }

    treeController.onChangeColorSel(updateColorSelected);
    flagStart.onChange(startTreeGame); 
    treeController.onChangeResult(orderColorSelected);
    treeController.onChangeReadyDraw(treeHeader);
    treeController.onChangeReadyDraw(drawTree);

    return {
        initHtmlEl,
        initTree,

        // for testing purposes:
        onClickColorBar, onClickColorSelected, onClickDrawTree, treeController,
        setColorChosen: (c)=> colorChosen=c 
    }
}