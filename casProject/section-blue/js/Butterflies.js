export {BlueButterfliesView, BlueButterfliesPresentationView, BlueButterfliesController};
import { left, right} from '../../utils/lambda.js';
import {  ObservableArrayEl,   Observable} from "../../utils/Observables.js";
import { Scheduler } from "../../utils/Scheduler.js";
import {blueArray, imageButter} from "../../utils/constants.js";


/**
 * Present this game with a curtain that is  opened using a scheduler
 * @param cLeft
 * @param cRight
 * @param bCover
 * @param bContainer
 * @param pContainer
 * @param bCoverImg
 * @param pAgain
 * @param blueController
 * @constructor
 */
const BlueButterfliesPresentationView = ( cLeft,cRight,bCover,bContainer,pContainer,
                                          bCoverImg,pAgain,blueController) => {

    const openCurtain = (goTimer) => { setTimeout(() => {goTimer();}, 300);};

    const showContainer = (goTimer) => {setTimeout(() => {goTimer();}, 200);};


    const startAnimation = () => {
            const scheduler = Scheduler();
            const allDelayTasks = [];
            cLeft.forEach((c, idx) => {
                allDelayTasks.push((opening) => {
                    openCurtain(() => {
                        cLeft[cLeft.length - (idx + 1)].style.opacity = "0";
                        if (idx > 0) {
                            cRight[idx - 1].style.opacity = "0";
                            cLeft[cLeft.length - idx].style.opacity = "1";
                            cLeft[cLeft.length - idx].style.backgroundColor = "transparent";
                            bCover.style.display = "none";
                            bCoverImg.style.display = "block";
                            bCoverImg.style.filter = "none";
                            if (0 == idx % 2) {
                                bCoverImg.style.filter = "grayscale(90%)";
                            }
                        }
                        opening();
                    });
                });
            });
            allDelayTasks.push((opening) => {
                showContainer(() => {
                    bContainer.style.display = "grid";
                    pContainer.style.display = "none";
                    opening();
                });
            });
            allDelayTasks.forEach((t) => scheduler.add(t));
            pAgain.style.display = "block";
            blueController.init(true);
    };

    const setUpAnimation = () => {
            bContainer.style.display = "none";
            pContainer.style.display = "grid";
            bCover.style.display = "block";
            bCoverImg.style.display = "none";
            cLeft.forEach((c, idx) => {
                cLeft[idx].style.opacity = "1";
                cLeft[idx].style.backgroundColor = `${blueArray[idx]}`;
            });
            cRight.forEach((c, idx) => {
                cRight[idx].style.opacity = "1";
                cRight[idx].style.backgroundColor = `${
                    blueArray[blueArray.length - (idx + 2)]
                }`;
            });
    };

    blueController.onStart(startAnimation);
    blueController.onReplay(setUpAnimation);

}


/**
 *  Manage all butterflies list and individuals.
 * @param w   // canvas width
 * @param h   //  canvas height
 * @returns {{  onGarden:
                init: setValue,
                fly: fly,
                onStart: onChange,
                butterfliesChange,
                onReplay: onChange,
                setUpAnimation: setUpAnimation,
                onStartButterflies: onChange,
                startAnimation: startAnimation,
                newSetButterflies:
 }}

 */
