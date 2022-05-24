export {Scheduler}

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



