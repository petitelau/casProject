export { Pair, fst, snd, nTuple, toggle,
        ObservableList, Observable, Scheduler, ObservableValueMustChange,KeepList, ObservableArrayEl,
        left, right }

const Pair = x => y => f => f(x)(y);
const snd = x => y => y;
const fst = x => y => x;

const nTuple = n => [
    (...args) => f => f(args),
    ...Array.from({length:n}, (x,idx) => args => args[idx])
 ];

const toggle = x => x==1 ? 0 : 1;

const left = (x) => (l) => (r) => l(x);
const right = (x, y) => (l) => (r) => r(x, y);

const Observable =  value => {
    const listeners = [];
    return {
        getValue: ()=> value,
        setValue: newValue => {
            value= newValue;
            listeners.forEach(callback=> callback(value) )
        },
        onChange: (callback) => {
            listeners.push(callback) 
        }
    }
}
const ObservableValueMustChange= value => {
    const listeners = [];
    return {
        getValue: ()=> value,
        setValue: (newValue,item) => {
            if (value === newValue) return;
            value= newValue;
            listeners.forEach(callback=> callback(value,item) )
        },
        onChange: (callback) => {
            listeners.push(callback)
        }
    }
}

const ObservableArrayEl = arr => {
    const listeners = [];
    return {
        setArr : (newArr,b) =>  {
            if ( arr.length > 0) {
                const haveChanged = newArr.filter((b,idx) => b == arr[idx]);
                if (haveChanged.length === newArr.length ) return;
            }
            arr = newArr;
            listeners.forEach(callback => callback(arr,b));
        },
        onChange : callback => listeners.push(callback),
        getArr:  ()=> arr.slice()

    }
}


const ObservableList = list => {
    const listeners = [];
    let maxLEVEL;
    let allFinish = false;
    const isFinish = () => {
        if (list.length === maxLEVEL) {
            list.splice(0,list.length);
            allFinish = true;
            return true;
        }
        else return false;
    }
    return {
        newLevel: item => {
            if (undefined == maxLEVEL) maxLEVEL = item.maxLEVEL;
            if (isFinish()) return;
            list.push(item);
            listeners.forEach(callback => callback(item));
        },
        onNextLevel: (callback)=> {
            listeners.push(callback);
        },
        onFinish: ()=> {
            list.splice(0, list.length);
        },
        count: ()=> list.length,
        isAllFinish : ()=> allFinish
    }
}



const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) { return; }
        if (tasks.length === 0) { return; }
        inProcess = true;
        const task = tasks.pop();
        const doit = new Promise( (resolve, reject) => {
            task(resolve);
        }). then ( () => {
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    return {
        add: add,
    }
};


const KeepList= list => {
    return {
        addItem:item=> {
            list.push(item);
        },
        getList: ()=>list.slice(),
        clean: ()=> list.splice(0,list.length),

    }
}
