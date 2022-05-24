export { ColorsBlindProjector };
import { Pair, fst, snd } from "../../utils/lambda.js";

import {
  LETTER_C,
  LETTER_O,
  LETTER_R,
  LETTER_L,
  pathOb,
  pathOa,
} from "./letters.js";
import {
  PENCIL1,
  PENCIL2,
  RUBIK1,
  RUBIK2,
  VEGGIES1,
  VEGGIES2,
  IMG_COLORFUL,
  IMG_BLACKWHITE,
} from "../../utils/constants.js";

export let path1 = "";
export let path2 = "";

// for the look
const lineBetween = (rootElement) => {
  const line = document.createElement("DIV");
  line.style.gridColumn = "1 / -1";
  line.style.border = "3px solid  hsla(280, 40%, 80%,1)";
  line.style.width = "100%";
  rootElement.appendChild(line);
};

const rowWrapper = () => {
  const wrapper = document.createElement("DIV");
  wrapper.setAttribute("class", "grid-row-wrapper");
  return wrapper;
};

// for all sliders
const initHtml = (foto1, foto2, rootElement) => {
  const photoContainer = document.createElement("DIV");
  photoContainer.setAttribute("class", "photo-container");
  const photoContainer1 = document.createElement("DIV");
  photoContainer1.setAttribute("class", "photo-container1");

  const veggies1 = document.createElement("IMG");
  veggies1.setAttribute("src", foto1);
  veggies1.setAttribute("class", "photo1");

  const movPhoto = document.createElement("DIV");
  movPhoto.setAttribute("class", "photo-container2");
  const veggies2 = document.createElement("IMG");
  veggies2.setAttribute("src", foto2);
  veggies2.setAttribute("class", "photo2");

  photoContainer1.appendChild(veggies1);
  movPhoto.appendChild(veggies2);

  photoContainer.appendChild(photoContainer1);
  photoContainer.appendChild(movPhoto);

  const slider = document.createElement("DIV");
  slider.setAttribute("class", "div-photos-slider1");

  const movingCircleEl = document.createElement("DIV");
  movingCircleEl.setAttribute("class", "moving-circle");

  slider.appendChild(movingCircleEl);
  photoContainer.appendChild(slider);

  rootElement.appendChild(photoContainer);

  return {
    movPhoto,
    movingCircleEl,
    slider,
  };
};


const init_rubik = (rootElement) => {
  const rubikContainer = document.createElement("DIV");
  rubikContainer.setAttribute("class", "rubik-container");
  const rubikContainer1 = document.createElement("DIV");
  rubikContainer1.setAttribute("class", "rubik-container1");
  const rubikPhoto = document.createElement("IMG");
  rubikPhoto.setAttribute("class", "rubik-photo");
  rubikPhoto.setAttribute("src", RUBIK1);

  const rubikContainer2 = document.createElement("DIV");
  rubikContainer2.setAttribute("class", "rubik-container2");
  const rubikPhoto2 = document.createElement("IMG");
  rubikPhoto2.setAttribute("class", "rubik-photo");
  rubikPhoto2.setAttribute("src", RUBIK2);

  rubikContainer1.appendChild(rubikPhoto);
  rubikContainer.appendChild(rubikContainer1);
  rootElement.appendChild(rubikContainer);

  rubikContainer2.appendChild(rubikPhoto2);
  rubikContainer.appendChild(rubikContainer2);

  return [rubikPhoto, rubikPhoto2];
};

// color wheel svg
const initSvg = (rootElement) => {
  const svgContainer = document.createElement("DIV");
  svgContainer.setAttribute("class", "svg-container");
  svgContainer.style.width = "30rem";
  svgContainer.innerHTML = `
    <svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" 
    xmlns:cc="http://web.resource.org/cc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:svg="http://www.w3.org/2000/svg" 
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" 
    xmlns:ns1="http://sozi.baierouge.fr" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg2" viewBox="0 0 720 720" version="1.1" inkscape:version="0.91 r13725">
    <g id="g2885" transform="matrix(3.5 0 0 3.5 -831.67 -679.25)">
    <path id="path2861" style="fill:#ff0000" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(0 -.90161 .90161 0 72.801 654.02)"/>
    <path id="path2863" style="fill:#ff8000" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(.45081 -.78082 .78082 .45081 -69.885 472.34)"/>
    <path id="path2865" style="fill:#ffff00" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(.78082 -.45081 .45081 .78082 -102.62 243.66)"/>
    <path id="path2867" style="fill:#80ff00" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(.90161 -2.5145e-16 2.5145e-16 .90161 -16.618 29.25)"/>
    <path id="path2869" style="fill:#00ff00" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(.78082 .45081 -.45081 .78082 165.06 -113.44)"/>
    <path id="path2871" style="fill:#00ff80" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(.45081 .78082 -.78082 .45081 393.75 -146.17)"/>
    <path id="path2873" style="fill:#00ffff" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(3.3766e-16 .90161 -.90161 3.3766e-16 608.16 -60.169)"/>
    <path id="path2875" style="fill:#0080ff" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(-.45081 .78082 -.78082 -.45081 750.84 121.51)"/>
    <path id="path2877" style="fill:#0000ff" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(-.78082 .45081 -.45081 -.78082 783.57 350.19)"/>
    <path id="path2879" style="fill:#8000ff" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(-.90161 5.3302e-16 -5.3302e-16 -.90161 697.58 564.6)"/>
    <path id="path2881" style="fill:#ff00ff" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(-.78082 -.45081 .45081 -.78082 515.89 707.29)"/>
    <path id="path2883" style="fill:#ff0080" d="m495.89 296.89a99.821 99.821 0 0 1 -13.38 49.91l-86.448-49.911z" transform="matrix(-.45081 -.78082 .78082 -.45081 287.21 740.02)"/>
  </g>
 </svg> `;
  rootElement.appendChild(svgContainer);

  return svgContainer;
};

