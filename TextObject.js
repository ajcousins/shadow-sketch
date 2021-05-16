const maxTranslate = 300;

class TextObject {
  constructor(selector, svgWrapper, x, y) {
    this.id = selector;
    this.dom = document.querySelector(selector);
    this.x = x;
    this.y = y;
    this.svgWrapper = svgWrapper;
    this.dom.innerHTML = this.position(x, y, svgWrapper);
    this.box = this.dom.getBoundingClientRect();
    this.bottom = this.dom.getBoundingClientRect().bottom;
    this.innerID = `${selector}Inner`;
    this.innerDom = document.querySelector(this.innerID);
    this.innerBox = this.innerDom.getBoundingClientRect();
    this.transitioning = false;
    this.shadowMovement = null;
  }
  position(x, y, svgWrapper) {
    return `<svg x=${x || 0} y=${y || 0}>` + svgWrapper;
  }
  moveX(xFactor, yOriginReference) {
    const moveFactor =
      ((this.bottom - yOriginReference) /
        (window.innerHeight - yOriginReference)) *
      xFactor;
    this.innerDom.style.transform = `translate3d(${
      maxTranslate * moveFactor
    }px, 0px, 0px)`;
  }
  mouseMoveListener() {
    this.innerDom.addEventListener("transitionstart", () => {
      if (this.transitioning === false) {
        this.transitioning = true;
        this.moveShadows();
      }
    });
    this.innerDom.addEventListener("transitionend", () => {
      this.transitioning = false;
      clearInterval(this.shadowMovement);
      this.shadowMovement = null;
    });
  }
  moveShadows() {
    if (!this.shadowMovement) {
      this.shadowMovement = setInterval(() => {
        calcShadow(objects);
      }, 12);
    }
  }
  // // Hover portfolio
  hover() {
    this.dom.addEventListener("mouseover", () => {
      this.dom.setAttribute("fill", "white");
      this.dom.setAttribute("opacity", "1");
    });
    // Hover portfolio
    this.dom.addEventListener("mouseleave", () => {
      this.dom.setAttribute("fill", "black");
      this.dom.setAttribute("opacity", "0.5");
    });
  }
}

export default TextObject;
