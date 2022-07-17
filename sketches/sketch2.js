s = ( p ) => {
    let prevImg;
    let g0;
    let canSize = $(window).width() < 500 ? $(window).width() : 500;

    p.setup = () => {
        p.pixelDensity(1);
        p.createCanvas(canSize,canSize);
        capture = p.createCapture(p.VIDEO);
        capture.size(640, 480);
        capture.hide();
        p.frameRate(24);
        
        g0 = p.createGraphics(640, 480);
        previmg = g0.get();
    };

    p.draw = () => {
        wrappedDraw();
    };

    function wrappedDraw() {
        if (s === null) {
            throw 'p5 instance stopped due to user closing';
        }

        p.scale(-1,1);
        p.translate(-p.width,0);

        g0.image(previmg, 0, 0);
        g0.blend(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height, p.DIFFERENCE);
        /* ↓ comment to get something cool */
        previmg = capture.get(0, 0, capture.width, capture.height);
        // g0.blendMode(p.SCREEN);
        /* ↑ comment to get something cool */
        p.image(g0,-(capture.width-p.width)/2,0,666,500);
    }
}

new p5(s, 'canvas-cont');
