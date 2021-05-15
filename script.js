import portfolioSVG from "./portfolio.js";
import aboutSVG from "./about.js";
import contactSVG from "./contact.js";
// import textWrapper from "./textWrapper";

const canvas = document.querySelector("#canvas");
// Shadow body to be rendered and position to be calculated dynamically
const shadowBodies = document.querySelectorAll(".shadowBodies");

const maxTranslate = 300;

// Next steps:
// Think about groud plane positions for text elements and parallax.
// Ground plane position will need to be calculated based on coordinates and height of element.

// Background brightness based on height of sun?
// Disable sun / shadows when sun goes below horizon?

// For xMouse shadow transitions: calcShadow function requires an array. Could call function from each object, wrapped in array?
// Add eventlistener for each object in Class? In constructor?

class TextObject {
  constructor(selector, svgWrapper, x, y) {
    this.id = selector;
    this.dom = document.querySelector(selector);
    this.x = x;
    this.y = y;
    this.svgWrapper = svgWrapper;
    this.dom.innerHTML = this.position(x, y, svgWrapper);
    this.bottom = this.dom.getBoundingClientRect().bottom;
    // this.parallaxFactor =
    //   Math.floor((this.bottom / window.innerHeight) * 100) / 100;
    this.innerID = `${selector}Inner`;
    this.innerDom = document.querySelector(this.innerID);
  }
  position(x, y, svgWrapper) {
    return `<svg x=${x || 0} y=${y || 0}>` + svgWrapper;
  }
  moveX(xFactor, yOriginReference) {
    // console.log("Hi");
    // console.log(this.id, this.parallaxFactor);
    const moveFactor =
      ((this.bottom - yOriginReference) /
        (window.innerHeight - yOriginReference)) *
      xFactor;
    console.log(moveFactor) * xFactor;

    this.innerDom.style.transform = `translate3d(${
      maxTranslate * moveFactor
    }px, 0px, 0px)`;
  }
}

const portfolio = new TextObject("#portfolio", portfolioSVG, "20%", "15%");
const about = new TextObject("#about", aboutSVG, "53%", "30%");
const contact = new TextObject("#contact", contactSVG, "70%", "30%");

const objects = [portfolio, about, contact];

// console.log("portfolio", portfolio.parallaxFactor);
// console.log("about", about.parallaxFactor);
// console.log("contact", contact.parallaxFactor);

const sun = {
  dom: document.querySelector("#sun"),
  getCenter() {
    const box = this.dom.getBoundingClientRect();
    const x = (box.right - box.left) / 2 + box.left;
    const y = (box.bottom - box.top) / 2 + box.top;
    return { x, y };
  },
  setX(xCoord) {
    this.dom.setAttribute("cx", xCoord);
    calcShadow(objects);
  },
  setY(yCoord) {
    this.dom.setAttribute("cy", yCoord);
    calcShadow(objects);
  },
  windowScrollYRef: 0,
  parallaxFactor: 2,
  transitioning: false,
  setXPos() {
    this.setX(window.innerWidth / 2);
  },
  initialise() {
    this.setXPos;
    this.setY(window.innerHeight / 4);
    this.dom.addEventListener("mouseover", () => {
      console.log("Hover");
    });
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * this.parallaxFactor;
      this.dom.style.transform = `translate3d(0px, ${rate}px, 0px)`;
    });
    this.dom.addEventListener("transitionstart", () => {
      if (this.transitioning === false) {
        this.transitioning = true;
        this.moveShadows();
      }
    });
    this.dom.addEventListener("transitionend", () => {
      this.transitioning = false;
      clearInterval(this.shadowMovement);
      this.shadowMovement = null;
    });
  },
  shadowMovement: null,
  moveShadows() {
    if (!this.shadowMovement) {
      this.shadowMovement = setInterval(() => {
        calcShadow(objects);
      }, 50);
    }
  },
};

const calcShadow = (objects) => {
  // console.log("Calc shadow");
  objects.forEach((object, index) => {
    const box = object.dom.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();

    if (sun.getCenter().y < box.bottom) {
      shadowBodies[index].setAttribute(
        // Need to add "+ window.scrollY" to each y element, if css position is not set to fixed.

        "points",
        `
        ${box.left},
        ${box.bottom} 
        ${box.right},
        ${box.bottom} 
        ${projectedX(
          sun.getCenter().x,
          sun.getCenter().y,
          box.right,
          box.bottom,
          canvasBox.bottom
        )},
        ${canvasBox.bottom} 
        ${projectedX(
          sun.getCenter().x,
          sun.getCenter().y,
          box.left,
          box.bottom,
          canvasBox.bottom
        )},
        ${canvasBox.bottom}
        `
      );
    } else {
      shadowBodies[index].setAttribute("points", "0,0 0,0 0,0 0,0");
    }
  });
};

// Create function which returns x and y coordinate at bottom of canvas.
// Function returns projected point/ corner of shadow from light source, shadow origin coords and Y plane.
const projectedX = (srcX, srcY, intX, intY, planeY) => {
  const ratio = (planeY - srcY) / (planeY - srcY - (planeY - intY));
  return srcX - (srcX - intX) * ratio;
};

// // SHOULD USE BOUNDING BOX INSTEAD 'getBoundingClientRect()'
// // Hover portfolio
// portfolio.addEventListener("mouseenter", () => {
//   portfolio.setAttribute("fill", "orange");
// });
// // Hover portfolio
// portfolio.addEventListener("mouseleave", () => {
//   portfolio.setAttribute("fill", "black");
// });

window.addEventListener("load", () => {
  calcShadow(objects);
});
window.addEventListener("resize", () => {
  calcShadow(objects);
  sun.setXPos();
});
window.addEventListener("scroll", () => {
  calcShadow(objects);
});
sun.initialise();

window.addEventListener("mousemove", (e) => {
  const xMousePosRatio =
    Math.floor((e.clientX / window.innerWidth) * 100) / 100;
  const xCentralise = (x) => {
    if (x >= 0.5) return Math.floor((x - 0.5) * 100) / 100;
    else if (x < 0.5) return -Math.floor((0.5 - x) * 100) / 100;
  };
  const yReference = objects.reduce((prevVal, object) => {
    if (object.bottom - 100 < prevVal) return object.bottom - 100;
  }, Infinity);
  // console.log("yReference", yReference);

  objects.forEach((object, index) => {
    // console.log("move", index);
    // console.log(`object ${index}:`, object.bottom);
    object.moveX(xMousePosRatio, yReference);
  });
  calcShadow(objects);
});

/*
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * this.parallaxFactor;
  this.dom.style.transform = `translate3d(0px, ${rate}px, 0px)`;
});
*/
