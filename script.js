import portfolio from "./portfolio.js";
// import textWrapper from "./textWrapper";

const canvas = document.querySelector("#canvas");
// const portText = document.querySelector("#portText");
// Shadow body to be rendered and position to be calculated dynamically
const shadowBodies = document.querySelectorAll(".shadowBodies");

// Next steps:
// Think about groud plane positions for text elements and parallax.
// Ground plane position will need to be calculated based on coordinates and height of element.

// Background brightness based on height of sun?
// Disable sun / shadows when sun goes below horizon?

// const portTextA = document.createElement("svg");
// portTextA.innerHTML = portfolio();
// canvas.appendChild(portTextA);

const portText = document.querySelector("#portfolio");
portText.innerHTML = portfolio("20%", "20%");

const testCopy = document.querySelector("#testCopy");
testCopy.innerHTML = portfolio("60%", "20%");

const objects = [portText, testCopy];

const sun = {
  dom: document.querySelector("#sun"),
  getCenter: function () {
    const box = this.dom.getBoundingClientRect();
    const x = (box.right - box.left) / 2 + box.left;
    const y = (box.bottom - box.top) / 2 + box.top;
    return { x, y };
  },
  setX: function (xCoord) {
    this.dom.setAttribute("cx", xCoord);
    calcShadow(objects);
  },
  setY: function (yCoord) {
    this.dom.setAttribute("cy", yCoord);
    calcShadow(objects);
  },
  windowScrollYRef: 0,
  parallaxFactor: 2,
  transitioning: false,
  setXPos: function () {
    this.setX(window.innerWidth / 2);
  },
  initialise: function () {
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
  moveShadows: function () {
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
    const box = object.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();

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
  });
};

// Create function which returns x and y coordinate at bottom of canvas.
// Function returns projected point/ corner of shadow from light source, shadow origin coords and Y plane.
const projectedX = (srcX, srcY, intX, intY, planeY) => {
  const ratio = (planeY - srcY) / (planeY - srcY - (planeY - intY));
  return srcX - (srcX - intX) * ratio;
};

// // SHOULD USE BOUNDING BOX INSTEAD 'getBoundingClientRect()'
// // Hover portText
// portText.addEventListener("mouseenter", () => {
//   portText.setAttribute("fill", "orange");
// });
// // Hover portText
// portText.addEventListener("mouseleave", () => {
//   portText.setAttribute("fill", "black");
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
