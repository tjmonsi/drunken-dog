/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/24/13
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
/*
 *  Video Object
 */

var VideoObject = function(data, parent, idnum) {

    this.data = data;
	this.idnum = idnum;
    this.player=null;
    var element = create_element("object", data.video, ["videoobject"], {"type":"application/x-shockwave-flash", "data":"http://www.youtube.com/apiplayer?controls=0&enablejsapi=1&rel=0&showinfo=0&autohide=1&playerapiid="+data.video+idnum+"&version=3&autoplay=1", "width":data.width, "height":data.height, "style":"top: "+data.x+"px; left: "+data.y+"px"})
    var param = create_element("param", null, null, {"name":"allowScriptAccess", "value":"always"})
	var param2 = create_element("param", null, null, {"name":"wmode", "value":"opaque"})
    var invisibleboard = create_element("div", "top"+data.video, ["topobject"], {"style": "width:1280px; height:720px"});

    element.appendChild(param);
    element.appendChild(param2);

    parent.append(invisibleboard);
    parent.append(element);

    this.element = $("object#"+data.video);
	this.player = document.getElementById(data.video);
	console.log(this.player);
	//this.player = element;
    //console.log(this.element.css('top'));
    //this.element.css("left","0px");

    this.top = $("div#top"+data.video);
	
	this.hide();
    //this.element.click($.proxy(UI.board.on_click, UI.board))
}

VideoObject.prototype = {
    on_playing: function() {
		try {
			if (UI.video.player.getPlayerState()==1) {
				this.checkposition();
			}
		} catch(e){
			//console.log(e);
		}
    },

    play: function() {
        //this.player.playVideo();
		//UI.playflag = true;
        
    },

    pause: function() {
        this.player.pauseVideo();
		//UI.playflag=false;
        
    },

    seek: function(seconds) {
        this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.play();
    },
	
	seekpause: function(seconds) {
		this.seek(seconds);
		this.pause();	
	},
	
	hide: function(){
		this.element.addClass("hidden");
		this.top.addClass("hidden");
	},
	
	unhide: function() {
		this.element.removeClass("hidden");
		this.top.removeClass("hidden");
	},

    checkposition: function() {
		//if (this.player.getCurrentTime()<this.data.start) {

			//this.seek(this.data.start);	

//		}
		//if (this.player.getCurrentTime()>this.data.end){
		//	this.pause();	
		//}
		//if (this.player
        /*for (var i= UI.objects.length-1; i>=0; i--){

            if (UI.objects[i]!=null) {
                if(UI.objects[i].time <= this.player.getCurrentTime()) {
                    this.element.css('left', UI.objects[i].data.board*UI.frame_width);
                    this.top.css('left', UI.objects[i].data.board*UI.frame_width);
                    UI.board.element.animate({scrollLeft: (UI.objects[i].data.board*UI.frame_width)}, 'fast');

                    break;
                }
            }
        }

        console.log("newState");*/
    }


}