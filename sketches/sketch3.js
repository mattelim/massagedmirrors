s = ( p ) => {

    // let sx = 1.1;
    let canSize = $(window).width() < 500 ? $(window).width() : 500;

    let bodypix;
    let capture;
    let segmentation;

    let imgBuffer = [];

    const options = {
        multiplier: 0.25,
        outputStride: 8, // 8, 16, or 32, default is 16
        segmentationThreshold: 0.8, // 0 - 1, defaults to 0.5
    };

    p.preload = () => {
        bodypix = ml5.bodyPix(options);
    };

    p.setup = () => {
        ml5.p5Utils.setP5Instance(p);
    
        // p.pixelDensity(1);
        p.createCanvas(canSize, canSize);
        capture = p.createCapture(p.VIDEO, videoReady);
        capture.size(300, 150);
        capture.hide();
        p.frameRate(24);
      };

    function videoReady() {
        // console.log("Video ready, start segmentation");
        bodypix.segment(capture, gotResults);
    };

    p.draw = () => {
        wrappedDraw();

        /* Catch error to intentionally stop function? */
        // try {
        //     wrappedDraw();
        // } catch (e) {
        //     console.log(e);
        //     /* THERE MAY BE BUILT IN STOP P5 FUNCTION? */
        // }        
    };

    function wrappedDraw() {
        if (s === null) {
            throw 'p5 instance stopped due to user closing';
        }

        p.scale(-2.66,2);
        p.translate(-p.width/2.25, 0);

        p.tint(255,64)
        p.image(capture, 0, 0, p.width/2, p.height/2);
        p.noTint();

        if (segmentation) {
            for (let i = 0; i < imgBuffer.length; i+=3) {
                p.image(imgBuffer[i], 0, 0, p.width/2, p.height/2);
            }
        }
        // console.log("Got to drawing");
    }

    function gotResults(error, result) {
        if (s === null) {
            throw 'p5 instance stopped due to user closing';
        }
        if (error) {
            console.log(error);
            return;
        }
        segmentation = result;
        if (imgBuffer.length > 12) {
            imgBuffer.shift();
            // console.log(imgBuffer.length);
        }
        imgBuffer.push(segmentation.backgroundMask);
        bodypix.segment(capture, gotResults);
    }
      
}

new p5(s, 'canvas-cont');
