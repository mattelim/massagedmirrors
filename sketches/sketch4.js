s = (p) => {

    // let sx = 1.1;
    let canSize = $(window).width() < 500 ? $(window).width() : 500;
    let capture;

    let bodypix;
    let segmentation;
    const options = {
        multiplier: 0.25,
        outputStride: 8, // 8, 16, or 32, default is 16
        segmentationThreshold: 0.8, // 0 - 1, defaults to 0.5
    };

    let faceapi;
    let detections;
    const detection_options = {
        withLandmarks: true,
        withDescriptors: false,
    }

    let g;
    let g_image_shader;
    let blur_shader;
    let numBlur = 0; //initiate numBlur value as 0

    p.preload = () => {
        bodypix = ml5.bodyPix(options);
        g_image_shader = p.loadShader("files/default.vert", "files/image.frag");
        blur_shader = p.loadShader("files/default.vert", "files/blur.frag");
    };

    p.setup = () => {
        ml5.p5Utils.setP5Instance(p);

        // p.pixelDensity(1);
        p.createCanvas(canSize, canSize, p.WEBGL);
        g = p.createGraphics(p.width / 2, p.height / 2, p.WEBGL);

        p.noStroke();
        g.noStroke();

        capture = p.createCapture(p.VIDEO, videoReady);
        capture.size(320, 240);
        capture.hide();

        p.frameRate(24);

        faceapi = ml5.faceApi(capture, detection_options, modelReady);
    };

    function videoReady() {
        // console.log("Video ready, start segmentation");
        bodypix.segment(capture, gotResults);
    }

    function modelReady() {
        console.log('ready!')
        // console.log(faceapi)
        faceapi.detect(gotResultsF)
    }

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
        
        p.scale(-2.66, 2);

        let rawBlur = numBlur;
        if (detections) {
            if (detections.length > 0) {
                rawBlur = (detections[0].alignedRect._box._width + detections[0].alignedRect._box._height) / 2;
            }
        }
        rawBlur = p.constrain(rawBlur, 0, 200);
        // console.log(rawBlur);

        let mappedBlur = p.map(rawBlur, 50, 200, 0, 5.5);
        mappedBlur = mappedBlur < 0 ? 0 : p.exp(mappedBlur);
        // console.log("mappedBlur: " + mappedBlur);

        let numInc = (numBlur + mappedBlur) / 10;
        // console.log("numInc: " + numInc);

        numBlur = numBlur < mappedBlur ? numBlur + numInc : numBlur;
        numBlur = numBlur > mappedBlur ? numBlur - numInc : numBlur;

        // console.log("numBlur: " + numBlur);
        let rndBlur = Math.round(numBlur);
        // console.log("rndBlur: " + rndBlur);

        if (segmentation) {

            $("canvas").css("background-image", "none");
            $("canvas").css("background-color", "grey");
            
            p.image(segmentation.personMask, -p.width / 4, -p.height / 4, p.width / 2, p.height / 2);

            if (rndBlur < 1) {
                p.image(segmentation.backgroundMask, -p.width / 4, -p.height / 4, p.width / 2, p.height / 2);
                return;
            }

            g.shader(g_image_shader);
            g_image_shader.setUniform("image", segmentation.backgroundMask);
            g.rect(-0.5 * p.width / 2, -0.5 * p.height / 2, p.width / 2, p.height / 2);

            /* Applies blurring here */
            // for(var i = 0; i < Math.round(mappedBlur); i++) {
            for (let i = 0; i < rndBlur - 1; i++) {

                g.shader(blur_shader);
                blur_shader.setUniform("resolution", [p.width / 2, p.height / 2]);
                blur_shader.setUniform("image", g);
                if (i % 2 == 0) {
                    blur_shader.setUniform("direction", [0.0, 1.0]);
                } else {
                    blur_shader.setUniform("direction", [1.0, 0.0]);
                }
                g.rect(-0.5 * p.width / 2, -0.5 * p.height / 2, p.width / 2, p.height / 2);
            }

            p.image(g, -0.5 * p.width / 2, -0.5 * p.height / 2, p.width / 2, p.height / 2);
        }

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
        bodypix.segment(capture, gotResults);
    }

    function gotResultsF(err, result) {
        if (s === null) {
            throw 'p5 instance stopped due to user closing';
        }

        if (err) {
            console.log(err)
            return
        }
        detections = result;
        faceapi.detect(gotResultsF)
    }

}

new p5(s, 'canvas-cont');
