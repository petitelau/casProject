import { Pair, fst, snd } from "../../utils/lambda.js";
import {IMAGE_SNOOPY} from "../../utils/constants.js";

export {MainColorsView}
const MainColorsView = (navController) => {

    let macImg, credits_box, credit_canvas, home, cas, hero;
  
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
  

    navController.onSectionOpen(elementsAndEventsAvailable);
  
    return {
      initHtmlEl
    };
  };
  
  