//////////////////////////////////////////////////////////////////////////////////
// A demonstration of a Canvas nebula effect
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software if
// using significant parts of it
//////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){	
													   
	(function ($) {			
			// The canvas element we are drawing into.      
			var	$mainCanvas = $('#mainCanvas');
			var	$overlayCanvas = $('#overlayCanvas');
			var	$textureCanvas = $('#textureCanvas');
			var	ctx2 = $overlayCanvas[0].getContext('2d');
			var	ctx = $mainCanvas[0].getContext('2d');
			var	w = window.innerWidth, h = window.innerHeight;

            $mainCanvas[0].width = w;
            $overlayCanvas[0].width = w;
            $textureCanvas[0].width = w;
            $mainCanvas[0].height = h;
            $overlayCanvas[0].height = h;
            $textureCanvas[0].height = h;
			var	img = new Image();	
			
			// A puff.
			var	Puff = function(p) {				
				var	opacity,
					sy = (Math.random()*285)>>0,
					sx = (Math.random()*285)>>0;
				
				this.p = p;
						
				this.move = function(timeFac) {						
					p = this.p + 0.3 * timeFac;				
					opacity = (Math.sin(p*0.05)*0.5);						
					if(opacity <0) {
						p = opacity = 0;
						sy = (Math.random()*285)>>0;
						sx = (Math.random()*285)>>0;
					}												
					this.p = p;																			
					ctx.globalAlpha = opacity;						
					ctx.drawImage($textureCanvas[0], sy+p, sy+p, 285-(p*2),285-(p*2), 0,0, w, h);
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
		
	})(jQuery);	 
});

