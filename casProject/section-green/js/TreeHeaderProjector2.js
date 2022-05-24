export {TreeHeaderProjector}

/**
 *
 * @param treeController
 * @param rootElement
 * @param tree
 * @constructor
 */
const TreeHeaderProjector = (treeController, rootElement, tree) => {
    let colorDivision;
    const init = _ => {

        colorDivision = document.createElement("DIV");
        colorDivision.setAttribute('class', 'colorDivision');
        colorDivision.style.backgroundImage = 'url(./section-green/svg/tree.svg)';
        colorDivision.style.backgroundSize= '45rem';
        colorDivision.style.backgroundRepeat="no-repeat";
        colorDivision.style.height='35rem';

    }

    treeController.onTreeSetUp(()=> {
        if (rootElement.childNodes.length >0 &&
            undefined !== rootElement.children[0]) {
                rootElement.removeChild(rootElement.children[0]);
        }
        rootElement.style.display="none";
    });

    init();
    rootElement.appendChild(colorDivision);
    rootElement.style.display="block";
}