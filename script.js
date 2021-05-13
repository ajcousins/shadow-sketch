const canvas = document.querySelector("#canvas");
const portText = document.querySelector("#portText");
// Shadow body to be rendered and position to be calculated dynamically
const shadowBodyA = document.querySelector("#shadowBodyA");

// Next steps:
// Think about groud plane positions for text elements and parallax.
// Ground plane position will need to be calculated based on coordinates and height of element.

// Background brightness based on height of sun?
// Disable sun / shadows when sun goes below horizon?

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
  windowScrollYRef: 0,
  parallaxFactor: 2,
  transitioning: false,
  initialise: function () {
    this.setX(window.innerWidth / 2);
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
        calcShadow();
      }, 50);
    }
  },
};

const calcShadow = () => {
  console.log("Calc shadow");
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

// Hover portText
portText.addEventListener("mouseenter", () => {
  portText.setAttribute("fill", "orange");
});
// Hover portText
portText.addEventListener("mouseleave", () => {
  portText.setAttribute("fill", "black");
});

window.addEventListener("load", calcShadow);
window.addEventListener("resize", calcShadow);
window.addEventListener("scroll", calcShadow);
sun.initialise();
