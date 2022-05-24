import {Observable, ObservableArrayEl} from "../../utils/Observables.js";
import {fst, nTuple, Pair, snd} from "../../utils/lambda.js";
import {Attribute} from "./Presentation-Model.js";

import { VALUE, START, REDRAW, FINISH, COMPARE, FALLING, SETUP } from "./Presentation-Model.js";

export {TreeGreenController}

/**
 * Control the flow to draw a Tree using Attribute
 * @returns {{setColorsExpected: setColorsExpected, onTreeSetUp: onChange,
 * treeFalling: setValue, startDraw: setValue, treeFinish: setValue, replay: replay,
 * treeCompare: setValue, reDraw: setValue, getTree: (function(): *),
 * startView: onChange, onTreeCompare: onChange, colorsExpected: [],
 * onTreeFalling: onChange, startTree: startTree, onReDraw: onChange}}
 *
 */
const TreeGreenController = () => {

    const treeColor = Attribute('');

    const colorsExpected = [];
    const colorsSelectedBk = [];

    const setColorsExpected = (colorBar) => {
        if (colorsExpected.length ===0){
            colorBar.forEach( (c,i) => {
                const rgb = window.getComputedStyle(c).backgroundColor;
                colorsExpected.push({id: c.id, rgb: rgb});
            });
        }
    }

    /**
     *  Determine the positions on the tree and order the colors as expected following a model of reds or greens.
     * @param colorChosen
     * @returns {{colorSelected,
     * onChange , cleanUp: cleanUp, setArr: setArr}, FOLIAGE_DEGREE: number,
     * getColorResult, cleanUp: cleanUp,
     * onChangeResult: onChange,
     * orderColors: orderColors,
     * getTreePositions,            // [] array with positions calculated for canvas.
     * onChangeReadyDraw: onChange, // Observable when positions and colors are set.
     * setColorSelected: setArr,
     * getFixedPositions,           //  [] array with positions calculated for canvas set up with pair. so they dont change.
     * colorsSelectedBk: []}}
     * @constructor
     */
    const Tree = (colorChosen)=> {
        const FOLIAGE_DEGREE= 5;
        //Updated when select or de-select a color. It observes the number the colors still to choose.
        const colorSelected = ObservableArrayEl(['0','0','0','0']);
        //keeping the order of the colors when user click on Draw
        const colorResult = Observable(0);
        const readyToDraw = Observable(false);

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
        let fixedPositions = [];

        const setPositions = () => {
            const userColors = colorResult.getValue().slice();
            fixedPositions = [];
            dynamicPositions = [];
            const userColorIdxArray =[];
            for(let count=1,i=0;count<=FOLIAGE_DEGREE;count++) {
                userColorIdxArray.push(i);
                userColorIdxArray.push(i+1);
                userColorIdxArray.push(i+2);
                userColorIdxArray.push(i+3);
            }
            positions.forEach(p => {
                userColorIdxArray.forEach(i => {
                    const x = treePositions(p)(fst)(Math.random());
                    const y = treePositions(p)(snd)(Math.random());
                    fixedPositions.push({xy : Pair(x)(y),  id: userColors[i], correctId: `${colorChosen}${i+1}` });
                    dynamicPositions.push({x: x, y: y, id: userColors[i]});
                });
            });
            readyToDraw.setValue(true);
        }

        const orderColors = () => {
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
            setPositions();
        }
        const getTreePositions = () => {
            return dynamicPositions.slice();
        }
        const getFixedPositions = ()=> {
            return fixedPositions;
        }

        const cleanUp = ()=>{
            colorSelected.cleanUp();
            colorResult.cleanUp();
            readyToDraw.cleanUp();
        }
        return {
            orderColors, FOLIAGE_DEGREE,
            getTreePositions, getFixedPositions,
            getColorSelected:  colorSelected.getArr,
            setColorSelected:  colorSelected.setArr,
            colorSelected, colorsSelectedBk,
            getColorResult:     colorResult.getValue,
            onChangeResult:     colorResult.onChange,
            onChangeReadyDraw:  readyToDraw.onChange,
            cleanUp
        }
    }

    let tree;
    const startTree = (c) => {
        tree = Tree(c);
        treeColor.getObs(VALUE).setValue(c);
    }
    treeColor.getObs(START).onChange(()=> tree.orderColors());


    const getTree = ()=> {
        return tree;
    }
    const replay=() => {
        treeColor.getObs(SETUP).setValue('setup');
    }

    treeColor.getObs(SETUP).setValue('setup');
    treeColor.getObs(FINISH).onChange(()=>tree.cleanUp());


    return {
        startTree, getTree,
        colorsExpected, setColorsExpected,
        startView:          treeColor.getObs(VALUE).onChange,
        startDraw:          treeColor.getObs(START).setValue,
        onTreeSetUp:        treeColor.getObs(SETUP).onChange,
        treeFinish:         treeColor.getObs(FINISH).setValue,
        treeFalling:        treeColor.getObs(FALLING).setValue,
        onTreeFalling:      treeColor.getObs(FALLING).onChange,
        treeCompare:        treeColor.getObs(COMPARE).setValue,
        onTreeCompare:      treeColor.getObs(COMPARE).onChange,
        reDraw :            treeColor.getObs(REDRAW).setValue,
        onReDraw:           treeColor.getObs(REDRAW).onChange,
        replay
    }

}