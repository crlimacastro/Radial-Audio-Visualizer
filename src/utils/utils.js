import * as ctxUtil from "./ctxUtil.js";
import * as mathUtil from "./mathUtil.js";
import * as canvasMouse from "./canvasMouse.js";
import * as randUtil from "./randUtil.js";

const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // Do nothing if the method is not supported
};

export {
    ctxUtil,
    mathUtil,
    canvasMouse,
    randUtil,

    goFullscreen
}