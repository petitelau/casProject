/**
 * Assert class
 * 
 */
const Assert = () => {
    const ok = [];
    const msg =[];
    const failProcess = (message, msgFailed)=>{  
        console.error(msgFailed);
        if (message !== "") { 
            msgFailed += ' Msg:'+message+'.';
            console.log(message); 
        }
        msg.push(msgFailed);
        ok.push(false);
    }
    const equals = (a, b, message="") => {
        if (a === b) {
            ok.push(true);
            msg.push('ok');
        } else {
          let msgFailed="Test failed! Should equals [" + a + "] to [" + b + "]";
          failProcess(message, msgFailed);
        }
    }
    const notEquals =(a, b, message="") => {
        if (a !== b) {
            ok.push(true);
            msg.push('ok');
        } else {
            let msgFailed="Test failed! Should not be equal [" + a + "] to [" + b + "]";
            failProcess(message, msgFailed);
        }
    }
    const equalsAllArray = (a, b, message="") => {
      if (a.length === b.length) {
          if (a.every((el,idx)=> el === b[idx])) {
            ok.push(true);
            msg.push('ok');
            return;  
          } 
      }
      let msgFailed="Test failed! Should be equal [" + a + "] to [" + b + "]";
      failProcess(message, msgFailed);
    }
    return {
        getOk: () => ok,
        getMsg: ()=> msg,
        equals: equals,
        notEquals: notEquals,
        equalsAllArray
    }
}

/**
 * providing a scope and name for a test callback that fills the array
 * of boolean checks
 * @param {string} origin
 * @param {function(Assert): void} callback
 */
const test = (origin, callback) => {
    const assert = Assert();        //    das ok anlegen
    callback(assert);               //    das ok befüllen
    report(origin, assert.getOk(), assert.getMsg()); //    report mit name und ok aufrufen
};


/**
 * report :: String, [Bool] -> DOM ()
 * Report reports the list of boolean checks
 * @param {string}      origin: where the reported tests come from
 * @param { [boolean] } ok:     list of applied checks
 */
 function report(origin, ok, failMsg) {
    let htmltext = '';
    let htmltext2 ='';
    const list = document.querySelector('.grid-test-results');
    //const list  = r.children[1];

    if (ok.every(t=> true===t) ) {
        htmltext += `<p  class="test-row-ok">${origin}</p>
                     <p  class="test-row-ok">${ok.length}</p>
                     <p  class="test-row-ok">OK</p>`;
                    
        list.innerHTML += htmltext;      
        return      
    }

    htmltext += ' <input id="toggle" class="hidden" type="checkbox">'
    htmltext += `<label for="toggle" class="toggle test-row-ok" type="checkbox">&nbsp; ${origin}</label>`
    htmltext += `<p class="test-row-ko">${ok.length}</p>
                <p class="test-row-ko">Failed</p>`



    htmltext += `<div class="collapsible">`;
    ok.forEach( (t,idx) => {
            let i= idx+1;
            if (true==t){
                htmltext += `<p class="test-row-ok" >${origin}</p>
                              <p class="test-row-ok">${i}</p>
                              <p class="test-row-ok">OK</p>`
            } 
            else {
                htmltext += `<p class="test-row-ko">${origin}: ${failMsg[idx]}</p>
                <p class="test-row-ko">${i}</p>
                <p class="test-row-ko">Failed</p>`
            }
    })
    htmltext +=    `</div>`;

    list.innerHTML += htmltext;
}
