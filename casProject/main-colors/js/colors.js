import { Pair, fst, snd } from "../../utils/lambda.js";
import {Observable} from "../../utils/Observables.js";
import {IMAGE_SNOOPY} from "../../utils/constants.js";

export { MainColorsView, MainColorsController};

const MainColorsController = () => {

  const sectionColorOpen = Observable('');
  const sectionColorClose = Observable(false);
  const isOpen = Observable(false)

  const openColor = (c) => {
    sectionColorOpen.setValue(c);
    isOpen.setValue(true)
  }
  const closeColor = () => {
    sectionColorClose.setValue(true);
    isOpen.setValue(false)
  }

  const getSectionColorRightSize = (numBookmark) => {
    const sizeBookmark = 6.4;
    const rightValue = sizeBookmark * (numBookmark - 1);
    const sizeRem = rightValue + "rem";
    return sizeRem;
  };

  return {
    openColor,closeColor,
    getSectionColorRightSize,
    onOpenColorSection : sectionColorOpen.onChange,
    onCloseColorSection: sectionColorClose.onChange,
    onSectionOpen : isOpen.onChange
  }
}


const MainColorsView = (mainColorsController) => {

  let b_green, b_blue, b_purple, c_green, c_blue, c_purple 
  let bookmarks;
  let macImg, credits_box, credit_canvas, home, cas, hero;

  const initColorSections = (c_g, c_b, c_p, b_g, b_bl, b_p, bookm) => {
    c_green = c_g;
    c_blue = c_b;
    c_purple = c_p;
    b_green = b_g;
    b_blue = b_bl;
    b_purple = b_p;
    bookmarks = bookm;
  };

  const initHtmlEl = (he, credits_b, credit_c, h, c) => {
    credits_box = credits_b;
    credit_canvas = credit_c;
    home = h;
    cas = c;
    macImg = he.children[0].children[2];
    hero = he;
    cas.onmouseover = () => displayCredits();
    cas.onmouseleave = () => hideCredits();
  };

  // Constants

  // flip : switch open and close section
  const flipClosing = (a) => (b) => closing(b)(a);
  const closing = (a) => (b) => (id) => {
    eval(id).classList.remove(a);
    eval(id).classList.add(b);
  };
  const open = "open-section";
  const close = "close-section";
  const closingSection = closing(open)(close);
  const openingSection = flipClosing(open)(close);

  const getNumBookmarks = () => {
    return bookmarks.length;
  };

  const setRightRem = (bookmarkNum) => (idHtmlElement) =>
    (eval(idHtmlElement).style.right = mainColorsController.getSectionColorRightSize(bookmarkNum));

  const openColor = (c) => {
    setRightRem(getNumBookmarks())("b_" + c);
    setRightRem(getNumBookmarks())("c_" + c);
    openingSection("c_" + c);
    // get the bookmark not selected and on a loop for each c-color section
    const bookmarkSelected = "b_" + c;
    let i = 1;
    for (const item of bookmarks) {
      const it = item.id.replace("-", "_");
      if (bookmarkSelected !== it) {
        const cId = "c_" + it.substring(it.indexOf("_") + 1);
        setRightRem(getNumBookmarks() - i)(it);
        //remove class open section
        closingSection(cId);
        i++;
      }
    }
  };

  const closeAll = () => {
    for (let c of ["blue", "green", "purple"]) {
      closingSection("c_" + c);
    }
  };


  const elementsAndEventsAvailable =(isSectionOpen)=> {
    if (isSectionOpen) {
      cas.onmouseover = '';
      cas.onmouseleave = '';
      credits_box.style.left = "-150%";
      macImg.style.display="none";
      hero.style.setProperty('--hide-image','0');
    }
    else {
      cas.onmouseover = () => displayCredits();
      cas.onmouseleave = () => hideCredits();
      macImg.style.display="block";
      credits_box.style.left = "6%";
      hero.style.setProperty('--hide-image','1');
    }
  }

  let timer;
  const displayCredits = () => {
    credits_box.style.opacity = "1";
    const ctx = credit_canvas.getContext("2d");
    let y = 20
    const snoopyUp = Pair(60)(20);
    const snoopyDn = Pair(60)(50);

    const toggle = (s) => (s == snoopyUp ? snoopyDn : snoopyUp);
    let snoopy = snoopyUp;

    const draw = () => {
      snoopy = toggle(snoopy);
      createImage();
    };
    const createImage = () => {
      ctx.clearRect(0, 0, credit_canvas.width, credit_canvas.height);
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, snoopy(fst), snoopy(snd), 90, 90);
      };
      img.src = IMAGE_SNOOPY;
    };
    timer = setInterval(() => draw(), 500);
  };

  const hideCredits = () => {
    credits_box.style.opacity = "0";
    clearInterval(timer);
  };

  mainColorsController.onOpenColorSection(openColor);
  mainColorsController.onCloseColorSection(closeAll);
  mainColorsController.onSectionOpen(elementsAndEventsAvailable);

  return {
    initColorSections,
    initHtmlEl
  };
};

