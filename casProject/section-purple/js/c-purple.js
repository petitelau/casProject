export {PurpleView, PurpleController};
import { ColorsBlindProjector } from "./ColorsBlindProjector.js";



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

const PurpleView = (pController, rootElement) => {

    ColorsBlindProjector(pController, rootElement);
}

