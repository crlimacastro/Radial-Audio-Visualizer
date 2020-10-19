const getMouseFor = (canvas) => {
    const getCanvasCoord = e => {
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;
        return { x: mouseX, y: mouseY };
    };
    const mouse = {
        pos: { x: 0, y: 0 },
        mouseDown: false,
        onMouseDown: new CustomEvent("mousedown"),
        onMouseUp: new CustomEvent("mouseup")
    };
    canvas.addEventListener("mousemove", e => {
        mouse.pos = getCanvasCoord(e);
    });
    canvas.addEventListener("mousedown", e => {
        mouse.mouseDown = true;
        mouse.dispatchEvent(onMouseDown);
    });
    canvas.addEventListener("mouseup", e => {
        mouse.mouseDown = false;
        mouse.dispatchEvent(onMouseUp);
    });
    canvas.addEventListener("mouseleave", e => {
        mouse.mouseDown = false;
    });

    return mouse;
}

export {
    getMouseFor
}