const BlueButterfliesController = (w, h) => {

    const playAnimation = Observable(false);
    const setUpAnim= Observable(false);
    const initButterflies = Observable(false);

    /*
     *  Class for a butterfly containing son image, position,speed,direction,etc
     *  Observable: change direction, so it can eventually change direction.
     */
    const Butterfly = () => {
        const butterflySizeX = 7;
        const butterflySizeY = 10;

        const inboundNeg = { x: 5 - butterflySizeX, y: 5 - butterflySizeY };
        const inboundsPos = { x: w-15, y: h-15  };

        const validateInbounds = x => y => x > inboundNeg.x && y > inboundNeg.y &&
            x < inboundsPos.x && y < inboundsPos.y

        const directions = ["-", "+"];

        const butterfly_color = Math.floor(Math.random() * 6);
        const src = imageButter[butterfly_color];
        const img = new Image();
        const speed = Math.floor(Math.random() * 2);
        const position = {
            x: Math.floor(Math.random() * inboundsPos.x),
            y: Math.floor(Math.random() * inboundsPos.y),
        };
        let directionX = directions[Math.floor(Math.random() * 2)];
        let directionY = directions[Math.floor(Math.random() * 2)];
        let flying = 0;

        const callbackChangeDir = (v,b)=> {
            b.flying = 0;
            b.directionX =v[0];
            b.directionY =v[1];
        }
        const changeDirection = ObservableArrayEl([directionX,directionY]);
        changeDirection.onChange(callbackChangeDir);

        return { src, img, speed, position,
            directionX, directionY, flying,
            changeDir: changeDirection.setArr,
            directions, validateInbounds,
            inboundsPos,inboundNeg
        };
    };

    const Butterflies = (list)=> {
        const numOfButterflies = 20;
        const startButterflies= Observable(list);
        const setReady = () => {
            if (list.length == numOfButterflies) {
                startButterflies.setValue(list);
            }
        }
        return {
            numOfButterflies,
            addItem: item => {
                list.push(item);
                setReady();
            },
            getList: () => list.slice(),
            clean: () => list.splice(0, list.length),
            onStartButterflies: startButterflies.onChange
        }
    }

     //for all butterflies ,in or out bounds.
    const butterflies = Butterflies([]);
    //Observable for butterflies inbounds to filter by color and fill the stats.
    const butterfliesOnGarden = ObservableArrayEl([]);

    const filterButterfliesColors = (allB) => {
        const blueB = allB.filter((b) => b.src.includes("blue"));
        const pinkB = allB.filter((b) => b.src.includes("pink"));
        const purpB = allB.filter((b) => b.src.includes("purple"));
        const magB = allB.filter((b) => b.src.includes("mag"));
        butterfliesOnGarden.setArr([blueB.length, pinkB.length, purpB.length,magB.length]);
    }

    /*
     * newSetButterflies()
     *      Get a new mix of color of butterflies for the garden, all inbounds.
     */
    const newSetButterflies = () => {
        butterflies.clean();
        for (let i = 1; i <= butterflies.numOfButterflies; i++) {
            const b = Butterfly();
            butterflies.addItem(b);
        }
        return butterflies.getList();
    };

    /*
     * fly ():
     *      Calculate next position based on direction and changing direction in time.
     */
    const fly = () => {
        const onGarden = [];
        const outGarden = [];
        butterflies.getList().forEach((b, i) => {
            b.position.x = eval(`${b.position.x} ${b.directionX} ${b.speed}`);
            b.position.y = eval(`${b.position.y} ${b.directionY} ${b.speed}`);
            if (b.flying > 10 ) {
                 const dX = b.directions[Math.floor(Math.random() * 2)];
                 const dY = b.directions[Math.floor(Math.random() * 2)];
                b.changeDir([dX,dY],b);
            }
            b.flying++;
            b.validateInbounds(b.position.x)(b.position.y) ? onGarden.push(b) : outGarden.push(b);
        });

        filterButterfliesColors(onGarden);
    };

    const startAnimation = ()=> {
        playAnimation.setValue(true);
    }
    const setUpAnimation = ()=> {
        setUpAnim.setValue(true);
    }

    butterflies.onStartButterflies(filterButterfliesColors);
    initButterflies.onChange(newSetButterflies);

    return {
        init: initButterflies.setValue,
        onStartButterflies: butterflies.onStartButterflies,
        onStart: playAnimation.onChange,
        onReplay: setUpAnim.onChange,
        startAnimation, setUpAnimation,
        fly,
        newSetButterflies,
        butterfliesChange: butterfliesOnGarden.onChange,
        onGarden: butterfliesOnGarden.getArr
    };
};


/**
 *  Receive the canvas where to draw and all fields for stats
 * @param blueCanvas
 * @param butterflyContent
 * @param statsContent
 * @param statsBlue
 * @param statsPink
 * @param statsPurp
 * @param statsMag
 * @param catchNet
 * @param blueController
 * @constructor
 */
const BlueButterfliesView = (blueCanvas, butterflyContent,statsContent,statsBlue,
                             statsPink,statsPurp,statsMag,catchNet, blueController) => {
    let butterflies
    const ctx = blueCanvas.getContext("2d");

   /*
    * drawButterflies:
    *       Render the butterflies on canvas according to position
    *       calculated by controller.
    */
    const drawButterflies = () => {
        ctx.clearRect(0, 0, blueCanvas.width, blueCanvas.height);
        butterflies.forEach((b) => {
            b.img.onload = function () {
                ctx.drawImage(b.img, b.position.x, b.position.y, 30, 30);
            };
            b.img.src = b.src;
        });
    };

    const increaseSpeed = (b) => b.speed =  (b.speed < 3) ? b.speed+1 : 0;
    /* catchButterflies ():
    *       Re put only the butterflies that were ou of  the garden again in it.
    */
    const catchButterflies = (b) =>
        (b.position = {
            x: Math.floor(Math.random() * b.inboundsPos.x),
            y: Math.floor(Math.random() * b.inboundsPos.y),
        });

    /* renderStats:
    *        When the Observable trigger a change on the stats.
    */
    const renderStats = (onGarden) => {
        statsBlue.innerHTML =  onGarden[0] + ' Blue' ;
        statsPink.innerHTML = onGarden[1] + ' Pink';
        statsPurp.innerHTML = onGarden[2] + ' Purple';
        statsMag.innerHTML = onGarden[3] + ' Violet';
        onGarden.every(c=> c=== 0)
            ? catchNet.style.display = 'flex'
            : catchNet.style.display ='none'
    }

    const either = x => y => b=> b.validateInbounds(x)(y)  ? left(b): right(b);

    let timerBlue;
    let timer;

    /* onMouseover, leave ():
    *     set/clear Interval for butterflies to be render in a new position.
    */
    blueCanvas.onmouseover =  () => { timerBlue = setInterval(() => {
        drawButterflies();
        blueController.fly();
        butterflyContent.style.display="none";
        statsContent.style.display="grid";
    }, timer);
    };

    blueCanvas.onmouseleave = () => { clearInterval(timerBlue);
        catchNet.style.display = 'flex';
        timer = (timer -50) > 60 ? timer-50 : 60;
        butterflies.forEach((b) => {either(b.position.x)(b.position.y)
        (b)(increaseSpeed)(catchButterflies);
        });
    };

    const initGame = (b) => {
        butterflies =b
        ctx.clearRect(0, 0, blueCanvas.width, blueCanvas.height);
        butterflyContent.style.display="grid";
        statsContent.style.display="none";
        timer =300;

    }

    blueController.onStartButterflies(initGame);
    blueController.butterfliesChange(renderStats);

}
