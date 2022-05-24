import {TreeHeaderProjector} from "./TreeHeaderProjector.js";

export {TreeHeaderView}
// all operations over the header, being dynamically set.

/**
 *
 * @param treeController
 * @param h
 * @constructor
 */
const TreeHeaderView = (treeController, h) => {
    const header =h;

    const render = tree => TreeHeaderProjector(treeController, header, tree);

    treeController.startView(render);

}