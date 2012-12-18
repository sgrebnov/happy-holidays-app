//////////////////////////////////////////////////////////////////////////////////
// A demonstration of a Canvas nebula effect
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software if
// using significant parts of it
//////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){

    function initOrUpdateBlizzardCanvas() {
        // The canvas element we are drawing into.
        var	$mainCanvas = $('#mainCanvas');
        var	$overlayCanvas = $('#overlayCanvas');
        var	$textureCanvas = $('#textureCanvas');
        var	ctx2 = $overlayCanvas[0].getContext('2d');
        var	ctx = $mainCanvas[0].getContext('2d');
        var	w = Math.max(0, window.innerWidth),
            h = Math.max(0, window.innerHeight)-5,
            w2 = w/2,
            h2= h/2;

        $mainCanvas[0].width = w2;
        $overlayCanvas[0].width = w;
        $textureCanvas[0].width = w;
        $mainCanvas[0].height = h2;
        $overlayCanvas[0].height = h;
        $textureCanvas[0].height = h;
        var	img = new Image();

        // A puff.
        var	Puff = function(p) {
            var	opacity,
                sy = (Math.random()*w2)>>0,
                sx = (Math.random()*h2)>>0;

            this.p = p;

            this.move = function(timeFac) {
                p = this.p + 0.3 * timeFac;
                opacity = (Math.sin(p*0.05)*0.5);
                if(opacity <0) {
                    p = opacity = 0;
                    sy = (Math.random()*w2)>>0;
                    sx = (Math.random()*h2)>>0;
                }
                this.p = p;
                ctx.globalAlpha = opacity;
                var imgW = Math.min(w2-(p*2),window.innerWidth );
                var imgH = Math.min(h2-(p*2),window.innerHeight);

                ctx.drawImage($textureCanvas[0], sx+p, sy+p, imgW, imgH, 0,0, w, h);
            };
        };

        var	puffs = [];
        var	sortPuff = function(p1,p2) { return p1.p-p2.p; };
        puffs.push( new Puff(0) );
        puffs.push( new Puff(20) );
        puffs.push( new Puff(40) );

        var	newTime, oldTime = 0, timeFac;

        var	loop = function()
        {
            newTime = new Date().getTime();
            if(oldTime === 0 ) {
                oldTime=newTime;
            }
            timeFac = (newTime-oldTime) * 0.1;
            if(timeFac>3) {timeFac=3;}
            oldTime = newTime;
            puffs.sort(sortPuff);

            for(var i=0;i<puffs.length;i++)
            {
                puffs[i].move(timeFac);
            }
            ctx2.drawImage( $mainCanvas[0] ,0,0,w,h);
            setTimeout(loop, 10 );
        };
        // Turns out Chrome is much faster doing bitmap work if the bitmap is in an existing canvas rather
        // than an IMG, VIDEO etc. So draw the big nebula image into textureCanvas
        var	$textureCanvas = $('#textureCanvas');
        var	ctx3 = $textureCanvas[0].getContext('2d');
        $(img).bind('load',null, function() {  ctx3.drawImage(img, 0,0,w, h);	loop(); });
        img.src = 'images/nebula.jpg';

    }


													   
	(function ($) {

        initOrUpdateBlizzardCanvas();

        $(window).resize(function() {

            initOrUpdateBlizzardCanvas();
        });
		
	})(jQuery);	 
});