const initCanvas = (rootElement) => {
  const canvasContainer = document.createElement("DIV");
  canvasContainer.setAttribute("class", "coloring-container");
  canvasContainer.style.backgroundImage = `url(${IMG_COLORFUL})`;
  canvasContainer.style.backgroundSize = "cover";
  const canvas = document.createElement("CANVAS");
  canvas.setAttribute("width", "420");
  canvas.setAttribute("height", "530");
  canvas.setAttribute("class", "canvas-color");

  canvasContainer.appendChild(canvas);
  rootElement.appendChild(canvasContainer);

  return canvas;
};

const initLetters = (rootElement) => {
  const letters = [];
  const containerLetters = document.createElement("DIV");
  containerLetters.setAttribute("class", "letterContainer");

  path1 = "";
  path2 = pathOb;
  const container1 = document.createElement("DIV");
  container1.innerHTML = LETTER_C;
  letters.push(container1);
  const container2 = document.createElement("DIV");
  container2.innerHTML = LETTER_O();
  letters.push(container2);
  const container3 = document.createElement("DIV");
  container3.innerHTML = LETTER_L;
  letters.push(container3);
  const container4 = document.createElement("DIV");
  container4.innerHTML = LETTER_O();
  letters.push(container4);
  const container5 = document.createElement("DIV");
  container5.innerHTML = LETTER_R;
  letters.push(container5);

  containerLetters.appendChild(container1);
  containerLetters.appendChild(container2);
  containerLetters.appendChild(container3);
  containerLetters.appendChild(container4);
  containerLetters.appendChild(container5);

  rootElement.appendChild(containerLetters);

  return { containerLetters, letters };
};

/**
 * Projector for section purple
 * @param pController
 * @param rootElement
 * @constructor
 */
