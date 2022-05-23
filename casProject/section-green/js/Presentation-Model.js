import {Observable} from "../../utils/Observables.js";
export {Attribute, VALUE, START, SETUP, FALLING,COMPARE, REDRAW,FINISH}

const VALUE = "value";
const START = "start";
const SETUP = "setup";
const FALLING = "falling";
const COMPARE = "compare";
const REDRAW = "redraw";
const FINISH = "finish";

const Attribute = value => {

    const observables = {}
    const hasObs = name => observables.hasOwnProperty(name);

    const getObs = (name, initialValue = null) =>
        hasObs(name) ? observables[name] : observables[name] = Observable(initialValue);

    getObs(VALUE,value);

    return { getObs }
}