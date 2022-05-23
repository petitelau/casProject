import {  ObservableValueMustChange,Observable } from "../../utils/Observables.js";
import { IMAGE_WHITE_RABBIT } from "../../utils/constants.js";

export {GreenMatrixView, GreenMatrixController}

const GreenMatrixController = ()=> {
    const BK ='#402e04'
    let colorValue ='green';
    const colorChosen = ObservableValueMustChange(colorValue);
    const colorBk = ObservableValueMustChange(BK);
    const startAnimation = Observable(false);
    const startMatrix = Observable(false);
    const playAgain = Observable(false);
    const power=Observable(true);

    const changeColorFont = (e, color)=> {
      color == 'green' ? colorChosen.setValue(`rgb(0,${e.target.value},0)`):
                         colorChosen.setValue(`rgb(${e.target.value},0,0)`)
    }

    const changeColorBk = (e)=> {
        e.target.value == 0 ? colorBk.setValue('black') : colorBk.setValue(BK);
    }

    const  startMatrixAnim =()=> {
        startAnimation.setValue(true);
    }
    const reset= ()=> {
        playAgain.setValue(true);
    }

    const on_off = ()=> {
        power.setValue(!power.getValue());
        if (true == power.getValue() ) {
            colorChosen.cleanListeners();
        }
    }

    return {
        changeColorFont, changeColorBk, startMatrixAnim,
        onStartMatrix: startMatrix.onChange,
        startMatrix: startMatrix.setValue,
        onStartAnimation: startAnimation.onChange,
        getColorChosen: colorChosen.getValue,
        onChangeColor: colorChosen.onChange,
        onChangeBk : colorBk.onChange,
        getColorBk : colorBk.getValue,
        onPlayAgain: playAgain.onChange,
        on_off,
        onPower: power.onChange,
        reset
    }
}

