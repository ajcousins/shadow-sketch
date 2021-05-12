const canvas = document.querySelector("#canvas");
const portText = document.querySelector("#portText");
// Shadow body to be rendered and position to be calculated dynamically
const shadowBodyA = document.querySelector("#shadowBodyA");

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
    calcShadow();
  },
  setY: function (yCoord) {
    this.dom.setAttribute("cy", yCoord);
    calcShadow();
  },
  initialise: function () {
    this.setX(window.innerWidth / 2);
    this.setY(window.innerHeight / 4);
    this.dom.addEventListener("mouseover", () => {
      console.log("Hover");
    });
    window.addEventListener("scroll", () => {
      console.log(window.scrollY);
      this.setY(this.getCenter().y + window.scrollY * 1.05);
    });
  },
};

const calcShadow = () => {
  const portBox = portText.getBoundingClientRect();
  const canvasBox = canvas.getBoundingClientRect();
  const yScroll = window.scrollY;

  shadowBodyA.setAttribute(
    "points",
    `
    ${portBox.left},
    ${portBox.bottom + yScroll} 
    ${portBox.right},
    ${portBox.bottom + yScroll} 
    ${projectedX(
      sun.getCenter().x,
      sun.getCenter().y,
      portBox.right,
      portBox.bottom,
      canvasBox.bottom
    )},
    ${canvasBox.bottom + yScroll} 
    ${projectedX(
      sun.getCenter().x,
      sun.getCenter().y,
      portBox.left,
      portBox.bottom,
      canvasBox.bottom
    )},
    ${canvasBox.bottom + yScroll}
    `
  );
};

// Create function which returns x and y coordinate at bottom of canvas.
// Function returns projected point/ corner of shadow from light source, shadow origin coords and Y plane.
const projectedX = (srcX, srcY, intX, intY, planeY) => {
  const ratio = (planeY - srcY) / (planeY - srcY - (planeY - intY));
  return srcX - (srcX - intX) * ratio;
};

window.addEventListener("load", calcShadow);
window.addEventListener("resize", calcShadow);
window.addEventListener("scroll", calcShadow);
sun.initialise();
