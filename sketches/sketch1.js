s = ( p ) => {
    let capture;
    let collet2DArr;
    let porSize;
    let canSize = $(window).width() < 500 ? $(window).width() : 500;
    let sx = 1.1

    p.setup = () => {
        p.pixelDensity(1);
        p.createCanvas(canSize,canSize);
        capture = p.createCapture(p.VIDEO);
        capture.hide();
        p.frameRate(24);
        porSize = 100;
    };

    p.draw = () => {
        wrappedDraw();
    };

    function wrappedDraw() {
        if (s === null) {
            throw 'p5 instance stopped due to user closing';
        }

        p.translate(p.width + ((sx * capture.width - p.width)/2), -((sx * capture.height - p.height)/2));
        p.scale(-sx,sx);

		p.image(capture, 0, 0, capture.width, capture.height);

        let photo = p.get(0, 0, p.width, p.height);

		p.resizeCanvas(porSize, porSize);
		p.image(photo, 0, 0, porSize, porSize);
		ditherImage();
		pixelImg = p.get(0, 0, porSize, porSize);
		p.resizeCanvas(canSize, canSize);
	    p.image(pixelImg, 0, 0, canSize, canSize);
    }

    function ditherImage() {
        let pwidth = porSize;
        let pheight = porSize;
    
        let colors = [];
    
        colors[0] = p.color(0,0,0); // black 'K'
        colors[1] = p.color(255,0,0); // red 'R'
        colors[2] = p.color(0,255,0); // green 'G'
        colors[3] = p.color(0,0,255); // blue 'B'
        colors[4] = p.color(255,255,255); // white ' '
    
        p.loadPixels();
    
        collet2DArr = [];
    
        for (let y = 0; y < pheight; y++) {
            let collet1DArr = [];
    
            for (let x = 0; x < pwidth; x++) {
                let index = x + (y * pwidth);
                let mindex = 4 * index;

                let r = p.pixels[mindex];
                let g = p.pixels[mindex + 1];
                let b = p.pixels[mindex + 2];
    
                let closest = 0;
                let closeDif = 10000;
                for (let i = 0; i < colors.length; i++) {
                    //let difTot, difR, difG, difB;
                    let difR = r - p.red(colors[i]);
                    let difG = g - p.green(colors[i]);
                    let difB = b - p.blue(colors[i]);
                    let difTot = p.abs(difR) + p.abs(difG) + p.abs(difB);
                    if (difTot < closeDif) {
                        closest = i;
                        closeDif = difTot;
                    }
                }
    
                collet1DArr.push(closest);
    
                p.pixels[mindex] = p.red(colors[closest]);
                p.pixels[mindex + 1] = p.green(colors[closest]);
                p.pixels[mindex + 2] = p.blue(colors[closest]);
    
                let errR = r - p.red(colors[closest]);
                let errG = g - p.green(colors[closest]);
                let errB = b - p.blue(colors[closest]);
    
                //Dithering happens here
                if ((index+1) % pwidth != 0) {
                    p.pixels[mindex + 4] += (7/16.0 * errR);
                    p.pixels[mindex + 5] += (7/16.0 * errG);
                    p.pixels[mindex + 6] += (7/16.0 * errB);
                }
                if (index < pwidth * (pheight-1)) {
                    if (index % pwidth != 0) {
                        p.pixels[mindex + (pwidth * 4) - 4] += (3/16.0 * errR);
                        p.pixels[mindex + (pwidth * 4) - 3] += (3/16.0 * errG);
                        p.pixels[mindex + (pwidth * 4) - 2] += (3/16.0 * errB);
                        //pic0.p.pixels[index + pwidth - 1] = addError(pic0.p.pixels[index + pwidth - 1], errR, errG, errB, 3/16.0);
                    }
                    p.pixels[mindex + (pwidth * 4)] += (5/16.0 * errR);
                    p.pixels[mindex + (pwidth * 4) + 1] += (5/16.0 * errG);
                    p.pixels[mindex + (pwidth * 4) + 2] += (5/16.0 * errB);
                    //pic0.p.pixels[index + pwidth] = addError(pic0.p.pixels[index + pwidth], errR, errG, errB, 5/16.0);
                    if ((index+1) % pwidth != 0) {
                        p.pixels[mindex + (pwidth * 4) + 4] += (1/16.0 * errR);
                        p.pixels[mindex + (pwidth * 4) + 5] += (1/16.0 * errG);
                        p.pixels[mindex + (pwidth * 4) + 6] += (1/16.0 * errB);
                        //pic0.p.pixels[index + pwidth + 1] = addError(pic0.p.pixels[index + pwidth + 1], errR, errG, errB, 1/16.0);
                    }
                }
            }
    
            collet2DArr.push(collet1DArr);
        }
        p.updatePixels();
    }
}

new p5(s, 'canvas-cont');
