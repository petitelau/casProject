export {TreeHeaderProjector}

/**
 *
 * @param treeController
 * @param rootElement
 * @param tree
 * @constructor
 */
const TreeHeaderProjector = (treeController, rootElement, tree) =>{

    const HEADER_TITLE_1 ='Your choice of ';
    const HEADER_TITLE_2 ='Not of type ';
    const HEADER_TITLE_3 ="Your Tree";
    const HEADER_TITLE_4="Expected Tree";

    let colorChosen;
    let colorDivision;
    let headerElement,headerRightElement,  headerLeftElement;
    let headerImage1,  headerImage2;
    let headerImage, headerImageOther;
    let child, no_child
    const headerTitle = [];

    const init = _ => {
        colorDivision= document.createElement("DIV");
        colorDivision.setAttribute('class', 'colorDivision');
        headerLeftElement= document.createElement("DIV");
        headerLeftElement.setAttribute('class', 'greenColorSide');
        headerRightElement = document.createElement("DIV");
        headerRightElement.setAttribute('class', 'redColorSide');

        colorChosen = tree;
        (colorChosen == 'red') ? child=1 : child=0;
        (colorChosen == 'red') ? no_child= 0 : no_child=1;

        (colorChosen == 'red') ? headerElement = headerRightElement : headerElement = headerLeftElement;

        headerImage1 = document.createElement("IMG");
        headerImage1.setAttribute('class', 'growtree');
        headerImage1.setAttribute('src','./img/greenTree.png');

        headerImage2 = document.createElement("IMG");
        headerImage2.setAttribute('class', 'growtree');
        headerImage2.setAttribute('src', './img/redTree.png');

        (colorChosen == 'red') ? headerImage  = headerImage2 : headerImage = headerImage1;
        (colorChosen == 'red') ? headerImageOther  = headerImage1 : headerImageOther = headerImage2;
        const p1= document.createElement("P");
        p1.setAttribute('class', 'treeHeaderTitle');
        const p2= document.createElement("P");
        p2.setAttribute('class', 'treeHeaderTitle');
        headerTitle.push(p1);
        headerTitle.push(p2);

    }

    const setHeaderStartContent = () => {
        if (colorChosen === 'red' ) {
            headerLeftElement.style.display="none";
            headerRightElement.style.display="flex";
            headerRightElement.style.width="100%";
        } else {
            headerRightElement.style.display="none";
            headerLeftElement.style.display="flex";
            headerLeftElement.style.width="100%";
        }
        rootElement.style.display="block";
    }

    const animationImageGrow = ()=> {
        let scale = 0.1
        const timer2 = setInterval (()=> {
            scale += 0.1;
            scale = Math.min(scale, 1);

            const transformTxt = `scale(${scale}) translateY(-20%)`;
            headerImage.style.transform= transformTxt;
            if (scale == 1) clearInterval(timer2);
        },300);
    }


    const removeImg= ()=> {
        headerImage.style.display='none';
    }
    const setTitle = (n)=> {
        let h = 'HEADER_TITLE_'+n;
        headerTitle[child].innerHTML =eval(`${h}`)+ colorChosen;
        headerTitle[child].style.padding= '0 1rem';
    }

    const registerObs = ()=> {
        treeController.getTree().onChangeReadyDraw(()=>{
            removeImg();
            setTitle(1);
        });
    }
    const setLeftTitle =()=> {
        headerTitle[0].innerHTML=HEADER_TITLE_3;
    }
    const setRightTitle = ()=> {
        headerTitle[1].innerHTML=HEADER_TITLE_4;
    }

    const removeImgOther = ()=> {
        headerImageOther.style.display="none";
    }
    const deleteHeader = ()=>{
        headerTitle[child].innerHTML ='';
        headerTitle[child].style.padding="";
    }
    const setCompareHeader =() => {
        const copyEl = treeController.getTree().colorsSelectedBk;
        const idx = treeController.colorsExpected.findIndex(c=> c.id === `${colorChosen}1`);
        headerLeftElement.style.backgroundColor='';
        headerLeftElement.style.background= `linear-gradient(45deg, ${copyEl[0]}, ${copyEl[3]})`;
        headerLeftElement.style.display='block';
        headerLeftElement.style.width='50%';
        headerLeftElement.style.color='#fdfcfc';
        headerLeftElement.style.padding='2rem 8rem';
        setLeftTitle();
        headerRightElement.style.display='block';
        headerRightElement.style.width='50%';
        headerRightElement.style.background= `linear-gradient(45deg, ${treeController.colorsExpected[idx].rgb}, ${colorChosen})`;
        headerRightElement.style.borderLeft = '2px solid grey';
        headerRightElement.style.color='#fdfcfc';
        headerRightElement.style.padding='2rem 6rem';
        setRightTitle();
    }

    const treeCompareHeader = ()=> {
        removeImgOther();
        deleteHeader();
        setCompareHeader();
    }

    // header image initial state.
    const setInitialImageState =()=> {
        const transformTxt = `scale(0.1) translateY(-20%)`;
        [headerLeftElement,headerRightElement].forEach(el => {
            if (el.children[0]){
                el.children[0].style.transform= transformTxt;
                el.children[0].style.display= 'block';
            }
        })
    }

    const deleteFinalHeader = () => {
        if (headerLeftElement.childNodes.length >0) {
            headerLeftElement.removeChild(headerImage1);
            headerLeftElement.removeChild(headerTitle[0]);
            headerRightElement.removeChild(headerImage2);
            headerRightElement.removeChild(headerTitle[1]);
            colorDivision.removeChild(headerLeftElement);
            colorDivision.removeChild(headerRightElement);
            rootElement.removeChild(colorDivision);
        }
        else {
            headerTitle[0].innerHTML = "";
            headerTitle[1].innerHTML = "";
            headerLeftElement.style.background='';
            headerLeftElement.style.padding='';
            headerRightElement.style.background='';
            headerRightElement.style.padding='';
            headerLeftElement.style.backgroundColor='#2ad42a;';
            headerRightElement.style.backgroundColor='#ff3333;';
        }
    }
    const setImg = ()=> {
        headerImage.style.display='block';
    }


    treeController.onTreeCompare(treeCompareHeader);
    treeController.onTreeFalling( ()=>{
            deleteHeader();
            setTitle(2);
    });
    treeController.onTreeSetUp(()=> {
            rootElement.style.display="none";
            setInitialImageState();
            deleteHeader();
            deleteFinalHeader();
    });
    treeController.onReDraw( ()=> {
            setHeaderStartContent();
            deleteHeader();
            setImg();
    });

    init();
    setHeaderStartContent();
    animationImageGrow();
    registerObs();

    headerLeftElement.appendChild(headerImage1);
    headerLeftElement.appendChild(headerTitle[0]);
    headerRightElement.appendChild(headerImage2);
    headerRightElement.appendChild(headerTitle[1]);
    colorDivision.appendChild(headerLeftElement);
    colorDivision.appendChild(headerRightElement);
    rootElement.appendChild(colorDivision);
}