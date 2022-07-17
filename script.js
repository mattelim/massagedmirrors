let s;
// let myp5;

$(document).ready(function() {
    /* BUTTONS FOR MIRRORS */
    $('.gallery-cont li').click(function() {
        $('.gallery-cont li a').removeClass('clicked');
        $(this).children().first().addClass('clicked');
        // alert($(this).index()+1);
        // $('.p5park').show();
        resetp5vid();
        let filePathName = "sketches/sketch" + ($(this).index()+1) + ".js";
        console.log(filePathName);
        $.getScript(filePathName, function( data, textStatus, jqxhr ) {
            // let canSize = $(window).width() < 500 ? $(window).width() : 500;
            // $('#canvas-cont').width(canSize);
            $('.p5park').hide();
            $('#closeMir').show();
            // console.log( data ); // Data returned
            // console.log( textStatus ); // Success
            // console.log( jqxhr.status ); // 200
            // console.log( "Load was performed." );
        });
    });

    /* BUTTON TO CLOSE */
    $('#closeMir').click(function() {
        $('.gallery-cont li a').removeClass('clicked');
        resetp5vid();
        resetp5park();
        $('.p5park').show();
        $(this).hide();
    });

    function resetp5vid() {
        // document.location.reload();
        // ↑ this will prevent other code from running!
        $('canvas').remove();
        $("canvas").css("background-image", "url('files/loadgif2.gif')");
        s = null;

        /* ↓ CODE CHUNK THAT HALTS CAMERA CAPTURE */
        // This can only be used one during each pageload
        
        if ($('video').length) {

            const video = document.querySelector('video');

            // A video's MediaStream object is available through its srcObject attribute
            const mediaStream = video.srcObject;

            // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
            const tracks = mediaStream.getTracks();

            // Tracks are returned as an array, so if you know you only have one, you can stop it with: 
            tracks[0].stop();

            // Or stop all like so:
            // tracks.forEach(track => track.stop());
            
            console.log(tracks);

            /* ↑ CODE CHUNK THAT HALTS CAMERA CAPTURE */

            
            $('video').remove();

        }
        
    }

    $(".hometitle").hover(() => {
        $(".hometitle").css("transform", "scale(-1, 1)");
        $(".hometitle").css("text-transform", "lowercase");
    }, () => {
        $(".hometitle").css("transform", "none");
        $(".hometitle").css("text-transform", "uppercase");

    });

    $(".nav-about").click(() => {
        resetp5vid();
        $('.p5park').show();
        $('#closeMir').hide();
        $('.gallery-cont li a').removeClass('clicked');

        $('.p5park').children().hide();
        $('.p5park').css('background-color','#EEEADD');
        $('.p5park').css('box-shadow','0px 0px 20px 5px #888 inset');
        $('.about-desc').show();
    });

    $(".close-about").click(() => {
        resetp5park();
    });

    function resetp5park() {
        $('.about-desc').hide();
        $('.p5park').css('background-color','#333');
        $('.p5park').css('box-shadow','0px 0px 20px 5px #222 inset');
        $('.plsClick').show();
    }
});