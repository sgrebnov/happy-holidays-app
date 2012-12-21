// Initialization and events code for the app
(function () {
    "use strict";

    var musicIsPlaying = true;
    var togglePlaybackCode = 32;

    // preparing the elements we'll need further
    var snowflakesCanvas = document.getElementById("snowflakesCanvas");
    var snowflakesContext = document.getElementById("snowflakesCanvas").getContext("2d");
    var music = document.getElementById("music");

    function resizeCanvasElements() {
        // update internal contraints for the tree and snowflakes container
        setTimeout(SnowTree.updateBounds,1000);
        Snowflakes.updateBounds();
        // resize falling snowflakes canvas to fit the screen
        snowflakesCanvas.width = window.innerWidth;
        snowflakesCanvas.height = window.innerHeight;
    }

    document.addEventListener("keypress", function (evt) {
        if (evt.keyCode === togglePlaybackCode) {
            musicIsPlaying = !musicIsPlaying;
            var toggleFunction = (musicIsPlaying) ? music.play() : music.pause();
            if (toggleFunction) { toggleFunction(); }
        }
    });

    document.addEventListener("DOMContentLoaded", function () {

        // initialiaze the snow covered tree
        SnowTree.show();

        // genarate snowflakes
        Snowflakes.generate(150);

        // properly resize the canvases
        resizeCanvasElements();

        // initialize out animation functions and start animation:
        // falling snowflakes
        Animation.addFrameRenderer(Snowflakes.render, snowflakesContext);
        // start the animation
        Animation.start();

    });

    window.addEventListener("resize", function () {
        // properly resize the canvases
        resizeCanvasElements();
    });

})();