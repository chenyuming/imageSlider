
define('imageSlider', ['jquery'],
    function ($) {
		var imageSlider = function(options){
			this.init(options);
		};	
		imageSlider.prototype = {	
			images:{
				speed:'slow',
				list:[],
				curIndex:-1,
				prev: function (){
					if (this.first()){				
						return false;
					}
					else{
						this.curIndex -= 1;
					}
					
					return true;
				},
				next:function(){
					if (this.last()){	
						return false;
					}
					else{
						this.curIndex += 1;
					}
					
					return true;
				},
				first: function (){	
					return this.curIndex == 0 ;
				},
				last: function (){	
					return this.curIndex == this.size()-1;
				},
				size: function (){	
					return this.list.length;
				},	
			},
			files: {
				js: {
				},
				css: {
					lightbox:	'css/imageSlider.css'
				},
				images: {
					prev:		'images/prev.gif',
					next:		'images/next.gif',
					blank:		'images/blank.gif',
					loading:	'images/loading.gif'
				}
			},
			domReady:function(){	
				var bodyEl = document.getElementsByTagName($.browser.safari ? 'head' : 'body')[0];
				var stylesheets = this.files.css;
				var scripts = this.files.js;
				
				var that = this;
				
				// 加入CSS
				for ( var stylesheet in stylesheets )
				{
					var linkEl = document.createElement('link');
					linkEl.type = 'text/css';
					linkEl.rel = 'stylesheet';
					linkEl.media = 'screen';
					linkEl.href = stylesheets[stylesheet];
					linkEl.id = 'lightbox-stylesheet-'+stylesheet.replace(/[^a-zA-Z0-9]/g, '');
					$('#'+linkEl.id).remove();
					bodyEl.appendChild(linkEl);
				}
				
				// 加入js
				/*
				for ( var script in scripts ){
					var scriptEl = document.createElement('script');
					scriptEl.type = 'text/javascript';
					scriptEl.src = scripts[script];
					scriptEl.id = 'lightbox-script-'+script.replace(/[^a-zA-Z0-9]/g, '');
					$('#'+scriptEl.id).remove();
					bodyEl.appendChild(scriptEl);
				}
				*/
				
				//delete scripts;
				delete stylesheets;
				delete bodyEl;
							
				// 加入html
				$('#lightbox,#lightbox-overlay').remove();
				$('body').append('<div id="lightbox-overlay"></div><div id="lightbox"><div id="lightbox-imageBox"><div id="lightbox-imageContainer"><img id="lightbox-image" /><div id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + this.files.images.loading + '" /></a></div></div></div></div>');
				
				$('#lightbox,#lightbox-overlay').hide();

				$(window).unbind('resize').resize(function (){	
					that.resizeBoxes();
				});
				$(window).unbind('scroll').scroll(function(){
					that.images.speed = 'fast';
					that.resizeBoxes();	
				});
				
				// 上一张图片
				$('#lightbox-nav-btnPrev').unbind().hover(function() { // over
					if(!that.images.first()){
						$(this).css({ 'background' : 'url(' + that.files.images.prev + ') left 45% no-repeat' });
					}
				},function() { // out
					$(this).css({ 'background' : 'transparent url(' + that.files.images.blank + ') no-repeat' });
				}).click(function() {
					if(that.images.prev()){
						that.showImage();
					}
					$(this).css({ 'background' : 'transparent url(' + that.files.images.blank + ') no-repeat' });
					if(!that.images.first()){
						$(this).css({ 'background' : 'url(' + that.files.images.prev + ') left 45% no-repeat' });
					}
					return false;
				});
						
				// 下一张图片
				$('#lightbox-nav-btnNext').unbind().hover(function() { // over
					if(!that.images.last()){
						$(this).css({ 'background' : 'url(' + that.files.images.next + ') right 45% no-repeat' });
					}
				},function() { // out
					$(this).css({ 'background' : 'transparent url(' + that.files.images.blank + ') no-repeat' });
				}).click(function() {
					if(that.images.next()){
						that.showImage();
					}
					$(this).css({ 'background' : 'transparent url(' + that.files.images.blank + ') no-repeat' });
					if(!that.images.last()){
						$(this).css({ 'background' : 'url(' + that.files.images.next + ') right 45% no-repeat' });
					}
					return false;
				});
				
				return true;
			},
			
			init:function(options){ // 初始化
				this.domReady();
				var options = $.extend({events:true}, options);
				var group = $('#main a');
				if ( options.events ){
					this.images.list  = $(group).map(function() {
						return this.href;
					}).get();
				
					var that = this;
					$(group).unbind('click').click(function(e){
						var obj = $(this);
						that.images.curIndex  = that.images.list.indexOf(e.currentTarget.href);
						
						$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext').hide();
								
						$('#lightbox-overlay').css('opacity',0.9).fadeIn(400, function(){
							$('#lightbox').fadeIn(300);
							$('#lightbox-loading').hide();
							$('#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext').show();
							$('#lightbox-image').attr('src',obj.attr('href')).show();					
							that.resizeBoxes();
						});
						
						return false;
					});
					
					$("#lightbox").unbind('click').click(function(e){

							$('#lightbox').hide();
							$('#lightbox-overlay').fadeOut(function() { $('#lightbox-overlay').hide(); });
							
							return false;
					
					});

                    $(document).keydown(function(objEvent) {
				        that.KeyboardNav_Action(objEvent);
			        });

				}
				 
			},

            KeyboardNav_Action: function ( objEvent ) {
			    objEvent = objEvent || window.event;
			
			    var keycode = objEvent.keyCode;
			    var escapeKey = objEvent.DOM_VK_ESCAPE /* moz */ || 27;
			
			    var key = String.fromCharCode(keycode).toLowerCase();
			
			    if ( keycode === 37 ){	
                    if(this.images.prev()){
						this.showImage();
					}
			    }
			
			    if ( keycode === 39 ){	
                    if(this.images.next()){
						this.showImage();
					}
			    }

			    return true;
		    },
			
			resizeBoxes:function(){
				var that = this;
				var preloader = new Image();
					preloader.src = this.images.list[this.images.curIndex];
					preloader.onload = function(){
						var iWidth  = this.width;
						var iHeight = this.height;
						var wWidth  = $(window).width();
						var wHeight = $(window).height();
						var maxWidth  = Math.floor(wWidth*(4/5));
						var maxHeight = Math.floor(wHeight*(4/5));
						var resizeRatio;
						while ( iWidth > maxWidth || iHeight > maxHeight ) // 当视窗较小时，图片按比例缩放
						{	
							if ( iWidth > maxWidth )
							{	
								resizeRatio = maxWidth/iWidth;
								iWidth = maxWidth;
								iHeight = Math.floor(iHeight*resizeRatio);
							}
							if ( iHeight > maxHeight )
							{	
								resizeRatio = maxHeight/iHeight;
								iHeight = maxHeight;
								iWidth = Math.floor(iWidth*resizeRatio);
							}
						}

						$('#lightbox-image').width(iWidth).height(iHeight);
						
						var nWidth	= (iWidth  + (0.01 * 2));
						var nHeight	= (iHeight + (0.02 * 2));
						$('#lightbox-imageBox').animate({width: nWidth, height: nHeight}, 200);
						
						that.repositionBoxes({nHeight:nHeight});			
				};
						
			},
			
			repositionBoxes:function(option){
				var pageScroll = this.getPageScroll();
				var nHeight = option.nHeight || parseInt($('#lightbox').height(),10);
				var nTop = pageScroll.yScroll + ($(window).height()  - nHeight) / 2.5;
				var nLeft = pageScroll.xScroll;
				var css = {
					left: nLeft,
					top: nTop
				};
				$('#lightbox').animate(css, this.images.speed, function(){});
			},
			
			showImage:function(){
				var obj = this.images.list[this.images.curIndex];
				$('#lightbox-image').attr('src',obj);
				this.resizeBoxes();
			},
			
			getPageScroll: function ( ) {
				var xScroll, yScroll;
				if (self.pageYOffset)
				{	
					yScroll = self.pageYOffset;
					xScroll = self.pageXOffset;
				} else if (document.documentElement && document.documentElement.scrollTop){	// IE6
					yScroll = document.documentElement.scrollTop;
					xScroll = document.documentElement.scrollLeft;
				} else if (document.body)
				{	
					yScroll = document.body.scrollTop;
					xScroll = document.body.scrollLeft;	
				}
				var arrayPageScroll = {'xScroll':xScroll,'yScroll':yScroll};
				return arrayPageScroll;
			},

		};
		
		return imageSlider;
		
	});