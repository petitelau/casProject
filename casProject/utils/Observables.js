export { ObservableList, Observable,
         ObservableValueMustChange, ObservableArrayEl , ObservableListNav}


const Observable =  value => {
    let listeners = [];
    return {
        getValue: ()=> value,
        setValue: newValue => {
            value= newValue;
            listeners.forEach(callback=> callback(value) )
        },
        onChange: (callback) => {
            listeners.push(callback)
        },
        cleanUp:  ()=> {
            listeners = listeners.splice(0, listeners.length);
        }
    }
}
const ObservableValueMustChange= value => {
    let listeners = [];
    return {
        getValue: ()=> value,
        setValue: (newValue,item) => {
            if (value === newValue) return;
            value= newValue;
            listeners.forEach(callback=> callback(value,item) )
        },
        onChange: (callback) => {
            listeners.push(callback)
        },
        cleanListeners: ()=> {
            listeners = listeners.splice(0, listeners.length);
        }
    }
}

const ObservableArrayEl = arr => {
    let listeners = [];
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
        getArr:  ()=> arr.slice(),
        cleanUp: ()=> {
            listeners = listeners.splice(0, listeners.length);
        }

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

const ObservableListNav = list => {
    const listeners = [];
  
    return {
        onAdd: callback => {
            listeners.push(callback);
        },
        add: (item)=> {
            list.push(item);
            listeners.forEach(callback => callback(item));
        }
    }
}
