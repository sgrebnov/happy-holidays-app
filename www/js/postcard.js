SnowPostcard = (function () {

    "use strict";

    // required DOM elements
    var postcardContainer = document.getElementById("postcardContainer");
    var postcard = document.getElementById("postcard");
    var hint = document.getElementById("hint");

    // store canvases and contexts in those
    var csContext;
    var csCanvas;
    var csPathContext;
    var csPathCanvas;
    var snowCanvas;
    var snowContext;

    // we're getting events from parent div, so we need placement information to adjust
    var bounds;

    // track user input
    var pointerDown = false;
    var stroke = [];

    // external initilization
    function show() {
        createCompositePhoto();
        showHint();
    }

    // show/hide the hint
    function showHint() {
        hint.style.opacity = 1.0;
    }

    function hideHint() {
        hint.style.opacity = 0;
    }

    // request to render single frame on demand
    function requestFrameRender() {
        Animation.getRequestAnimationFrame(renderCompositePhoto);
    }

    // render user input and compose layers
    function renderCompositePhoto() {
        var ro = Gfx.getDefaultRenderOptions();
        ro.context = csPathContext;
        Gfx.renderPath(stroke, ro);
        stroke = [];

        // compose layers
        var pipeline = [
        // composing on cleared snow canvas
                    csContext,
        // snow on a postcard
                    snowCanvas,
        // cleared snow path
                    csPathCanvas];
        // "subtract" cleared snow path
        var composeOptions = ["", "", "destination-out"];
        Gfx.composeLayers(pipeline, composeOptions);
    }

    function createCanvas() {
        var canvas = document.createElement("canvas");
        canvas.width = postcard.clientWidth;
        canvas.height = postcard.clientHeight;
        return canvas;
    }

    function createSnowImage() {
        snowCanvas = createCanvas();
        snowCanvas.id = "snowCanvas"
        snowContext = snowCanvas.getContext("2d");
		
		var imageObj = new Image();
		imageObj.onload = function() {
		   snowContext.drawImage(imageObj, 0, 0, snowCanvas.width, snowCanvas.height);
		};
		imageObj.src = "images/snowtree.png";
    }

    function createClearedSnow() {
        // cleared snow path
        csPathCanvas = createCanvas();
        csPathContext = csPathCanvas.getContext("2d");
        // cleared snow (compose result - in DOM and visible)
        csCanvas = createCanvas();
        csCanvas.className = "clearedSnowCanvas";
        postcard.appendChild(csCanvas);
        csContext = csCanvas.getContext("2d");
    }

    // correct by bounding rectangle
    function calcOffset(evt) {
        var x = (evt.clientX || evt.changedTouches[0].clientX),
            y = (evt.clientY || evt.changedTouches[0].clientY);
        return {
            x: x - bounds.left,
            y: y - bounds.top
        }
    }

    // mouse and touch (IE) handlers
    function pointerDownHandler(evt) {
        hideHint();
        pointerDown = true;
        stroke = [];
        stroke.push(calcOffset(evt));
        requestFrameRender();
    }

    function pointerMoveHandler(evt) {
        if (evt.buttons > 0) { pointerDown = true; }
        if (pointerDown) {
            stroke.push(calcOffset(evt));
            requestFrameRender();
        }
    }

    function pointerUpHandler(evt) {
        pointerDown = false;
    }

    function createCompositePhoto() {
        // if we're repopulating the photo - flush childNodes
        if (postcard.childNodes.length > 1) {
            postcard.innerHTML = ""
        };

        // snow image
        createSnowImage();
        // canvas to hold cleared path + visible top-level canvas with "cleared snow"
        createClearedSnow();

        // touch events (IE) if supported
        if (window.navigator.msPointerEnabled) {
            postcardContainer.addEventListener("MSPointerDown", pointerDownHandler);
            postcardContainer.addEventListener("MSPointerUp", pointerUpHandler);
            postcardContainer.addEventListener("MSPointerCancel", pointerUpHandler);
            postcardContainer.addEventListener("MSPointerMove", pointerMoveHandler);
        } else if (window.ontouchstart !== undefined) {
            postcardContainer.addEventListener("touchstart", pointerDownHandler);
            postcardContainer.addEventListener("touchend", pointerUpHandler);
            postcardContainer.addEventListener("touchmove", pointerMoveHandler);
            postcardContainer.addEventListener("touchcancel", pointerUpHandler);
        } else {
            postcardContainer.addEventListener("mousedown", pointerDownHandler);
            postcardContainer.addEventListener("mouseup", pointerUpHandler);
            postcardContainer.addEventListener("mouseleave", pointerUpHandler);
            postcardContainer.addEventListener("mousemove", pointerMoveHandler);
        }
    }

    // place snowmark from snowflake that hit the postcard
    function addSnowmark(x, y, image) {
        // the snowflake will be scaled from min to max to add variety
        var minScale = 0.5;
        var maxScale = 2;
        var scale = Math.random() * (maxScale - minScale) + minScale;
        var w = image.width;
        var h = image.height;

        var minOpacity = 0.3;
        var maxOpacity = 0.9;
        csPathContext.globalAlpha = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        csPathContext.globalCompositeOperation = "destination-out";
        csPathContext.drawImage(
        // image
            image,
        // source x
            0,
        // source y
            0,
        // source width
            w,
        // source height
            h,
        // target x
            x - w / 2,
        // target y
            y - h / 2,
        // target width
            w * scale,
        // target height 
            h * scale);
        // request to update that out of normal rendering loop
        requestFrameRender();
    }

    // update postcard bounds to handle events
    function updateBounds() {
        var postcard = document.getElementById("postcard");

        bounds = {
            width: postcard.offsetWidth,
            height: postcard.offsetHeight,
            left: postcard.offsetLeft,
            right: postcard.offsetLeft + postcard.offsetWidth,
            top: postcard.offsetTop,
            bottom: postcard.offsetTop + postcard.offsetHeight
        }

        return bounds;
    }

    return {
        "show": show,
        "addSnowmark": addSnowmark,
        "updateBounds": updateBounds
    };
})();