export {PurpleView, PurpleController};
import { ColorsBlindProjector } from "./ColorsBlindProjector.js";


/**
 * Controls the slider function for the image with.
 * @returns {{movingCircle2: {setDeltaPosition: (function(*): *),
 * setInitialFlag: (function(*): *),
 * getDeltaPosition: (function(): number),
 * getInitialFlag: (function(): boolean),
 * setMouseDownFlag: (function(*): *),
 * isMouseDownFlag: (function(): boolean)},
 * movingCircle1: {setDeltaPosition: (function(*): *),
 * setInitialFlag: (function(*): *),
 * getDeltaPosition: (function(): number),
 * getInitialFlag: (function(): boolean),
 * setMouseDownFlag: (function(*): *),
 * isMouseDownFlag: (function(): boolean)}}}
 * @constructor
 */
const PurpleController = () => {

    const movingCircleClass = () => {
        let mouseDownFlag = false;
        let deltaPosition = 0;
        let initialFlag = true;
        return {
            isMouseDownFlag: () => mouseDownFlag,
            getDeltaPosition: () => deltaPosition,
            setDeltaPosition: (d) => deltaPosition = d,
            setMouseDownFlag: (fl) => mouseDownFlag = fl,
            getInitialFlag: () => initialFlag,
            setInitialFlag: (fl) => initialFlag = fl
        }
    }
    const movingCircle1 = movingCircleClass();
    const movingCircle2 = movingCircleClass();

    return {
        movingCircle1, movingCircle2
    }

}

/**
 *
 * @param pController
 * @param rootElement
 * @constructor
 */
const PurpleView = (pController, rootElement) => {

    ColorsBlindProjector(pController, rootElement);
}

