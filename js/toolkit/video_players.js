"use strict";

/*---------------------- timeline_Player --------------------------*/

var timeline_Player = function(parent, id) {
	this.parent = parent;
	this.id = id+"_timeline";
	this.video_id = id;

	var element = create_element("div", this.id, ["timeline"], {});
	var scrubber = create_element("div", this.id+"_scrubber", ["scrubber"], {});

	element.appendChild(scrubber);
	this.parent.append(element);

	this.element = $("#"+this.id);
	this.scrubber = $("#"+this.id+"_scrubber");
    this.scrubber.css({"top": 0, "left": 0});

	this.scrubber.draggable(this.scrubber_fx);

	this.element.mousedown($.proxy(this.timeline_scrub_start,this));
    this.element.mouseup($.proxy(this.timeline_scrub_end,this));
    this.element.mouseleave($.proxy(this.timeline_scrub_mouseleave(),this));
    this.element.mouseenter($.proxy(this.timeline_scrub_mouseenter(),this));
    this.mousehold_flag=false;

    this.timelength=0;
    this.truetime = 0;
}

timeline_Player.prototype = {

	timeline_scrub_start: function(e){
        console.log(e.target.id);
        console.log(this.id)
        if (e.target.id==this.id){
            this.mousehold_flag=true;
        }

        if (this.mousehold_flag) {
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub: function(e) {
        if (this.mousehold_flag) {
            console.log(e.offsetX)
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub_end: function(e) {
            this.mousehold_flag=false;
            console.log(e.offsetX)
    },

    timeline_scrub_mouseleave: function(e) {
        if (this.mousehold_flag) {
            this.mousehold_flag=false;
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub_mouseenter: function(e) {
        if (this.mousehold_flag) {
            this.mousehold_flag=false;
        }
    },

    timeline_scrub_function: function(posx) {;

        var timer = (posx*this.timelength)/(this.element.width()-10);
        this.scrubber.css({"left": posx});
        Data.videoplayers[this.video_id].seek(timer);

    },

    updatepos: function(time){
        this.truetime = time;
        var posx = (this.truetime*(this.element.width()-10))/this.timelength;
        this.scrubber.css({"left": posx});

    },

    scrubber_fx: {
        axis: 'x',
        containment: 'parent',
        cursor: 'move',
        start: function(){
        	var target = Data.videoplayers[this.id.replace("_timeline_scrubber", "")];
        	target.pause();
        },
        drag: function(){

        },
        stop: function(){
        	var target = Data.videoplayers[this.id.replace("_timeline_scrubber", "")];
        	//console.log(target.timeline);
            var posx = target.timeline.scrubber.position().left;

            target.timeline.truetime=(posx*target.timeline.timelength)/(target.timeline.element.width()-10);
            target.seek(target.timeline.truetime);

        }

    }
}

/*---------------------- video_Players ----------------------------*/

var video_Player = function(parent, data, idnum, width) {
	this.data = data;
	this.parent=parent;
	this.idnum = idnum;
	this.id = this.data.id+this.idnum;
    this.player=null;
    this.width = width;
    //console.log("videoPlayer is called")
    this.player_container = save_element(this.parent, "div", this.id+"_container", ["player_container"]);

    var address = "http://www.youtube.com/apiplayer?controls=0"+
    			  	"&enablejsapi=1"+
    			  	"&rel=0"+
					"&showinfo=0"+
    				"&autohide=1"+
    				"&playerapiid="+this.id+
    				"&version=3"+
    				"&autoplay=0";

    var element = create_element("object", this.id, ["video_player"], {"type":"application/x-shockwave-flash", 
    																	"data": address, 
    																	"width":this.width})

    var param = create_element("param", null, null, {"name":"allowScriptAccess", "value":"always"})
	var param2 = create_element("param", null, null, {"name":"wmode", "value":"opaque"})

	element.appendChild(param);
    element.appendChild(param2);

    this.player_container.append(element);
    
    this.timeline = new timeline_Player(this.player_container, this.id);

    var height = this.width*(9/16)
    this.player_area = save_element(this.player_container, "div", this.id+"_area", ["player_area"]);
    this.player_area.css({"width":this.width, "height": height});

    this.player_element = $("object#"+this.id);
	this.player = document.getElementById(this.id);

	this.player_area.click($.proxy(this.on_click, this));
	this.playerflag=false;
    this.loaded=false;

    this.interval = null;
   // console.log("videoPlayer finishes everything")

}

video_Player.prototype = {

	on_playing: function() {
		//console.log("on_playing")
		try {
			if (this.player.getPlayerState()==1) {
				this.checkposition();
			}
		} catch(e){
			//console.log(e);
		}
    },

	on_player_State_Change: function(event) {

		if (event=='1') {
			this.playerflag=true;
			this.timeline.timelength = this.player.getDuration();
			Control.currently_playing=this;
			this.interval = setInterval($.proxy(this.checkposition, this), 250);
		} else {
			this.playerflag=false;
			if ((Control.currently_playing!=null) && (Control.currently_playing==this)) Control.currently_playing=null;
			clearInterval(this.interval);
		}
		if (event=='5') {
			this.loaded = true;
			this.timeline.timelength = this.player.getDuration();
		}
	},

	on_player_Error: function(event) {
		//console.log(event);
		//console.log(data.title);
	},

	on_click: function(event) {

		if (this.playerflag) {
			this.pause();
		} else {
			this.play();
		}
	},

    play: function() {
		if (this.loaded){
			if ((Control.currently_playing!=this) && (Control.currently_playing!=null)) {
				Control.currently_playing.pause();
			}
			this.player.playVideo();
			//this.playerflag=true;
		} else {
			console.log("not loaded");	
		}     
    },

    pause: function() {
        this.player.pauseVideo();
        
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

    seekload: function(seconds) {
    	this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.player.playVideo();
		this.player.pauseVideo();	
    },


	checkposition: function() {
		//console.log("chackposition")
        var timer = this.player.getCurrentTime();
        this.timeline.updatepos(timer);
    }
	
}