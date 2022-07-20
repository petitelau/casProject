import { Attribute } from "../../utils/Presentation-Model.js";
import { listController } from "./nav-model.js";
import {colorBarProjector, sectionProjector, closeAll} from "./nav-projector.js";
export { MasterView, DetailView, noColor , ColorBar};

// model
const ColorBar = (c) => {
  const nameAttr = Attribute(c);
  return { nameAttr };
};

const noColor = ColorBar("");
const ATTRIBUTES_NAMES = ['nameAttr'];


// views
const MasterView = (listController, selectionController) => {
  const render = (color) =>
    colorBarProjector(
      listController,
      selectionController,
      color,
      ATTRIBUTES_NAMES
    );

  listController.onModelAdd(render);
};

const DetailView = (selectionController) => {
  const render = (color) => sectionProjector(color, ATTRIBUTES_NAMES);

  selectionController.onOpenColorSection(render);
  selectionController.onCloseColorSection(()=> closeAll(listController));
};


