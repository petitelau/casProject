import { VALUE } from "../../utils/Presentation-Model.js";

export { colorBarProjector, sectionProjector, closeAll };

const MASTER_PREFIX = "b_";
const DETAIL_PREFIX = "c_";

const getSectionColorRightSize = (numBookmark) => {
  const sizeBookmark = 6.4;
  const rightValue = sizeBookmark * (numBookmark - 1);
  const sizeRem = rightValue + "rem";
  return sizeRem;
};

const setRightRem = (bookmarkNum) => (idHtmlElement) =>
  (idHtmlElement).style.right = getSectionColorRightSize(bookmarkNum);

let numItems;  
let navItems;

const colorBarProjector = (
  listController,
  selectionController,
  color,
  attrNames
) => {
  navItems = listController.navItems;
  numItems = listController.navItems.length;
  const openColor = (idHtmlElement,c) => {
    setRightRem(numItems)(idHtmlElement);
    let i = 1;
    listController.navItems.forEach((item) => {
      if (item !== c) {
        setRightRem(listController.navItems.length - i)(
          document.getElementById(`${MASTER_PREFIX}${item}`)
        );
        i++;
      }
    });
  };

  attrNames.forEach((attr) => {
    const c = color[attr].getObs(VALUE);
    const htmlEL = document.getElementById(MASTER_PREFIX + c.getValue());
    htmlEL.onclick = (e) => {
      selectionController.setSectionSelected(color);
      openColor(e.target, c.getValue());
    };
  });
};

// flip : switch open and close section
const flipClosing = (a) => (b) => closing(b)(a);
const closing = (a) => (b) => (id) => {
  id.classList.remove(a);
  id.classList.add(b);
};
const open = "open-section";
const close = "close-section";
const closingSection = closing(open)(close);
const openingSection = flipClosing(open)(close);

const sectionProjector = (color, attrNames) => {
  const openColor = (colorEL, c) => {
    setRightRem(numItems)(colorEL);
    openingSection(colorEL);
    // get the bookmark not selected and on a loop for each c-color section
    let i = 1;
    navItems.forEach((item) => {
      if (item !== c) {
        setRightRem(numItems - i)(
          document.getElementById(`${DETAIL_PREFIX}${item}`)
        );
        //remove class open section
        closingSection(document.getElementById(`${DETAIL_PREFIX}${item}`));
        i++;
      }
    });
  };

  attrNames.forEach((attr) => {
    const c = color[attr].getObs(VALUE);
    const colorEL = document.getElementById(DETAIL_PREFIX + c.getValue());
    openColor(colorEL, c.getValue());
  });
};

const closeAll = (listController) => {
  navItems.forEach((item) => {
    closingSection(document.getElementById(DETAIL_PREFIX + item));
  });
};