const ColorsBlindProjector = (pController, rootElement) => {
  // setup Html
  lineBetween(rootElement);
  const wrapper = rowWrapper();
  const { movPhoto, movingCircleEl, slider } = initHtml(
    VEGGIES1,
    VEGGIES2,
    wrapper
  );

  const movingCircleEl1 = movingCircleEl;
  const movPhoto1 = movPhoto;
  const slider1 = slider;

  const rubiks = init_rubik(wrapper);

  rootElement.appendChild(wrapper);
  lineBetween(rootElement);

  const obj2 = initHtml(PENCIL1, PENCIL2, rootElement);
  const movingCircleEl2 = obj2.movingCircleEl;
  const movPhoto2 = obj2.movPhoto;
  const slider2 = obj2.slider;

  const svgCont = initSvg(rootElement);

  lineBetween(rootElement);

  const canvasColor = initCanvas(rootElement);

  lineBetween(rootElement);

  const { containerLetters, letters } = initLetters(rootElement);

  lineBetween(rootElement);

  // Listeners and beyond.

  // sliders
  const POSITION_AB = 100;
  const photos = [1, 2];

  const photo1 = Pair(movingCircleEl1)(movPhoto1);
  const photo2 = Pair(movingCircleEl2)(movPhoto2);
  const setLeft = (a) => (val) => (a.style.left = val);
  const setWidth = (b) => (val) => (b.style.width = val);

  const inBoundsMove = (x, p) => {
    setLeft(eval("photo" + p)(fst))(x.toString() + "px");
    setWidth(eval("photo" + p)(snd))(x.toString() + "px");
  };

  const validateMove = (x) => (p) =>
    x > 15 && x < 470 ? inBoundsMove(x, p) : "outBounds";
  const slidePhoto = (p) => (val) => {
    validateMove(val)(p);
  };

  const addListenersSliders = (p) => {
    eval("slider" + p).addEventListener("mousemove", (e) => {
      const circ = eval("pController.movingCircle" + p);
      circ.isMouseDownFlag()
        ? slidePhoto(p)(e.x - circ.getDeltaPosition())
        : "unclick";
    });

    eval("slider" + p).addEventListener("mouseup", (e) =>
      eval("pController.movingCircle" + p).setMouseDownFlag(false)
    );

    eval("movingCircleEl" + p).addEventListener("mousedown", (e) => {
      const circ = eval("pController.movingCircle" + p);
      if (circ.getInitialFlag()) {
        circ.setDeltaPosition(e.x - POSITION_AB);
        circ.setInitialFlag(false);
      }
      circ.setMouseDownFlag(true);
    });

    eval("movingCircleEl" + p).addEventListener("mouseup", (e) =>
      eval("pController.movingCircle" + p).setMouseDownFlag(false)
    );
  };

  photos.forEach((p) => inBoundsMove(POSITION_AB, p));
  photos.forEach(addListenersSliders);

  // rubik
  const rubik_toggle = () => {
    let r2 = rubiks[1];
    let op;
    r2.style.opacity == 1 ? (op = 0) : (op = 1);
    r2.style.opacity = op;
  };
  setInterval(() => {
    rubik_toggle();
  }, 2000);

  // wheel
  svgCont.onmouseover = () => {
    const pieSlice = document.querySelectorAll("div.svg-container path");
    const arr = Array.from(pieSlice);
    const blendingModes = ["luminosity", "soft-light", "difference", "normal"];
    let i = 0;
    let mode = blendingModes[i];
    const timer = setInterval(() => {
      let j = blendingModes.findIndex((a) => a == mode);
      arr[i].style.mixBlendMode = blendingModes[j];
      i++;
      if (i > 11) {
        i = 0;
        mode = blendingModes[++j];
        if (j > blendingModes.length - 1) clearInterval(timer);
      }
    }, 30);
  };

  // color canvas
  const ctx = canvasColor.getContext("2d");
  ctx.clearRect(0, 0, canvasColor.width, canvasColor.height);
  ctx.lineWidth = 20;
  ctx.moveTo(0, 0);
  ctx.lineTo(0, canvasColor.height);
  ctx.moveTo(0, 0);
  ctx.lineTo(canvasColor.width, 0);
  ctx.strokeStyle = "black";

  ctx.stroke();
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 7, 5, 420, 530);
  };
  img.src = IMG_BLACKWHITE;

  canvasColor.onclick = (e) => {
    const rect = canvasColor.getBoundingClientRect();

    // transform to canvas.width units
    let percentage = (rect.width * 100) / canvasColor.width;
    let eq = 100 + (100 - percentage);

    let xClick = e.clientX - rect.left;
    xClick = Math.round((xClick * eq) / 100);

    let yClick = e.clientY - rect.top;
    yClick = Math.round((yClick * eq) / 100);

    ctx.clearRect(Math.round(xClick) - 5, Math.round(yClick) - 5, 50, 50);
  };

  // letters

  const positionLetters = () => {
    letters[0].style.transform = "translate(-1rem, 10rem) ";
    letters[1].style.transform = "translate(10rem, 0rem) ";
    letters[2].style.transform = "translate(25rem, 25rem) ";
    letters[3].style.transform = "translate(40rem, 0rem) ";
    letters[4].style.transform = "translate(60rem, 10rem) ";
  };
  positionLetters();

  containerLetters.ondblclick = () => {
    path1 = "";
    path2 = pathOb;
    positionLetters();
    containerLetters.style.background = '';
    letters[1].innerHTML = LETTER_O();
    letters[3].innerHTML = LETTER_O();
    letters[1].classList.remove("animate1");
    letters[3].classList.remove("animate2");
  };
  letters[0].onmouseover = () => {
    letters[1].classList.add("animate1");
    letters[3].classList.add("animate2");
  }

  containerLetters.onclick = () => {
    letters[0].style.transform = "translate(20rem, 10rem) ";
    letters[1].style.transform = "translate(25rem, 10rem) ";
    letters[2].style.transform = "translate(30rem, 10rem) ";
    letters[3].style.transform = "translate(35rem, 10rem) ";
    letters[4].style.transform = "translate(40rem, 10rem) ";

    path1 = pathOa;
    path2 = "";

    setTimeout(() => {
      letters[1].innerHTML = LETTER_O();
      letters[3].innerHTML = LETTER_O();

    }, 2500);

    setTimeout(() => {
      path1 = pathOa;
      path2 = pathOb;
      letters[1].innerHTML = LETTER_O();
      letters[3].innerHTML = LETTER_O();
      containerLetters.style.background = `linear-gradient(90deg, 
          hsla(136, 82%, 72%, 1) 0%, 
          hsla(149, 63%, 50%, 1) 18%, 
          hsla(193, 46%, 55%, 1) 34%, 
          hsla(227, 62%, 67%, 0.5) 52%, 
          hsla(323, 74%, 55%, 0.5) 77%, 
          hsla(63, 96%, 68%, 1) 100%)`;
    }, 3000);
  };
};