const GreenMatrixView= (matrixController, container,playAgain)=> {

    const containerCanvas = container.children[0];
    const visualColor =  container.children[1].children[0].children[0];
    const canvasMatrix= containerCanvas.children[0].children[0];
    const canvasCover = containerCanvas.children[1].children[0];
    const canvasCover2= containerCanvas.children[1].children[1];

    const ctxMatrix = canvasMatrix.getContext('2d');
    const ctxCover = canvasCover.getContext('2d');
    const ctxCover2 = canvasCover2.getContext('2d');

    let waitingClick;

    const setUpCover = ()=> {
        ctxCover.clearRect(0,0, canvasCover.width,canvasCover.height);
        ctxCover2.clearRect(0,0, canvasCover2.width, canvasCover2.height);
        ctxCover.font = '15px Consolas';
        ctxCover.fillStyle = '#00ff00';
        ctxCover.fillText('Wake up, Neo...', 10,40);
        containerCanvas.children[1].style.display='flex';
        playAgain.style.display="none";
        containerCanvas.children[0].style.display='none';
        container.children[1].style.display='none';
        clearInterval(timerMatrix);
        let interval = 0;
        waitingClick = setInterval(()=>{
            interval++;
            if ((interval%2) == 0) {
                ctxCover.clearRect(120, 20, 50, 50)
            } else{
                ctxCover.fillText('_', 120,40);
            }
    
        },800);
    }

    const setBkColor = () => {
        canvasMatrix.style.background=matrixController.getColorBk();
    }

    const initMatrix= () => {
        containerCanvas.children[1].style.display='none';
        playAgain.style.display="block";
        containerCanvas.children[0].style.display='block';
        container.children[1].style.display='grid';
        ctxMatrix.font = '15px Consolas';
        ctxMatrix.fillStyle = 'green';
    }

    const startAnimation = ()=> {
        let x = 80;
        let y= 120;
        const followingRabbit = setInterval(()=>{
            followRabbit(x,y);
            x++;
            if (x>canvasCover.width){
                clearInterval(followingRabbit);
                matrixController.startMatrix(true);
            }   
        },40);
    }  

    const drawDarkHole = () => {
        ctxCover2.beginPath();
        ctxCover2.shadowColor="white";
        ctxCover2.arc(8,30,23,180,Math.PI);
        ctxCover2.strokeStyle='white';
        ctxCover2.lineWidth=8;
        ctxCover2.stroke();
        ctxCover2.arc(30,30,30,180,Math.PI);
        ctxCover2.closePath()
        ctxCover.arc(310,30,25,0,2 *Math.PI);
        ctxCover.strokeStyle='white';
        ctxCover.lineWidth=6;
        ctxCover.shadowBlur=20;
        ctxCover.shadowOffsetX=-10;
        ctxCover.shadowColor="white";
        ctxCover.stroke();
        ctxCover.shadowBlur=0;
        ctxCover.shadowOffsetX=0;
        ctxCover.shadowColor="";
    }
    
    const followRabbit =(x,y)=> {
        ctxCover.clearRect(0,0, canvasCover.width,canvasCover.height);
        ctxCover.fillStyle = '#00ff00';
        ctxCover.shadowOffsetX=0;
        ctxCover.fillText('Wake up, Neo', 10,40);
        ctxCover.fillText('The matrix has you...', 10,60);
        ctxCover.fillText('Follow the white rabbit', 10,80);

        if (x>170){
            drawDarkHole();
        }
        const img = new Image();
        img.onload = function () {
            let a = x-1;
            let y;
            y= (x>130) ? Math.cos(x-100) :(Math.atan(x)*100)-x;
            ctxCover.drawImage(img, x, y, img.width * 0.2, img.height * 0.2);
        };
        img.src = IMAGE_WHITE_RABBIT;
    }

   
const draw = (x,y, txt)=> {
    ctxMatrix.clearRect(x, y, 10, 15);
    ctxMatrix.fillText(txt, x, y+15);
}

const loopDraw = (x,y, txt) => {
    let column = 1;
    let row=0;
   
    while (column < 60) {  
        if (txt[row] === 'letter') {
            const letters = ['f','b','c','d','h'];
            let c= (Math.floor(Math.random()*5));
            txt[row] = letters[c];
            draw(x,y[row], txt[row] )   
            txt[row] = 'letter'; 
        }
        else {
            draw(x,y[row], txt[row] )   
        }
        x= column*10    
        column++;
        row++;
        if (row> 2) row=0;    
    }
}

const setMessage = (color)=>{
    ctxMatrix.fillStyle = color;
    draw(60,15, 'i');
    draw(70,45,'c');
    draw(70,60,'a');
    draw(70,75,'n');
    draw(120,75,'r');
    draw(130,75,'e');
    draw(140,75,'a');
    draw(150,75,'d');
    draw(100,105,'t');
    draw(110,105,'h');
    draw(120,105,'e');
    draw(70,135,'m');
    draw(90,150,'a');
    draw(100,165,'t');
    draw(110,180,'r');
    draw(120,195,'i');
    draw(130,210,'x');

}

const blitzLines = (x)=> {
    //let x = 10;
    ctxMatrix.beginPath();
    ctxMatrix.clearRect(x*3, 10, 3, 200);
    ctxMatrix.strokeStyle = 'rgba(0,250,0,0.5)';
    ctxMatrix.lineWidth=3;
    ctxMatrix.moveTo(x*3,10);
    ctxMatrix.lineTo(x*3,200);
    ctxMatrix.lineCap='round';
    ctxMatrix.stroke();
    ctxMatrix.closePath();
    ctxMatrix.beginPath();
    ctxMatrix.clearRect(x*15, 30, 3, 250);
    ctxMatrix.moveTo(x*15,30);
    ctxMatrix.lineTo(x*15,250);
    ctxMatrix.stroke();
    ctxMatrix.closePath();
    ctxMatrix.beginPath();
    ctxMatrix.clearRect(x*25, 20, 3, 210);
    ctxMatrix.moveTo(x*25,20);
    ctxMatrix.lineTo(x*25,210);
    ctxMatrix.stroke();
    ctxMatrix.closePath();
    ctxMatrix.fillStyle = 'green';
}
let timerMatrix;
const onTheMatrix = () => {
    const zero='0';
    const uno='1';
    let i=0;
    let x=1;
    let y=0;
    let y2=y;
    let y3=y;
    timerMatrix = setInterval( ()=> {
        i++;
        let p,o,b;
        p = (i%2==0) ? zero : uno;
        o = (i%2==0) ? uno : zero;
        b = (i%40==0) ? 8 : 10;

        loopDraw(x, [y,y2,y3], [o,'letter',p]);
        if (i>30)setMessage(matrixController.getColorChosen());
        blitzLines(b);

        y=y+15;
        y2=y2+15;
        y3=y3+15;

        if (y> 300) y=0;
        if (y2>150) y2=0;
        if (y3>220) y3=0;

    }, 50);
}

const setVisual= () => {
   visualColor.innerHTML = matrixController.getColorChosen();
}

const turnOffOn = (val) =>{
    if (true === val) {
        onTheMatrix();
        matrixController.onChangeColor(setVisual);
    }
    else {
        clearInterval(timerMatrix);
        matrixController.onChangeColor(setMessage);
    }  
}


matrixController.onStartAnimation(startAnimation);
matrixController.onStartAnimation(()=>clearInterval(waitingClick));
matrixController.onStartMatrix(initMatrix);
matrixController.onStartMatrix(setBkColor);
matrixController.onStartMatrix(onTheMatrix);
matrixController.onChangeBk(setBkColor);
matrixController.onChangeColor(setVisual);

matrixController.onPlayAgain(setUpCover);
matrixController.onPower(turnOffOn);
setUpCover();

}